"use client";

import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Maximize2,
  MessageCircle,
  PlayCircle,
  ShieldCheck,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { LeadForm } from "@/components/LeadForm";
import { projects as seedProjects } from "@/data/projects";
import type { Project, ProjectMedia } from "@/data/projects";
import { isPlayableVideoUrl } from "@/lib/media";
import { fetchRemoteProjects, mergeProjectsWithRemote, type ManagedProject } from "@/lib/remoteProjects";

type TabId = "overview" | "media" | "technical" | "process" | "lead";

const tabs: { id: TabId; label: string }[] = [
  { id: "media", label: "Hình ảnh & video" },
  { id: "overview", label: "Tổng quan" },
  { id: "technical", label: "Thông số" },
  { id: "process", label: "Thi công" },
  { id: "lead", label: "Tư vấn" },
];

export function ProjectDetailContent({ initialProject }: { initialProject: Project }) {
  const [project, setProject] = useState<Project>(initialProject);
  const [activeTab, setActiveTab] = useState<TabId>("media");
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const gallery = useMemo(() => buildGallery(project), [project]);
  const activeMedia =
    gallery[Math.min(selectedMediaIndex, gallery.length - 1)] ?? createCoverMedia(project);
  const lightboxMedia = lightboxIndex === null ? null : gallery[lightboxIndex] ?? null;

  useEffect(() => {
    let mounted = true;

    async function loadOverride() {
      const result = await fetchRemoteProjects({ useCache: true });
      const mergedProjects = mergeProjectsWithRemote(seedProjects, result.projects);
      const remoteProject = mergedProjects.find((item) => {
        const managedProject = item as ManagedProject;
        return item.id === initialProject.id || managedProject.baseProjectId === initialProject.id;
      });

      if (mounted && remoteProject) setProject(remoteProject);
    }

    void loadOverride();

    const handleProjectsUpdated = () => {
      void loadOverride();
    };

    window.addEventListener("sonha-remote-projects-updated", handleProjectsUpdated);

    return () => {
      mounted = false;
      window.removeEventListener("sonha-remote-projects-updated", handleProjectsUpdated);
    };
  }, [initialProject.id]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") {
        setLightboxIndex((current) => (current === null ? current : (current + 1) % gallery.length));
      }
      if (event.key === "ArrowLeft") {
        setLightboxIndex((current) => (current === null ? current : (current - 1 + gallery.length) % gallery.length));
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gallery.length, lightboxIndex]);

  function moveLightbox(direction: "left" | "right") {
    if (!gallery.length) return;

    setLightboxIndex((current) => {
      if (current === null) return current;
      if (direction === "right") return (current + 1) % gallery.length;
      return (current - 1 + gallery.length) % gallery.length;
    });
  }

  return (
    <>
      <section className="bg-slate-950 py-8 text-white sm:py-12">
        <div className="section-shell">
          <Link
            href="/projects"
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-amber-300"
          >
            <ArrowLeft size={16} aria-hidden />
            Quay lại dự án
          </Link>

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-teal-300">
                {project.type} · {project.location}
              </p>
              <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                {project.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                {project.summary}
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <HeroStat label="Công suất" value={project.systemSize} />
                <HeroStat label="Sản lượng" value={project.estimatedOutput} />
                <HeroStat label="Hoàn vốn" value={project.payback} />
                <HeroStat label="Media" value={`${gallery.length} mục`} />
              </dl>
            </div>

            <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-2xl">
              <MediaFrame
                media={activeMedia}
                fallbackImage={project.image}
                title={project.title}
                priority
                onOpen={() => setLightboxIndex(Math.max(0, selectedMediaIndex))}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="section-shell">
          <div className="carousel-no-scrollbar flex gap-2 overflow-x-auto py-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`shrink-0 rounded-md px-4 py-2 text-sm font-bold transition ${
                  activeTab === tab.id
                    ? "bg-teal-700 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-800"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-10 sm:py-14">
        <div className="section-shell grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0">
            {activeTab === "overview" ? <OverviewTab project={project} /> : null}
            {activeTab === "media" ? (
              <MediaTab
                gallery={gallery}
                selectedIndex={Math.min(selectedMediaIndex, gallery.length - 1)}
                onSelect={setSelectedMediaIndex}
                fallbackImage={project.image}
                title={project.title}
                onOpen={setLightboxIndex}
              />
            ) : null}
            {activeTab === "technical" ? <TechnicalTab project={project} /> : null}
            {activeTab === "process" ? <ProcessTab project={project} /> : null}
            {activeTab === "lead" ? <LeadTab project={project} /> : null}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-teal-700 text-white">
                <MessageCircle size={20} aria-hidden />
              </div>
              <h2 className="mt-4 text-2xl font-bold leading-tight text-slate-950">
                Muốn làm phương án tương tự?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Gửi thông tin công trình, hóa đơn điện và ảnh mái. Kỹ thuật sẽ tính hệ phù hợp rồi tư vấn trực tiếp.
              </p>
              <div className="mt-5">
                <LeadForm />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {lightboxMedia ? (
        <MediaLightbox
          media={lightboxMedia}
          fallbackImage={project.image}
          title={project.title}
          currentIndex={lightboxIndex ?? 0}
          total={gallery.length}
          onClose={() => setLightboxIndex(null)}
          onMove={moveLightbox}
        />
      ) : null}
    </>
  );
}

