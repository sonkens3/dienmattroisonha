"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProjectDetailContent } from "@/components/ProjectDetailContent";
import { projects as seedProjects, type Project } from "@/data/projects";
import { fetchRemoteProjects, mergeProjectsWithRemote, type ManagedProject } from "@/lib/remoteProjects";

type LookupState =
  | { status: "loading"; message: string }
  | { status: "loaded"; project: Project }
  | { status: "not-found"; message: string };

export function ProjectLookup() {
  const [state, setState] = useState<LookupState>({
    status: "loading",
    message: "Đang tải dự án...",
  });

  useEffect(() => {
    let mounted = true;

    async function loadProject() {
      const projectId = new URLSearchParams(window.location.search).get("id")?.trim();

      if (!projectId) {
        setState({
          status: "not-found",
          message: "Đường dẫn thiếu mã dự án.",
        });
        return;
      }

      const result = await fetchRemoteProjects({ useCache: true });
      const allProjects = mergeProjectsWithRemote(seedProjects, result.projects);
      const project = allProjects.find((item) => {
        const managedProject = item as ManagedProject;
        return item.id === projectId || managedProject.baseProjectId === projectId;
      });

      if (!mounted) return;

      if (project) {
        setState({ status: "loaded", project });
        return;
      }

      setState({
        status: "not-found",
        message: result.error
          ? `Chưa tải được dữ liệu dự án từ Google Sheet: ${result.error}`
          : "Không tìm thấy dự án này.",
      });
    }

    void loadProject();

    return () => {
      mounted = false;
    };
  }, []);

  if (state.status === "loaded") {
    return <ProjectDetailContent initialProject={state.project} />;
  }

  return (
    <section className="bg-white py-16">
      <div className="section-shell">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-bold text-teal-800">
          <ArrowLeft size={16} aria-hidden />
          Quay lại dự án
        </Link>
        <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-8">
          <h1 className="text-2xl font-bold text-slate-950">
            {state.status === "loading" ? "Đang tải công trình" : "Không tìm thấy công trình"}
          </h1>
          <p className="mt-2 text-slate-600">{state.message}</p>
        </div>
      </div>
    </section>
  );
}
