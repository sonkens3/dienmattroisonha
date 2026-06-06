import type { Metadata } from "next";
import type { ComponentType } from "react";
import { Clock, ExternalLink, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import { SectionHeading } from "@/components/SectionHeading";
import { contactInfo } from "@/data/contact";

export const metadata: Metadata = {
  title: "Liên hệ tư vấn lắp điện mặt trời",
  description:
    "Gửi thông tin công trình, hóa đơn điện và ảnh mái để được tư vấn phương án lắp đặt điện mặt trời phù hợp.",
};

export default function ContactPage() {
  return (
    <section className="bg-slate-50 py-14 sm:py-16">
      <div className="section-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeading
            eyebrow="Liên hệ"
            title="Gửi thông tin để kỹ thuật tư vấn phương án phù hợp"
            description="Nên chuẩn bị hóa đơn điện gần nhất, ảnh mái và thông tin phụ tải dùng ban ngày để kết quả tư vấn sát hơn."
          />
          <div className="mt-8 grid gap-3">
            <ContactItem icon={Phone} label="Điện thoại/Zalo" value={contactInfo.phone} />
            <ContactItem icon={Mail} label="Email" value={contactInfo.email} />
            <ContactItem icon={MapPin} label="Địa chỉ" value={contactInfo.address} href={contactInfo.mapHref} />
            <ContactItem icon={Clock} label="Giờ làm việc" value={contactInfo.workingHours} />
          </div>
        </div>
        <LeadForm />
      </div>
    </section>
  );
}

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-teal-700 text-white">
        <Icon size={19} aria-hidden />
      </span>
      <div>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
        {href ? (
          <div className="mt-1 grid gap-3">
            <p className="font-black text-slate-950">{value}</p>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-teal-700 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-teal-900/10 ring-1 ring-teal-600/10 transition hover:bg-teal-800 sm:w-fit"
              aria-label={`Mở Google Maps tới ${value}`}
            >
              <Navigation size={16} aria-hidden />
              Xem chỉ đường trên Google Maps
              <ExternalLink size={14} aria-hidden />
            </a>
          </div>
        ) : (
          <p className="mt-1 font-black text-slate-950">{value}</p>
        )}
      </div>
    </div>
  );
}
