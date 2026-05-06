import type { Metadata } from "next";
import { LocalProjectDetail } from "@/components/LocalProjectDetail";
import { ProjectDetailContent } from "@/components/ProjectDetailContent";
import { projects } from "@/data/projects";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.id === slug);

  if (!project) {
    return {
      title: "Dự án điện mặt trời",
    };
  }

  return {
    title: `${project.title} | Dự án điện mặt trời`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.id === slug);

  if (!project) return <LocalProjectDetail slug={slug} />;

  return <ProjectDetailContent initialProject={project} />;
}
