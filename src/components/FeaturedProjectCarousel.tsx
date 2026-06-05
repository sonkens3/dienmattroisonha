"use client";

import { ArrowRight, ChevronLeft, ChevronRight, MapPin, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { projects as seedProjects, type Project } from "@/data/projects";
import { isPlayableVideoUrl } from "@/lib/media";
import { getProjectHref } from "@/lib/projectLinks";
import { fetchRemoteProjects, loadCachedRemoteProjects, mergeProjectsWithRemote } from "@/lib/remoteProjects";

type DisplayProject = Project & {
  isRemote?: boolean;
};

export function FeaturedProjectCarousel() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [remoteState, setRemoteState] = useState<{ projects: Project[]; loaded: boolean }>({
    projects: [],
    loaded: false,
  });

  useEffect(() => {
    let mounted = true;

    async function loadProjects() {
      await Promise.resolve();

      const cachedProjects = loadCachedRemoteProjects();
      if (mounted && cachedProjects.length) {
        setRemoteState({
          projects: cachedProjects,
          loaded: true,
        });
      }

      const result = await fetchRemoteProjects({ useCache: true });
      if (mounted) {
        setRemoteState({
          projects: result.projects,
          loaded: true,
        });
      }
    }

    void loadProjects();
    window.addEventListener("sonha-remote-projects-updated", loadProjects);

    return () => {
      mounted = false;
      window.removeEventListener("sonha-remote-projects-updated", loadProjects);
    };
  }, []);

  const featuredProjects = useMemo<DisplayProject[]>(() => {
    return mergeProjectsWithRemote(seedProjects, remoteState.projects)
      .map((project) => ({ ...project, isRemote: remoteState.projects.some((item) => item.id === project.id) }))
      .slice(0, 10);
  }, [remoteState.projects]);

  const scrollToIndex = useCallback((index: number) => {
    const scroller = scrollerRef.current;
    const card = scroller?.children.item(index) as HTMLElement | null;

    if (!scroller || !card) return;

    const offset = card.offsetLeft - (scroller.clientWidth - card.clientWidth) / 2;

    scroller.scrollTo({
      left: Math.max(0, offset),
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (featuredProjects.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % featuredProjects.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, [featuredProjects.length]);

  useEffect(() => {
    scrollToIndex(activeIndex);
  }, [activeIndex, scrollToIndex]);

  function moveSlide(direction: "left" | "right") {
    if (!featuredProjects.length) return;

    setActiveIndex((current) => {
      if (direction === "right") return (current + 1) % featuredProjects.length;
      return (current - 1 + featuredProjects.length) % featuredProjects.length;
    });
  }

  return (
    <section id="featured-projects" className="bg-slate-50 py-14 sm:py-16">
      <div className="section-shell">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.14em] text-teal-700">
              Công trình đã thi công
            </p>
            <h2 className="text-3xl font-black leading-tight text-slate-950 md:text-4xl">
              Dự án thực tế để anh/chị tham khảo
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">
              Xem các công trình đã lắp đặt, cấu hình hệ thống và hiệu quả dự kiến để lựa chọn phương án phù hợp hơn cho công trình của mình.
            </p>
          </div>
          <Link
            href="/projects"
            className="hidden rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-800 shadow-sm hover:border-teal-700 md:inline-flex"
          >
            Xem tất cả dự án
          </Link>
        </div>

        {!remoteState.loaded ? (
          <ProjectCarouselSkeleton />
        ) : (
        <div className="relative mt-8">
          <button
            type="button"
            className="absolute left-2 top-[42%] z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-slate-800 shadow-lg ring-1 ring-slate-200 transition hover:bg-teal-700 hover:text-white md:-left-5"
            aria-label="Xem công trình trước"
            onClick={() => moveSlide("left")}
          >
            <ChevronLeft size={22} aria-hidden />
          </button>
          <button
            type="button"
            className="absolute right-2 top-[42%] z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-slate-800 shadow-lg ring-1 ring-slate-200 transition hover:bg-teal-700 hover:text-white md:-right-5"
            aria-label="Xem công trình tiếp theo"
            onClick={() => moveSlide("right")}
          >
            <ChevronRight size={22} aria-hidden />
          </button>

          <div
            ref={scrollerRef}
            className="carousel-no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1"
          >
            {featuredProjects.map((project, index) => {
              const href = getProjectHref(project.id);
              const canPlayVideo = isPlayableVideoUrl(project.video);

              return (
                <article
                  key={project.id}
                  className={`min-w-[88%] snap-center overflow-hidden rounded-lg border bg-white shadow-sm transition duration-300 sm:min-w-[360px] lg:min-w-[32%] ${
                    index === activeIndex
                      ? "border-teal-300 shadow-lg shadow-teal-900/10"
                      : "border-slate-200 opacity-95"
                  }`}
                >
                  <Link href={href} className="group block">
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                      {project.video && canPlayVideo ? (
                        <video
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          src={project.video}
                          poster={project.image}
                          muted
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <div
                          className="h-full w-full bg-cover bg-center transition duration-300 group-hover:scale-105"
                          style={{ backgroundImage: `url('${project.image}')` }}
                        />
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-4 text-white">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-wide">
                          <span>{project.type}</span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={13} aria-hidden />
                            {project.location}
                          </span>
                          {project.video ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-1">
                              <PlayCircle size={13} aria-hidden />
                              Video
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="p-4">
                    <h3 className="line-clamp-2 text-lg font-black leading-snug text-slate-950">
                      {project.title}
                    </h3>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <Spec label="Công suất" value={project.systemSize} />
                      <Spec label="Hoàn vốn" value={project.payback} />
                    </div>
                    <Link
                      href={href}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-black text-teal-800 hover:text-teal-950"
                    >
                      Xem chi tiết công trình
                      <ArrowRight size={16} aria-hidden />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-5 flex justify-center gap-2">
            {featuredProjects.map((project, index) => (
              <button
                type="button"
                key={project.id}
                className={`h-2.5 rounded-full transition ${
                  index === activeIndex ? "w-8 bg-teal-700" : "w-2.5 bg-slate-300"
                }`}
                aria-label={`Xem dự án ${index + 1}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2 md:hidden">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-800 hover:border-teal-700"
          >
            Xem tất cả dự án
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-teal-700 px-4 py-3 text-sm font-black text-white hover:bg-teal-800"
          >
            Gửi công trình cần khảo sát
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProjectCarouselSkeleton() {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Đang tải công trình thực tế">
      {[0, 1, 2].map((item) => (
        <div key={item} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="aspect-[16/10] animate-pulse bg-slate-200" />
          <div className="p-4">
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-6 w-5/6 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="h-14 animate-pulse rounded-md bg-slate-100" />
              <div className="h-14 animate-pulse rounded-md bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-black text-slate-950">{value}</p>
    </div>
  );
}
