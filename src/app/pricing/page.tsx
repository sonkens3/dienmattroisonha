import type { Metadata } from "next";
import Link from "next/link";
import { PricingTable } from "@/components/PricingTable";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Bảng giá lắp đặt điện mặt trời áp mái",
  description:
    "Bảng giá tham khảo theo công suất hệ thống, số tấm pin, diện tích mái và các yếu tố ảnh hưởng đến chi phí lắp đặt điện mặt trời.",
};

export default function PricingPage() {
  return (
    <section className="bg-slate-50 py-14 sm:py-16">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Bảng giá"
          title="Không báo giá cứng khi chưa khảo sát"
          description="Giá phụ thuộc công suất, inverter, loại mái, chiều dài dây, tủ điện, chống sét, khung giàn và có dùng pin lưu trữ hay không."
        />
        <PricingTable />
        <div className="mt-8 rounded-lg bg-slate-950 p-6 text-white shadow-lg shadow-slate-950/10">
          <p className="text-xl font-black">Muốn biết chi phí sát hơn?</p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Gửi tiền điện hằng tháng, ảnh hóa đơn và ảnh mái. Kỹ thuật sẽ tính công suất phù hợp
            trước khi báo giá chi tiết từng hạng mục.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-flex rounded-md bg-amber-300 px-4 py-3 font-black text-slate-950 hover:bg-amber-200"
          >
            Gửi thông tin khảo sát
          </Link>
        </div>
      </div>
    </section>
  );
}
