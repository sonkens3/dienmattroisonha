import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/data/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-950/10">
      <Link href={`/projects/${project.id}`} className="group block" aria-label={`Xem ${project.title}`}>
        {project.video ? (
          <video
            className="aspect-[16/10] w-full object-cover transition duration-300 group-hover:scale-105"
            src={project.video}
            poster={project.image}
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <span
            className="block aspect-[16/10] bg-cover bg-center transition duration-300 group-hover:scale-105"
            style={{ backgroundImage: `url('${project.image}')` }}
          />
        )}
      </Link>
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-wide text-teal-700">
          <span>{project.type}</span>
          <span className="text-slate-300">/</span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} aria-hidden />
            {project.location}
          </span>
        </div>
        <h3 className="mt-3 text-xl font-black leading-tight text-slate-950">{project.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{project.summary}</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <Spec label="Công suất" value={project.systemSize} />
          <Spec label="Số tấm" value={project.panels} />
          <Spec label="Tiền điện trước lắp" value={project.monthlyBill} />
          <Spec label="Hoàn vốn" value={project.payback} />
        </dl>
        <Link
          href={`/projects/${project.id}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-black text-teal-800 hover:text-teal-950"
        >
          Xem chi tiết
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </article>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 font-bold text-slate-950">{value}</dd>
    </div>
  );
}
