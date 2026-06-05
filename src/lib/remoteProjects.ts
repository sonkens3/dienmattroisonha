import type { Project, ProjectMedia } from "@/data/projects";

const DEFAULT_PROJECTS_API_URL =
  "https://script.google.com/macros/s/AKfycbzTXqxrjxvuB8DUe-nj4E2DxqH4zOvIu2ZPh-fUOFT-XN4NyZX5QIwimPGnu0gEbUY/exec";
const PROJECTS_CACHE_KEY = "son-ha-remote-projects-cache";
export const DEFAULT_PROJECT_ADMIN_TOKEN =
  process.env.NEXT_PUBLIC_PROJECT_ADMIN_TOKEN?.trim() || "SonHaSync_2026";

const MAX_PROJECT_FILE_SIZE = 12 * 1024 * 1024;
const MAX_PROJECT_UPLOAD_BYTES = 22 * 1024 * 1024;

export type ManagedProject = Project & {
  source?: "remote";
  baseProjectId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProjectUploadInput = {
  field: "image" | "video" | "gallery";
  targetId?: string;
  file: File;
};

export type RemoteProjectsResult = {
  projects: ManagedProject[];
  fromCache: boolean;
  configured: boolean;
  error?: string;
};

type SerializedProjectFile = {
  field: ProjectUploadInput["field"];
  targetId?: string;
  name: string;
  type: string;
  size: number;
  dataBase64: string;
};

const configuredProjectsApiUrl =
  process.env.NEXT_PUBLIC_PROJECTS_API_URL?.trim() ||
  process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL?.trim() ||
  DEFAULT_PROJECTS_API_URL;

export function getProjectsApiUrl() {
  return configuredProjectsApiUrl;
}

export function loadProjectAdminToken() {
  return DEFAULT_PROJECT_ADMIN_TOKEN;
}

export function loadCachedRemoteProjects() {
  return loadProjectsCache();
}

export function createProjectId(title: string) {
  const slug =
    title
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 44) || "du-an";

  return `${slug}-${Date.now().toString(36)}`;
}

export function createProjectMediaId(projectId: string, type: "image" | "video") {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  return `${projectId}-${type}-${Date.now().toString(36)}-${suffix}`;
}