function OverviewTab({ project }: { project: Project }) {
  return (
    <div className="grid gap-6">
      <Panel>
        <SectionTitle eyebrow="Hồ sơ công trình" title="Tổng quan phương án đã triển khai" />
        <p className="mt-4 text-base leading-8 text-slate-700">{project.summary}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {project.details.map((detail) => (
            <div key={detail} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <CheckCircle2 className="mt-0.5 shrink-0 text-teal-700" size={20} aria-hidden />
              <p className="text-sm leading-6 text-slate-700">{detail}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <TrustCard
          icon={<ClipboardCheck size={22} aria-hidden />}
          title="Khảo sát trước khi chốt"
          text="Kiểm tra hướng mái, bóng che, lối đi dây và vị trí tủ điện trước khi báo phương án."
        />
        <TrustCard
          icon={<ShieldCheck size={22} aria-hidden />}
          title="Vật tư rõ cấu hình"
          text={`Pin ${project.panels}, ${project.inverter}, tủ bảo vệ AC/DC và phương án tiếp địa được thể hiện rõ.`}
        />
        <TrustCard
          icon={<Zap size={22} aria-hidden />}
          title="Theo dõi sau bàn giao"
          text="Chủ công trình được hướng dẫn xem sản lượng, kiểm tra vận hành và lịch bảo trì sau nghiệm thu."
        />
      </div>
    </div>
  );
}

function MediaTab({
  gallery,
  selectedIndex,
  onSelect,
  fallbackImage,
  title,
  onOpen,
}: {
  gallery: ProjectMedia[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  fallbackImage: string;
  title: string;
  onOpen: (index: number) => void;
}) {
  const activeMedia = gallery[selectedIndex] ?? gallery[0];
  const currentMedia =
    activeMedia ??
    ({
      id: "fallback-media",
      type: "image",
      url: fallbackImage,
      caption: title,
      description: "Hình ảnh tổng quan công trình.",
    } satisfies ProjectMedia);

  return (
    <Panel>
      <SectionTitle eyebrow="Tư liệu thực tế" title="Ảnh và video công trình" />
      <div className="mt-6 grid gap-5">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950">
          <MediaFrame
            media={currentMedia}
            fallbackImage={fallbackImage}
            title={title}
            priority
            onOpen={() => onOpen(Math.max(0, selectedIndex))}
          />
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-950">{currentMedia.caption}</h3>
          {currentMedia.description ? (
            <p className="mt-2 text-sm leading-6 text-slate-600">{currentMedia.description}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {gallery.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`overflow-hidden rounded-lg border text-left transition ${
                selectedIndex === index
                  ? "border-teal-700 ring-2 ring-teal-700/20"
                  : "border-slate-200 hover:border-teal-500"
              }`}
              onClick={() => onSelect(index)}
            >
              <div className="relative aspect-[4/3] bg-slate-200">
                {item.type === "video" ? (
                  <div className="flex h-full items-center justify-center bg-slate-900 text-white">
                    <PlayCircle size={30} aria-hidden />
                  </div>
                ) : (
                  <div
                    className="h-full bg-cover bg-center"
                    style={{ backgroundImage: `url("${item.url || fallbackImage}")` }}
                  />
                )}
                <span className="absolute left-2 top-2 rounded bg-slate-950/80 px-2 py-1 text-[11px] font-bold uppercase text-white">
                  {item.type === "video" ? "Video" : "Ảnh"}
                </span>
              </div>
              <div className="bg-white p-3">
                <p className="line-clamp-2 text-xs font-bold leading-5 text-slate-800">{item.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function TechnicalTab({ project }: { project: Project }) {
  return (
    <div className="grid gap-6">
      <Panel>
        <SectionTitle eyebrow="Thông số đầu tư" title="Cấu hình và hiệu quả dự kiến" />
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <Spec label="Loại công trình" value={project.type} />
          <Spec label="Tiền điện trước lắp" value={project.monthlyBill} />
          <Spec label="Công suất hệ thống" value={project.systemSize} />
          <Spec label="Số tấm pin" value={project.panels} />
          <Spec label="Inverter" value={project.inverter} />
          <Spec label="Sản lượng dự kiến" value={project.estimatedOutput} />
          <Spec label="Chi phí tham khảo" value={project.cost ?? "Theo khảo sát"} />
          <Spec label="Hoàn vốn dự kiến" value={project.payback} />
        </dl>
      </Panel>

      <Panel>
        <SectionTitle eyebrow="Điểm kỹ thuật" title="Những hạng mục khách nên kiểm tra khi xem báo giá" />
        <div className="mt-5 grid gap-3">
          {[
            "Bố trí tấm pin tránh bóng che, chừa lối vệ sinh và bảo trì.",
            "Tủ bảo vệ AC/DC, chống sét lan truyền và tiếp địa được tính trong phương án.",
            "Đường cáp đi gọn, dễ kiểm tra, không ảnh hưởng sinh hoạt hoặc vận hành công trình.",
            project.hasStorage
              ? "Có cấu hình lưu trữ, cần tách tải backup rõ ràng trước khi thi công."
              : "Hệ không lưu trữ, ưu tiên tự dùng ban ngày và giảm tiền điện trực tiếp.",
          ].map((item) => (
            <div key={item} className="flex gap-3 rounded-lg bg-slate-50 p-4">
              <Wrench className="mt-0.5 shrink-0 text-teal-700" size={19} aria-hidden />
              <p className="text-sm leading-6 text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function ProcessTab({ project }: { project: Project }) {
  const steps = [
    {
      title: "Khảo sát thực tế",
      text: "Kỹ thuật kiểm tra mái, hướng nắng, bóng che, tủ điện và đường đi dây trước khi chốt cấu hình.",
    },
    {
      title: "Lên phương án",
      text: `Tính hệ ${project.systemSize}, cấu hình ${project.panels} và ${project.inverter} theo hóa đơn điện thực tế.`,
    },
    {
      title: "Thi công và nghiệm thu",
      text: "Lắp khung, pin, inverter, tủ bảo vệ, chạy thử và kiểm tra an toàn trước khi bàn giao.",
    },
    {
      title: "Bàn giao theo dõi",
      text: "Hướng dẫn xem app sản lượng, cách kiểm tra cảnh báo và lịch vệ sinh/bảo trì sau lắp.",
    },
  ];

  return (
    <Panel>
      <SectionTitle eyebrow="Quy trình triển khai" title="Từ khảo sát đến bàn giao vận hành" />
      <div className="mt-6 grid gap-4">
        {steps.map((step, index) => (
          <div key={step.title} className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[56px_1fr]">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-teal-700 text-lg font-bold text-white">
              {index + 1}
            </div>
            <div>
              <h3 className="font-bold text-slate-950">{step.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function LeadTab({ project }: { project: Project }) {
  return (
    <Panel>
      <SectionTitle eyebrow="Cần tính công trình của anh/chị?" title="Gửi thông tin để kỹ thuật tư vấn trực tiếp" />
      <p className="mt-4 text-sm leading-6 text-slate-600">
        Nếu công trình tương tự {project.type.toLowerCase()} hoặc có tiền điện gần mức {project.monthlyBill}, anh/chị
        gửi số điện thoại/Zalo, tỉnh thành và hóa đơn điện để kỹ thuật tính cấu hình phù hợp hơn.
      </p>
      <div className="mt-6 max-w-2xl">
        <LeadForm />
      </div>
    </Panel>
  );
}

function Panel({ children }: { children: ReactNode }) {
  return <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">{children}</div>;
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold leading-tight text-slate-950 sm:text-3xl">{title}</h2>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/10 p-3">
      <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-300">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-white">{value}</dd>
    </div>
  );
}

function TrustCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-teal-50 text-teal-700">
        {icon}
      </div>
      <h3 className="mt-4 font-bold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-2 font-bold text-slate-950">{value}</dd>
    </div>
  );
}

function MediaFrame({
  media,
  fallbackImage,
  title,
  priority = false,
  onOpen,
}: {
  media: ProjectMedia;
  fallbackImage: string;
  title: string;
  priority?: boolean;
  onOpen?: () => void;
}) {
  const mediaUrl = media.url || fallbackImage;

  if (media.type === "video" && isPlayableVideoUrl(mediaUrl)) {
    return (
      <div className="relative">
        <video
          className="aspect-[16/10] w-full bg-slate-950 object-contain"
          src={mediaUrl}
          poster={fallbackImage}
          controls
          playsInline
          preload={priority ? "metadata" : "none"}
        />
        {onOpen ? <ExpandMediaButton onOpen={onOpen} /> : null}
      </div>
    );
  }

  if (media.type === "video") {
    return (
      <div
        className="flex aspect-[16/10] w-full items-center justify-center bg-cover bg-center p-6 text-center text-white"
        style={{ backgroundImage: `linear-gradient(rgb(2 6 23 / 70%), rgb(2 6 23 / 70%)), url("${fallbackImage}")` }}
      >
        <div>
          <PlayCircle className="mx-auto" size={44} aria-hidden />
          <p className="mt-3 font-bold">{media.caption || title}</p>
          {mediaUrl ? (
            <a
              href={mediaUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex rounded-md bg-white px-4 py-2 text-sm font-bold text-slate-950 hover:bg-amber-200"
            >
              Mở video
            </a>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <button type="button" className="group relative block aspect-[16/10] w-full bg-slate-950" onClick={onOpen}>
      <span
        className="absolute inset-0 bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${mediaUrl}")` }}
        role="img"
        aria-label={media.caption || title}
      />
      {onOpen ? (
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-slate-950/80 px-3 py-2 text-xs font-bold text-white opacity-95 shadow-lg transition group-hover:bg-teal-700">
          <Maximize2 size={15} aria-hidden />
          Xem đầy đủ
        </span>
      ) : null}
    </button>
  );
}

function ExpandMediaButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-slate-950/80 px-3 py-2 text-xs font-bold text-white shadow-lg transition hover:bg-teal-700"
      onClick={onOpen}
    >
      <Maximize2 size={15} aria-hidden />
      Xem đầy đủ
    </button>
  );
}

function MediaLightbox({
  media,
  fallbackImage,
  title,
  currentIndex,
  total,
  onClose,
  onMove,
}: {
  media: ProjectMedia;
  fallbackImage: string;
  title: string;
  currentIndex: number;
  total: number;
  onClose: () => void;
  onMove: (direction: "left" | "right") => void;
}) {
  const mediaUrl = media.url || fallbackImage;
  const canPlayVideo = media.type === "video" && isPlayableVideoUrl(mediaUrl);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 text-white">
      <div className="flex h-full flex-col">
        <div className="flex min-h-16 items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-teal-200">
              {currentIndex + 1}/{total} {media.type === "video" ? "Video" : "Ảnh"} công trình
            </p>
            <h2 className="mt-1 truncate text-base font-bold sm:text-lg">{media.caption || title}</h2>
          </div>
          <button
            type="button"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Đóng ảnh"
            onClick={onClose}
          >
            <X size={22} aria-hidden />
          </button>
        </div>

        <div className="relative min-h-0 flex-1 px-3 py-4 sm:px-16 sm:py-6">
          {total > 1 ? (
            <>
              <button
                type="button"
                className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white shadow-lg hover:bg-teal-700 sm:left-5"
                aria-label="Xem ảnh trước"
                onClick={() => onMove("left")}
              >
                <ChevronLeft size={26} aria-hidden />
              </button>
              <button
                type="button"
                className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white shadow-lg hover:bg-teal-700 sm:right-5"
                aria-label="Xem ảnh tiếp theo"
                onClick={() => onMove("right")}
              >
                <ChevronRight size={26} aria-hidden />
              </button>
            </>
          ) : null}

          <div className="flex h-full items-center justify-center">
            {canPlayVideo ? (
              <video
                className="max-h-full max-w-full rounded-lg bg-black shadow-2xl"
                src={mediaUrl}
                poster={fallbackImage}
                controls
                autoPlay
                playsInline
              />
            ) : media.type === "video" ? (
              <div
                className="flex min-h-[360px] w-full max-w-5xl items-center justify-center rounded-lg bg-cover bg-center p-8 text-center shadow-2xl"
                style={{ backgroundImage: `linear-gradient(rgb(2 6 23 / 78%), rgb(2 6 23 / 78%)), url("${fallbackImage}")` }}
              >
                <div>
                  <PlayCircle className="mx-auto" size={54} aria-hidden />
                  <p className="mt-4 text-lg font-bold">{media.caption || title}</p>
                  <a
                    href={mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex rounded-md bg-white px-5 py-3 text-sm font-bold text-slate-950 hover:bg-amber-200"
                  >
                    Mở video
                  </a>
                </div>
              </div>
            ) : (
              <div
                className="h-full max-h-full w-full max-w-6xl rounded-lg bg-contain bg-center bg-no-repeat shadow-2xl"
                style={{ backgroundImage: `url("${mediaUrl}")` }}
                role="img"
                aria-label={media.caption || title}
              />
            )}
          </div>
        </div>

        {media.description ? (
          <div className="border-t border-white/10 px-4 py-3 text-sm leading-6 text-slate-200 sm:px-6">
            {media.description}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function buildGallery(project: Project): ProjectMedia[] {
  const gallery = project.gallery?.filter((item) => item.url || item.mediaKey) ?? [];

  if (gallery.length) return gallery;

  if (project.video) {
    return [
      {
        id: `${project.id}-video`,
        type: "video",
        url: project.video,
        caption: "Video thực tế công trình",
        description: project.summary,
      },
    ];
  }

  return [createCoverMedia(project)];
}

function createCoverMedia(project: Project): ProjectMedia {
  return {
    id: `${project.id}-cover`,
    type: "image",
    url: project.image,
    caption: "Hình ảnh tổng quan công trình",
    description: project.summary,
  };
}
