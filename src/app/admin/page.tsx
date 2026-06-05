import type { Metadata } from "next";
import { AdminAuthGate } from "@/components/AdminAuthGate";
import { AdminLeadTable } from "@/components/AdminLeadTable";
import { AdminProjectTable } from "@/components/AdminProjectTable";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Admin | Website điện mặt trời Sơn Hà",
  description: "Trang quản trị lead và dự án thực tế của website Điện mặt trời Sơn Hà.",
};

export default function AdminPage() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="section-shell">
        <AdminAuthGate>
          <SectionHeading
            eyebrow="Quản trị website"
            title="Quản lý lead và dự án thực tế"
            description="Lead dùng để kiểm tra nhanh trong trình duyệt; dự án thực tế được đồng bộ qua Google Sheet và Google Drive để thiết bị khác đều xem được."
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
