import {
  ArrowRight,
  Calculator,
  ClipboardCheck,
  Gauge,
  ImagePlus,
  ShieldCheck,
  SunMedium,
} from "lucide-react";
import Link from "next/link";
import { contactInfo } from "@/data/contact";

const trustItems = [
  { icon: ClipboardCheck, text: "Khảo sát mái và hóa đơn trước khi chốt hệ" },
  { icon: Gauge, text: "Tính công suất theo tỷ lệ dùng điện ban ngày" },
  { icon: ShieldCheck, text: "Báo giá vật tư, tủ điện, chống sét rõ ràng" },
];

const proofStats = [
  { label: "Phù hợp", value: "Nhà ở, cafe, nhà nghỉ, xưởng" },
  { label: "Hồ sơ", value: "Ảnh mái, hóa đơn, phương án vật tư" },
  { label: "Sau lắp", value: "Theo dõi sản lượng trên app" },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 text-white">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(2,6,23,0.94), rgba(15,23,42,0.80), rgba(15,23,42,0.38)), url('https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1800&q=80')",
        }}
      />
      <div className="section-shell flex min-h-[calc(88svh-68px)] flex-col justify-center py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200/50 bg-amber-300 px-3 py-2 text-xs font-black uppercase text-slate-950 shadow-lg sm:text-sm">
            <SunMedium size={16} aria-hidden />
            Tư vấn theo hóa đơn điện thực tế
          </p>
          <h1 className="text-4xl font-black leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            {contactInfo.brandName}
          </h1>
          <p className="mt-4 max-w-2xl text-xl font-bold leading-8 text-amber-100 sm:text-2xl">
            Lắp đặt điện mặt trời áp mái cho gia đình và công trình kinh doanh.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-100 sm:text-lg">
            Thiết kế theo hóa đơn điện, thói quen dùng điện ban ngày và điều kiện mái thực tế.
            Khách được xem công trình đã thi công, cấu hình vật tư và khoảng chi phí trước khi quyết định khảo sát.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-amber-300 px-5 py-3 text-base font-black text-slate-950 shadow-lg transition hover:bg-amber-200 sm:w-auto"
            >
              Gửi hóa đơn để kỹ thuật tính hệ
              <ArrowRight size={18} aria-hidden />
            </Link>
            <Link
              href="/calculator"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-white/60 bg-white/10 px-5 py-3 text-base font-black text-white backdrop-blur transition hover:bg-white hover:text-slate-950 sm:w-auto"
            >
              <Calculator size={18} aria-hidden />
              Tính nhanh chi phí
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-sm font-bold text-slate-100">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 backdrop-blur">
              Gọi/Zalo: {contactInfo.phone}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 backdrop-blur">
              <ImagePlus size={16} aria-hidden />
              Nhận ảnh hóa đơn và ảnh mái qua form/chat
            </span>
          </div>
        </div>

        <div className="mt-10 grid gap-3 border-y border-white/15 py-4 sm:grid-cols-3">
          {proofStats.map((item) => (
            <div key={item.label} className="rounded-lg bg-white/10 p-4 backdrop-blur">
              <p className="text-xs font-black uppercase tracking-wide text-teal-200">{item.label}</p>
              <p className="mt-2 text-sm font-bold leading-6 text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {trustItems.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.text} className="flex items-center gap-3 text-sm font-bold leading-6 text-slate-100">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-teal-600 text-white shadow-md">
                  <Icon size={19} aria-hidden />
                </span>
                {item.text}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
