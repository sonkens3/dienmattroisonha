import type { Project, ProjectMedia } from "@/data/projects";

const LOCAL_PROJECTS_KEY = "son-ha-local-projects";
const DB_NAME = "son-ha-project-media";
const DB_VERSION = 1;
const STORE_NAME = "media";
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80";

export type LocalProject = Project & {
  source: "local";
  baseProjectId?: string;
  createdAt: string;
  updatedAt: string;
  imageMediaKey?: string;
  videoMediaKey?: string;
  externalVideoUrl?: string;
};

type MediaRecord = {
  key: string;
  blob: Blob;
  name: string;
  type: string;
  size: number;
  createdAt: string;
};

export function loadLocalProjects() {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem(LOCAL_PROJECTS_KEY) ?? "[]") as LocalProject[];
  } catch {
    return [];
  }
}

export function mergeProjectsWithLocal(seedProjects: Project[], localProjects: Project[]) {
  const overrides = new Map<string, Project>();
  const additions: Project[] = [];

  localProjects.forEach((project) => {
    const localProject = project as LocalProject;

    if (localProject.baseProjectId) {
      overrides.set(localProject.baseProjectId, project);
      return;
    }

    additions.push(project);
  });

  const mergedSeeds = seedProjects.map((project) => overrides.get(project.id) ?? project);
  return [...additions, ...mergedSeeds];
}

export function saveLocalProjects(projects: LocalProject[]) {
  localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(projects));
  window.dispatchEvent(new Event("sonha-projects-updated"));
}

export function upsertLocalProject(project: LocalProject) {
  const current = loadLocalProjects();
  const next = [project, ...current.filter((item) => item.id !== project.id)];
  saveLocalProjects(next);
}

export async function deleteLocalProject(id: string) {
  const current = loadLocalProjects();
  const project = current.find((item) => item.id === id);
  saveLocalProjects(current.filter((item) => item.id !== id));

  const mediaKeys = new Set(
    [
      project?.imageMediaKey,
      project?.videoMediaKey,
      ...(project?.gallery ?? []).map((item) => item.mediaKey),
    ].filter(Boolean) as string[],
  );

  await Promise.all(Array.from(mediaKeys).map((key) => deleteMediaFile(key)));
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

export function createMediaKey(projectId: string, field: "image" | "video") {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  return `${projectId}-${field}-${Date.now().toString(36)}-${suffix}`;
}

export async function saveMediaFile(key: string, file: File) {
  const db = await openMediaDb();
  const record: MediaRecord = {
    key,
    blob: file,
    name: file.name,
    type: file.type,
    size: file.size,
    createdAt: new Date().toISOString(),
  };

  await requestToPromise(db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(record));
  db.close();
}

export async function deleteMediaFile(key: string) {
  const db = await openMediaDb();
  await requestToPromise(db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).delete(key));
  db.close();
}

export async function getMediaObjectUrl(key?: string) {
  if (!key || typeof window === "undefined") return null;

  const db = await openMediaDb();
  const record = (await requestToPromise(
    db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(key),
  )) as MediaRecord | undefined;
  db.close();

  return record ? URL.createObjectURL(record.blob) : null;
}

export async function resolveLocalProjectMedia(project: LocalProject): Promise<Project> {
  const [imageUrl, videoUrl, gallery] = await Promise.all([
    getMediaObjectUrl(project.imageMediaKey),
    getMediaObjectUrl(project.videoMediaKey),
    resolveGalleryMedia(project.gallery),
  ]);

  return {
    ...project,
    image: imageUrl ?? project.image ?? FALLBACK_IMAGE,
    video: videoUrl ?? project.externalVideoUrl ?? project.video,
    gallery,
  };
}

export async function loadResolvedLocalProjects() {
  return Promise.all(loadLocalProjects().map(resolveLocalProjectMedia));
}

function openMediaDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("Trình duyệt không hỗ trợ IndexedDB."));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

async function resolveGalleryMedia(gallery: ProjectMedia[] = []) {
  return Promise.all(
    gallery.map(async (item) => {
      const objectUrl = await getMediaObjectUrl(item.mediaKey);

      return {
        ...item,
        url: objectUrl ?? item.url,
      };
    }),
  );
}

function requestToPromise<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}
