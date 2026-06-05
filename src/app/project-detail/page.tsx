import type { Metadata } from "next";
import { ProjectLookup } from "@/components/ProjectLookup";

export const metadata: Metadata = {
  title: "Chi tiết dự án điện mặt trời",
  description: "Xem hình ảnh, video, thông số và mô tả công trình điện mặt trời Sơn Hà đã thi công.",
};

export default function ProjectDetailLookupPage() {
  return <ProjectLookup />;
}
