import type { Metadata } from "next";
import { ProjectGrid } from "@/components/ProjectGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Dự án điện mặt trời thực tế đã thi công",
  description:
    "Xem các dự án điện mặt trời áp mái thực tế cho nhà dân, nhà nghỉ, quán cafe và xưởng nhỏ, kèm công suất, vật tư, chi phí và mốc hoàn vốn.",
};

export default function ProjectsPage() {
  return (
    <section className="bg-slate-50 py-14 sm:py-16">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Dự án thực tế"
          title="Danh sách công trình điện mặt trời áp mái"
          description="Bộ lọc giúp khách xem nhanh các công trình gần với nhu cầu của mình: nhà dân, nhà nghỉ, quán cafe, xưởng hoặc hệ có lưu trữ."
        />
        <ProjectGrid projects={projects} filterable />
      </div>
    </section>
  );
}
