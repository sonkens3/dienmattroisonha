import type { Metadata } from "next";
import { AdminAuthGate } from "@/components/AdminAuthGate";
import { AdminLeadTable } from "@/components/AdminLeadTable";
import { AdminProjectTable } from "@/components/AdminProjectTable";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Admin mock | Website điện mặt trời",
  description: "Trang admin mock để xem lead localStorage và dữ liệu dự án mẫu.",
};

export default function AdminPage() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="section-shell">
        <AdminAuthGate>
          <SectionHeading
            eyebrow="Admin mock"
            title="Quản lý demo lead và dự án"
            description="Bản MVP chưa dùng database. Lead được lưu trong trình duyệt để kiểm tra luồng form; dự án nằm trong file dữ liệu."
          />
          <div className="mt-8 grid gap-6">
            <AdminLeadTable />
            <AdminProjectTable />
          </div>
        </AdminAuthGate>
      </div>
    </section>
  );
}
