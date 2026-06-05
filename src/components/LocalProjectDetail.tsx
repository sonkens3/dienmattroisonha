"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProjectDetailContent } from "@/components/ProjectDetailContent";
import type { Project } from "@/data/projects";
import { fetchRemoteProjects } from "@/lib/remoteProjects";

export function LocalProjectDetail({ slug }: { slug: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadProject() {
      const result = await fetchRemoteProjects({ useCache: true });
      const remoteProject = result.projects.find((item) => item.id === slug);

      if (mounted) {
        setProject(remoteProject ?? null);
        setLoaded(true);
      }
    }

    void loadProject();

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (!loaded) {
    return (
      <section className="bg-white py-16">
        <div className="section-shell text-slate-600">Đang tải công trình...</div>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="bg-white py-16">
        <div className="section-shell">
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-bold text-teal-800">
            <ArrowLeft size={16} aria-hidden />
            Quay lại dự án
          </Link>
          <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-8">
            <h1 className="text-2xl font-bold text-slate-950">Không tìm thấy công trình</h1>
            <p className="mt-2 text-slate-600">
              Công trình này chưa có trên Google Sheet hoặc đã bị xóa trong trang admin.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return <ProjectDetailContent initialProject={project} />;
}