export async function fetchRemoteProjects(options: { useCache?: boolean } = {}): Promise<RemoteProjectsResult> {
  if (!configuredProjectsApiUrl) {
    return {
      projects: [],
      fromCache: false,
      configured: false,
      error: "Chưa cấu hình URL Google Apps Script cho dự án.",
    };
  }

  try {
    const url = new URL(configuredProjectsApiUrl);
    url.searchParams.set("action", "projects");
    url.searchParams.set("v", Date.now().toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Apps Script trả về HTTP ${response.status}`);
    }

    const data = (await response.json().catch(() => null)) as { projects?: unknown[] } | null;
    const projects = Array.isArray(data?.projects)
      ? data.projects.map(normalizeProject).filter((project): project is ManagedProject => Boolean(project))
      : [];

    saveProjectsCache(projects);

    return {
      projects,
      fromCache: false,
      configured: true,
    };
  } catch (error) {
    const cachedProjects = options.useCache === false ? [] : loadProjectsCache();

    return {
      projects: cachedProjects,
      fromCache: cachedProjects.length > 0,
      configured: true,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export function mergeProjectsWithRemote(seedProjects: Project[], remoteProjects: Project[]) {
  const seedIds = new Set(seedProjects.map((project) => project.id));
  const overrides = new Map<string, Project>();
  const additions: Project[] = [];

  remoteProjects.forEach((project) => {
    const remoteProject = project as ManagedProject;
    const baseProjectId = remoteProject.baseProjectId || (seedIds.has(project.id) ? project.id : "");

    if (baseProjectId && seedIds.has(baseProjectId)) {
      overrides.set(baseProjectId, project);
      return;
    }

    additions.push(project);
  });

  return [...additions, ...seedProjects.map((project) => overrides.get(project.id) ?? project)];
}

export async function saveRemoteProject(
  project: ManagedProject,
  options: {
    adminToken: string;
    files?: ProjectUploadInput[];
  },
) {
  const data = await postProjectAction("saveProject", {
    adminToken: options.adminToken,
    project,
    files: await serializeProjectFiles(options.files ?? []),
  });
  const savedProject = normalizeProject(data.project);

  if (!savedProject) {
    throw new Error("Apps Script chưa trả về dữ liệu dự án. Hãy cập nhật code Apps Script và deploy phiên bản mới.");
  }

  updateProjectsCache(savedProject);
  dispatchProjectsUpdated();

  return savedProject;
}

export async function deleteRemoteProject(id: string, adminToken: string) {
  await postProjectAction("deleteProject", {
    adminToken,
    id,
  });

  removeProjectFromCache(id);
  dispatchProjectsUpdated();
}

async function postProjectAction(action: string, payload: Record<string, unknown>) {
  if (!configuredProjectsApiUrl) {
    throw new Error("Chưa cấu hình URL Google Apps Script cho dự án.");
  }

  const response = await fetch(configuredProjectsApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      action,
      ...payload,
    }),
  });

  if (!response.ok) {
    throw new Error(`Apps Script trả về HTTP ${response.status}`);
  }

  const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string; [key: string]: unknown } | null;

  if (!data?.ok) {
    throw new Error(data?.error || "Apps Script không lưu được dự án.");
  }

  return data;
}

async function serializeProjectFiles(files: ProjectUploadInput[]): Promise<SerializedProjectFile[]> {
  const validFiles = files.filter((item) => item.file.size > 0);
  const totalSize = validFiles.reduce((sum, item) => sum + item.file.size, 0);

  if (totalSize > MAX_PROJECT_UPLOAD_BYTES) {
    throw new Error("Tổng ảnh/video mỗi lần lưu nên dưới 22MB. Hãy nén file hoặc chia thành nhiều lần upload.");
  }

  return Promise.all(
    validFiles.map(async (item) => {
      if (item.file.size > MAX_PROJECT_FILE_SIZE) {
        throw new Error(`File ${item.file.name} lớn hơn 12MB. Hãy nén file trước khi upload.`);
      }

      return {
        field: item.field,
        targetId: item.targetId,
        name: item.file.name,
        type: item.file.type,
        size: item.file.size,
        dataBase64: await fileToBase64(item.file),
      };
    }),
  );
}

function normalizeProject(input: unknown): ManagedProject | null {
  if (!input || typeof input !== "object") return null;

  const item = input as Partial<ManagedProject>;
  const id = stringOrDefault(item.id, "");
  const title = stringOrDefault(item.title, "");

  if (!id || !title) return null;

  return {
    id,
    source: "remote",
    baseProjectId: stringOrDefault(item.baseProjectId, ""),
    createdAt: stringOrDefault(item.createdAt, ""),
    updatedAt: stringOrDefault(item.updatedAt, ""),
    title,
    location: stringOrDefault(item.location, "Chưa cập nhật"),
    type: stringOrDefault(item.type, "Nhà dân"),
    monthlyBill: stringOrDefault(item.monthlyBill, "Chưa cập nhật"),
    systemSize: stringOrDefault(item.systemSize, "Chưa cập nhật"),
    panels: stringOrDefault(item.panels, "Theo phương án"),
    inverter: stringOrDefault(item.inverter, "Theo phương án"),
    estimatedOutput: stringOrDefault(item.estimatedOutput, "Theo khảo sát"),
    payback: stringOrDefault(item.payback, "Từ 3 năm"),
    cost: stringOrDefault(item.cost, "Theo khảo sát"),
    hasStorage: Boolean(item.hasStorage),
    image: stringOrDefault(item.image, "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80"),
    video: stringOrDefault(item.video, ""),
    gallery: Array.isArray(item.gallery)
      ? item.gallery.map(normalizeMedia).filter((media): media is ProjectMedia => Boolean(media))
      : [],
    summary: stringOrDefault(
      item.summary,
      "Công trình thực tế do Điện mặt trời Sơn Hà khảo sát, thiết kế và thi công.",
    ),
    details: Array.isArray(item.details)
      ? item.details.map((detail) => String(detail).trim()).filter(Boolean)
      : [],
  };
}

function normalizeMedia(input: unknown): ProjectMedia | null {
  if (!input || typeof input !== "object") return null;

  const item = input as Partial<ProjectMedia>;
  const id = stringOrDefault(item.id, "");
  const type = item.type === "video" ? "video" : "image";
  const url = stringOrDefault(item.url, "");

  if (!id) return null;

  return {
    id,
    type,
    url,
    caption: stringOrDefault(item.caption, type === "video" ? "Video công trình" : "Ảnh công trình"),
    description: stringOrDefault(item.description, ""),
  };
}

function saveProjectsCache(projects: ManagedProject[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(projects));
}

function loadProjectsCache() {
  if (typeof window === "undefined") return [];

  try {
    const projects = JSON.parse(localStorage.getItem(PROJECTS_CACHE_KEY) ?? "[]") as unknown[];
    return projects.map(normalizeProject).filter((project): project is ManagedProject => Boolean(project));
  } catch {
    return [];
  }
}

function updateProjectsCache(project: ManagedProject) {
  const current = loadProjectsCache();
  saveProjectsCache([project, ...current.filter((item) => item.id !== project.id)]);
}

function removeProjectFromCache(id: string) {
  saveProjectsCache(loadProjectsCache().filter((project) => project.id !== id));
}

function dispatchProjectsUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("sonha-remote-projects-updated"));
}

function stringOrDefault(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
