"use client";

import { useEffect, useMemo, useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/data/projects";
import { loadResolvedLocalProjects, mergeProjectsWithLocal } from "@/lib/localProjects";

const filters = ["Tất cả", "Nhà dân", "Nhà nghỉ", "Quán cafe", "Xưởng", "Văn phòng", "Có lưu trữ", "Không lưu trữ"];

export function ProjectGrid({
  projects,
  filterable = false,
}: {
  projects: Project[];
  filterable?: boolean;
}) {
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [localProjects, setLocalProjects] = useState<Project[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadProjects() {
      const resolved = await loadResolvedLocalProjects();
      if (mounted) setLocalProjects(resolved);
    }

    void loadProjects();
    window.addEventListener("sonha-projects-updated", loadProjects);

    return () => {
      mounted = false;
      window.removeEventListener("sonha-projects-updated", loadProjects);
    };
  }, []);

  const visibleProjects = useMemo(() => {
    const allProjects = mergeProjectsWithLocal(projects, localProjects);
    if (activeFilter === "Tất cả") return allProjects;
    if (activeFilter === "Có lưu trữ") return allProjects.filter((project) => project.hasStorage);
    if (activeFilter === "Không lưu trữ") return allProjects.filter((project) => !project.hasStorage);
    return allProjects.filter((project) => project.type === activeFilter);
  }, [activeFilter, localProjects, projects]);

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
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
