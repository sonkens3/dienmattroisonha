"use client";

import { useEffect, useMemo, useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/data/projects";
import { fetchRemoteProjects, loadCachedRemoteProjects, mergeProjectsWithRemote } from "@/lib/remoteProjects";

const filters = ["Tất cả", "Nhà dân", "Nhà nghỉ", "Quán cafe", "Xưởng", "Văn phòng", "Có lưu trữ", "Không lưu trữ"];

export function ProjectGrid({
  projects,
  filterable = false,
}: {
  projects: Project[];
  filterable?: boolean;
}) {
  const [activeFilter, setActiveFilter] = useState("Tất cả");
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

  const visibleProjects = useMemo(() => {
    const allProjects = mergeProjectsWithRemote(projects, remoteState.projects);
    if (activeFilter === "Tất cả") return allProjects;
    if (activeFilter === "Có lưu trữ") return allProjects.filter((project) => project.hasStorage);
    if (activeFilter === "Không lưu trữ") return allProjects.filter((project) => !project.hasStorage);
    return allProjects.filter((project) => project.type === activeFilter);
  }, [activeFilter, remoteState.projects, projects]);

  return (
    <div className="mt-8">
      {filterable ? (
        <div className="carousel-no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              type="button"
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`shrink-0 rounded-md border px-3 py-2 text-sm font-black transition ${
                activeFilter === filter
                  ? "border-teal-700 bg-teal-700 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-teal-700"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      ) : null}
      {!remoteState.loaded ? <ProjectGridSkeleton /> : null}
      {remoteState.loaded ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ProjectGridSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="Đang tải danh sách công trình">
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="aspect-[16/10] animate-pulse bg-slate-200" />
          <div className="p-5">
            <div className="h-4 w-2/5 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-6 w-4/5 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-16 animate-pulse rounded bg-slate-100" />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="h-10 animate-pulse rounded bg-slate-100" />
              <div className="h-10 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
