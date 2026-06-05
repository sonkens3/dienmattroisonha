"use client";

import { Database, Edit3, ImagePlus, PlusCircle, RefreshCw, Trash2, Video, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { projects as seedProjects, type Project, type ProjectMedia } from "@/data/projects";
import {
  createProjectId,
  createProjectMediaId,
  DEFAULT_PROJECT_ADMIN_TOKEN,
  deleteRemoteProject,
  fetchRemoteProjects,
  loadProjectAdminToken,
  mergeProjectsWithRemote,
  saveRemoteProject,
  type ManagedProject,
  type ProjectUploadInput,
} from "@/lib/remoteProjects";

type SaveState = {
  status: "idle" | "saving" | "saved" | "error";
  message: string;
};

type LoadState = {
  status: "idle" | "loading" | "loaded" | "error";
  message: string;
};

type EditingState =
  | { mode: "create" }
  | {
      mode: "edit";
      project: Project;
      remoteProject?: ManagedProject;
      baseProjectId?: string;
    };

const defaultImage =
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80";

export function AdminProjectTable() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [remoteProjects, setRemoteProjects] = useState<ManagedProject[]>([]);
  const [editing, setEditing] = useState<EditingState>({ mode: "create" });
  const [adminToken] = useState(() => loadProjectAdminToken());
  const [saveState, setSaveState] = useState<SaveState>({ status: "idle", message: "" });
  const [loadState, setLoadState] = useState<LoadState>({
    status: "loading",
    message: "Đang tải dữ liệu dự án từ Google Sheet...",
  });
  const seedIds = useMemo(() => new Set(seedProjects.map((project) => project.id)), []);

  const addedProjects = useMemo(
    () => remoteProjects.filter((project) => !project.baseProjectId && !seedIds.has(project.id)),
    [remoteProjects, seedIds],
  );

  const managedSeedProjects = useMemo(
    () =>
      mergeProjectsWithRemote(seedProjects, remoteProjects).filter((project) => {
        const remoteProject = project as ManagedProject;
        return seedIds.has(project.id) || Boolean(remoteProject.baseProjectId && seedIds.has(remoteProject.baseProjectId));
      }),
    [remoteProjects, seedIds],
  );

  async function refreshRemoteProjects(showLoading = false) {
    if (showLoading) {
      setLoadState({ status: "loading", message: "Đang tải dữ liệu dự án từ Google Sheet..." });
    }

    const result = await fetchRemoteProjects({ useCache: true });
    setRemoteProjects(result.projects);

    if (result.error) {
      setLoadState({
        status: result.fromCache ? "loaded" : "error",
        message: result.fromCache
          ? `Đang dùng dữ liệu cache vì chưa tải được Google Sheet: ${result.error}`
          : `Chưa tải được dữ liệu Google Sheet: ${result.error}`,
      });
      return;
    }

    setLoadState({
      status: "loaded",
      message: result.projects.length
        ? `Đã tải ${result.projects.length} bản ghi dự án từ Google Sheet.`
        : "Chưa có dự án tùy chỉnh trên Google Sheet, web đang dùng dữ liệu mẫu trong code.",
    });
  }

  useEffect(() => {
    let mounted = true;

    async function loadInitialProjects() {
      const result = await fetchRemoteProjects({ useCache: true });
      if (!mounted) return;

      setRemoteProjects(result.projects);

      if (result.error) {
        setLoadState({
          status: result.fromCache ? "loaded" : "error",
          message: result.fromCache
            ? `Đang dùng dữ liệu cache vì chưa tải được Google Sheet: ${result.error}`
            : `Chưa tải được dữ liệu Google Sheet: ${result.error}`,
        });
        return;
      }

      setLoadState({
        status: "loaded",
        message: result.projects.length
          ? `Đã tải ${result.projects.length} bản ghi dự án từ Google Sheet.`
          : "Chưa có dự án tùy chỉnh trên Google Sheet, web đang dùng dữ liệu mẫu trong code.",
      });
    }

    void loadInitialProjects();

    const handleProjectsUpdated = () => {
      void refreshRemoteProjects();
    };

    window.addEventListener("sonha-remote-projects-updated", handleProjectsUpdated);

    return () => {
      mounted = false;
      window.removeEventListener("sonha-remote-projects-updated", handleProjectsUpdated);
    };
  }, []);

  function startCreate() {
    setEditing({ mode: "create" });
    setSaveState({ status: "idle", message: "" });
    formRef.current?.reset();
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function startEdit(project: Project) {
    const projectAsRemote = project as ManagedProject;
    const seedId = seedIds.has(project.id) ? project.id : projectAsRemote.baseProjectId;
    const remoteProject = remoteProjects.find(
      (item) => item.id === project.id || item.baseProjectId === project.id || (seedId ? item.baseProjectId === seedId || item.id === seedId : false),
    );

    setEditing({
      mode: "edit",
      project,
      remoteProject,
      baseProjectId: seedId,
    });
    setSaveState({ status: "idle", message: "" });
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminToken.trim()) {
      setSaveState({
        status: "error",
        message: `Apps Script chưa có mã quản trị mặc định. Hãy đặt Script Property PROJECT_ADMIN_TOKEN = ${DEFAULT_PROJECT_ADMIN_TOKEN}.`,
      });
      return;
    }

    setSaveState({ status: "saving", message: "Đang lưu công trình lên Google Sheet và Google Drive..." });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = getValue(formData, "title");
    const existingRemote = editing.mode === "edit" ? editing.remoteProject : undefined;
    const baseProjectId = editing.mode === "edit" ? editing.baseProjectId : undefined;
    const id = editing.mode === "edit" ? existingRemote?.id ?? editing.project.id : createProjectId(title);
    const imageFile = getFile(formData, "image");
    const videoFile = getFile(formData, "video");
    const existingGallery = editing.mode === "edit" ? existingRemote?.gallery ?? editing.project.gallery ?? [] : [];
    const keptGallery = getKeptGallery(formData, existingGallery);
    const galleryFiles = getFiles(formData, "galleryFiles");
    const galleryCaptions = splitLines(getValue(formData, "galleryCaptions"));
    const galleryDescriptions = splitLines(getValue(formData, "galleryDescriptions"));
    const uploadedGallery = galleryFiles.map((file, index) => {
      const type: ProjectMedia["type"] = file.type.startsWith("video") ? "video" : "image";
      const mediaId = createProjectMediaId(id, type);

      return {
        media: {
          id: mediaId,
          type,
          url: "",
          caption: galleryCaptions[index] || file.name || "Ảnh/video thực tế công trình",
          description:
            galleryDescriptions[index] ||
            "Tư liệu thực tế giúp khách xem rõ quá trình khảo sát, thi công và bàn giao.",
        } satisfies ProjectMedia,
        file,
      };
    });
    const externalVideoUrl = getValue(formData, "externalVideoUrl");
    const now = new Date().toISOString();

    const uploadFiles: ProjectUploadInput[] = [
      imageFile ? { field: "image", file: imageFile } : null,
      videoFile ? { field: "video", file: videoFile } : null,
      ...uploadedGallery.map((item) => ({
        field: "gallery" as const,
        targetId: item.media.id,
        file: item.file,
      })),
    ].filter((item): item is ProjectUploadInput => Boolean(item));

    const project: ManagedProject = {
      id,
      source: "remote",
      baseProjectId,
      createdAt: existingRemote?.createdAt ?? now,
      updatedAt: now,
      title,
      location: getValue(formData, "location") || "Chưa cập nhật",
      type: getValue(formData, "type") || "Nhà dân",
      monthlyBill: getValue(formData, "monthlyBill") || "Chưa cập nhật",
      systemSize: getValue(formData, "systemSize") || "Chưa cập nhật",
      panels: getValue(formData, "panels") || "Theo phương án",
      inverter: getValue(formData, "inverter") || "Theo phương án",
      estimatedOutput: getValue(formData, "estimatedOutput") || "Theo khảo sát",
      payback: getValue(formData, "payback") || "Từ 3 năm",
      cost: getValue(formData, "cost") || "Theo khảo sát",
      hasStorage: formData.get("hasStorage") === "on",
      image: existingRemote?.image ?? (editing.mode === "edit" ? editing.project.image : defaultImage),
      video: externalVideoUrl || existingRemote?.video || (editing.mode === "edit" ? editing.project.video : undefined),
      gallery: [...keptGallery, ...uploadedGallery.map((item) => item.media)],
      summary:
        getValue(formData, "summary") ||
        "Công trình thực tế do Điện mặt trời Sơn Hà khảo sát, thiết kế và thi công.",
      details: splitLines(getValue(formData, "details")),
    };

    if (!project.details.length) {
      project.details = [
        "Khảo sát mái, hướng nắng, bóng che và vị trí đi dây.",
        "Tính công suất theo hóa đơn điện và nhu cầu sử dụng thực tế.",
        "Bàn giao app theo dõi sản lượng sau khi vận hành.",
      ];
    }

    try {
      const savedProject = await saveRemoteProject(project, {
        adminToken,
        files: uploadFiles,
      });

      setRemoteProjects((current) => [savedProject, ...current.filter((item) => item.id !== savedProject.id)]);
      setEditing({ mode: "edit", project: savedProject, remoteProject: savedProject, baseProjectId });
      setSaveState({
        status: "saved",
        message:
          editing.mode === "edit"
            ? "Đã cập nhật công trình lên Google Sheet/Drive. Thiết bị khác tải lại web sẽ thấy nội dung mới."
            : "Đã thêm công trình lên Google Sheet/Drive. Thiết bị khác tải lại web sẽ thấy dự án mới.",
      });

      if (editing.mode === "create") form.reset();
      void refreshRemoteProjects();
    } catch (error) {
      setSaveState({
        status: "error",
        message: formatProjectError(error, "Không lưu được công trình. Vui lòng thử lại."),
      });
    }
  }

  async function handleDelete(id: string) {
    if (!adminToken.trim()) {
      setSaveState({
        status: "error",
        message: `Apps Script chưa có mã quản trị mặc định. Hãy đặt Script Property PROJECT_ADMIN_TOKEN = ${DEFAULT_PROJECT_ADMIN_TOKEN}.`,
      });
      return;
    }

    if (!window.confirm("Xóa dự án này khỏi Google Sheet? Ảnh/video trên Google Drive sẽ không tự xóa.")) return;

    try {
      await deleteRemoteProject(id, adminToken);
      setRemoteProjects((current) => current.filter((project) => project.id !== id));
      setSaveState({ status: "saved", message: "Đã xóa dự án khỏi danh sách hiển thị trên Google Sheet." });
      if (editing.mode === "edit" && editing.remoteProject?.id === id) startCreate();
      void refreshRemoteProjects();
    } catch (error) {
      setSaveState({
        status: "error",
        message: formatProjectError(error, "Không xóa được dự án. Vui lòng thử lại."),
      });
    }
  }

  const editingProject = editing.mode === "edit" ? editing.project : undefined;
  const isEditing = editing.mode === "edit";
  const galleryItems = editingProject?.gallery ?? [];

  return (
    <section className="grid gap-6">
      <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-700">
              <Database size={16} aria-hidden />
            </div>
            <div>
              <p className="text-sm font-black text-slate-950">Dữ liệu dự án dùng chung cho mọi thiết bị</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{loadState.message}</p>
            </div>
          </div>

          <div>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-teal-700 hover:text-teal-800"
              onClick={() => void refreshRemoteProjects(true)}
            >
              <RefreshCw size={16} aria-hidden />
              Tải lại dữ liệu
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              {isEditing ? "Sửa công trình" : "Thêm công trình đã thi công"}
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Có thể sửa cả dự án mẫu. Ảnh/video upload sẽ được Apps Script đưa lên Google Drive rồi trả link về web.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 hover:border-teal-700"
            onClick={startCreate}
          >
            {isEditing ? <X size={16} aria-hidden /> : <PlusCircle size={16} aria-hidden />}
            {isEditing ? "Hủy sửa" : "Thêm mới"}
          </button>
        </div>

        {saveState.status !== "idle" ? (
          <div
            className={`mt-4 rounded-lg border p-3 text-sm font-semibold ${
              saveState.status === "saved"
                ? "border-teal-200 bg-teal-50 text-teal-900"
                : saveState.status === "error"
                  ? "border-red-200 bg-red-50 text-red-900"
                  : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            {saveState.message}
          </div>
        ) : null}

        <form ref={formRef} className="mt-5 grid gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Tên công trình" name="title" placeholder="Ví dụ: Nhà phố 6kW tại Hà Nội" defaultValue={editingProject?.title} required />
            <Field label="Địa điểm" name="location" placeholder="Ví dụ: Hà Nội" defaultValue={editingProject?.location} />
            <Select
              label="Loại công trình"
              name="type"
              defaultValue={editingProject?.type}
              options={["Nhà dân", "Nhà nghỉ", "Quán cafe", "Xưởng", "Văn phòng", "Khác"]}
            />
            <Field label="Công suất" name="systemSize" placeholder="Ví dụ: 10kW" defaultValue={editingProject?.systemSize} />
            <Field label="Số tấm pin" name="panels" placeholder="Ví dụ: Khoảng 16 tấm pin" defaultValue={editingProject?.panels} />
            <Field label="Inverter" name="inverter" placeholder="Ví dụ: Inverter 10kW 3 pha" defaultValue={editingProject?.inverter} />
            <Field label="Tiền điện trước lắp" name="monthlyBill" placeholder="Ví dụ: 5-7 triệu/tháng" defaultValue={editingProject?.monthlyBill} />
            <Field label="Sản lượng dự kiến" name="estimatedOutput" placeholder="Ví dụ: 35-45 kWh/ngày" defaultValue={editingProject?.estimatedOutput} />
            <Field label="Hoàn vốn" name="payback" placeholder="Ví dụ: Từ 3.5 năm" defaultValue={editingProject?.payback} />
            <Field label="Chi phí tham khảo" name="cost" placeholder="Ví dụ: 120-160 triệu" defaultValue={editingProject?.cost} />
            <FileField label="Upload ảnh đại diện mới" name="image" accept="image/*" icon="image" />
            <FileField label="Upload video đại diện mới" name="video" accept="video/*" icon="video" />
            <Field
              label="Link video ngoài"
              name="externalVideoUrl"
              placeholder="MP4/YouTube/Facebook nếu có"
              defaultValue={editingProject?.video}
            />
            <label className="flex min-h-[46px] items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700">
              <input type="checkbox" name="hasStorage" className="h-4 w-4" defaultChecked={editingProject?.hasStorage} key={editingProject?.id ?? "create-storage"} />
              Có pin lưu trữ
            </label>
          </div>

          <div>
            <label className="label" htmlFor="summary">
              Mô tả ngắn
            </label>
            <textarea
              id="summary"
              name="summary"
              rows={3}
              className="field resize-y"
              placeholder="Tóm tắt nhu cầu, đặc điểm mái và hiệu quả của công trình."
              defaultValue={editingProject?.summary}
              key={`${editingProject?.id ?? "create"}-summary`}
            />
          </div>

          <div>
            <label className="label" htmlFor="details">
              Nội dung chi tiết
            </label>
            <textarea
              id="details"
              name="details"
              rows={5}
              className="field resize-y"
              placeholder="Mỗi dòng là một ý: khảo sát mái, phương án vật tư, bàn giao app..."
              defaultValue={editingProject?.details.join("\n")}
              key={`${editingProject?.id ?? "create"}-details`}
            />
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="font-bold text-slate-950">Gallery ảnh/video công trình</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Sửa mô tả media cũ hoặc upload thêm nhiều ảnh/video để trang chi tiết nhìn thực tế hơn.
                </p>
              </div>
              <span className="text-xs font-bold uppercase tracking-wide text-teal-700">
                {galleryItems.length} media hiện có
              </span>
            </div>

            {galleryItems.length ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {galleryItems.map((item) => (
                  <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                      <input
                        type="checkbox"
                        name="keepGalleryIds"
                        value={item.id}
                        defaultChecked
                        className="h-4 w-4"
                      />
                      Giữ lại mục {item.type === "video" ? "video" : "ảnh"} này
                    </label>
                    <div className="mt-3 grid gap-3">
                      <Field
                        label="Tiêu đề media"
                        name={`galleryCaption-${item.id}`}
                        defaultValue={item.caption}
                        placeholder="Ví dụ: Ảnh mái sau khi hoàn thiện"
                      />
                      <div>
                        <label className="label" htmlFor={`galleryDescription-${item.id}`}>
                          Mô tả media
                        </label>
                        <textarea
                          id={`galleryDescription-${item.id}`}
                          name={`galleryDescription-${item.id}`}
                          rows={3}
                          className="field resize-y"
                          defaultValue={item.description}
                          placeholder="Ghi rõ điểm đáng tin: vị trí lắp, vật tư, nghiệm thu, sản lượng..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <FileField
                label="Upload thêm nhiều ảnh/video"
                name="galleryFiles"
                accept="image/*,video/*"
                icon="image"
                multiple
              />
              <div>
                <label className="label" htmlFor="galleryCaptions">
                  Tiêu đề media mới
                </label>
                <textarea
                  id="galleryCaptions"
                  name="galleryCaptions"
                  rows={4}
                  className="field resize-y"
                  placeholder="Mỗi dòng tương ứng một file upload. Ví dụ: Lắp khung trên mái tôn"
                />
              </div>
              <div className="md:col-span-2">
                <label className="label" htmlFor="galleryDescriptions">
                  Mô tả media mới
                </label>
                <textarea
                  id="galleryDescriptions"
                  name="galleryDescriptions"
                  rows={4}
                  className="field resize-y"
                  placeholder="Mỗi dòng tương ứng một file upload. Ví dụ: Khung nhôm được bắt theo xà gồ, chừa lối bảo trì và đi dây gọn về tủ AC/DC."
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saveState.status === "saving" || loadState.status === "loading"}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-700 px-5 py-3 font-bold text-white hover:bg-teal-800 disabled:bg-slate-400"
          >
            {isEditing ? <Edit3 size={18} aria-hidden /> : <ImagePlus size={18} aria-hidden />}
            {saveState.status === "saving" ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Thêm công trình"}
          </button>
        </form>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">Công trình admin đã thêm trên Google Sheet</h2>
        <p className="mt-1 text-sm text-slate-600">
          Các công trình này sẽ hiển thị trước dữ liệu mẫu trên trang chủ và trang dự án.
        </p>
        <ProjectTable projects={addedProjects} onEdit={startEdit} onDelete={handleDelete} editable />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">Dự án mẫu có sẵn</h2>
        <p className="mt-1 text-sm text-slate-600">
          Bấm sửa để tạo bản ghi ghi đè trên Google Sheet. Nội dung mẫu gốc trong code không bị mất.
        </p>
        <ProjectTable projects={managedSeedProjects} onEdit={startEdit} />
      </div>
    </section>
  );
}

function ProjectTable({
  projects,
  editable = false,
  onEdit,
  onDelete,
}: {
  projects: Project[];
  editable?: boolean;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <div className="table-scroll mt-5">
      <table className="min-w-[980px] w-full border-collapse text-left text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-3 py-3">Tên dự án</th>
            <th className="px-3 py-3">Loại</th>
            <th className="px-3 py-3">Công suất</th>
            <th className="px-3 py-3">Pin</th>
            <th className="px-3 py-3">Hoàn vốn</th>
            <th className="px-3 py-3">Media</th>
            <th className="px-3 py-3">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {projects.length ? (
            projects.map((project) => (
              <tr key={project.id} className="border-t border-slate-200">
                <td className="px-3 py-3 font-bold text-slate-950">{project.title}</td>
                <td className="px-3 py-3">{project.type}</td>
                <td className="px-3 py-3">{project.systemSize}</td>
                <td className="px-3 py-3">{project.panels}</td>
                <td className="px-3 py-3">{project.payback}</td>
                <td className="px-3 py-3">
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                    {project.video ? <Video size={13} aria-hidden /> : <ImagePlus size={13} aria-hidden />}
                    {(project.gallery?.length ?? 0) || 1} mục
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs font-bold text-slate-700 hover:border-teal-700 hover:text-teal-800"
                      onClick={() => onEdit?.(project)}
                    >
                      <Edit3 size={13} aria-hidden />
                      Sửa
                    </button>
                    {editable ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs font-bold text-red-700 hover:bg-red-50"
                        onClick={() => onDelete?.(project.id)}
                      >
                        <Trash2 size={13} aria-hidden />
                        Xóa
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-3 py-8 text-center text-slate-500">
                Chưa có công trình admin thêm.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Field({
  label,
  name,
  placeholder,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <input
        key={`${name}-${defaultValue ?? "create"}`}
        id={name}
        name={name}
        className="field"
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
      />
    </div>
  );
}

function Select({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  options: string[];
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <select
        key={`${name}-${defaultValue ?? "create"}`}
        id={name}
        name={name}
        className="field"
        defaultValue={defaultValue ?? options[0]}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function FileField({
  label,
  name,
  accept,
  icon,
  multiple,
}: {
  label: string;
  name: string;
  accept: string;
  icon: "image" | "video";
  multiple?: boolean;
}) {
  const Icon = icon === "image" ? ImagePlus : Video;

  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <label className="flex min-h-[46px] cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-300 bg-white px-3 text-sm font-bold text-slate-700 hover:border-teal-700">
        <Icon size={18} aria-hidden />
        <span>{multiple ? "Chọn nhiều file" : "Chọn file"}</span>
        <input id={name} name={name} type="file" accept={accept} multiple={multiple} className="sr-only" />
      </label>
    </div>
  );
}

function getKeptGallery(formData: FormData, gallery: ProjectMedia[]) {
  if (!gallery.length) return [];

  const keepIds = new Set(formData.getAll("keepGalleryIds").filter((value): value is string => typeof value === "string"));

  return gallery
    .filter((item) => keepIds.has(item.id))
    .map((item) => ({
      ...item,
      caption: getValue(formData, `galleryCaption-${item.id}`) || item.caption,
      description: getValue(formData, `galleryDescription-${item.id}`) || item.description,
    }));
}

function getFile(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

function getFiles(formData: FormData, key: string) {
  return formData.getAll(key).filter((value): value is File => value instanceof File && value.size > 0);
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function formatProjectError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : "";

  if (message.includes("PROJECT_ADMIN_TOKEN") || message.includes("Mã đồng bộ admin")) {
    return `Apps Script chưa khớp mã quản trị. Trong Script Properties đặt PROJECT_ADMIN_TOKEN = ${DEFAULT_PROJECT_ADMIN_TOKEN}, rồi deploy New version.`;
  }

  return message || fallback;
}
