import Link from "next/link";
import { MapPin } from "lucide-react";
import { contactInfo } from "@/data/contact";

const quickLinks = [
  { label: "Dự án thực tế", href: "/projects" },
  { label: "Bảng giá", href: "/pricing" },
  { label: "Tính hoàn vốn", href: "/calculator" },
  { label: "Liên hệ", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-slate-950 py-12 text-slate-200">
      <div className="section-shell grid gap-8 md:grid-cols-[1.4fr_0.8fr_1fr]">
        <div>
          <p className="text-xl font-black text-white">{contactInfo.brandName}</p>
          <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
            Tư vấn, khảo sát và lắp đặt điện mặt trời áp mái cho hộ gia đình, nhà nghỉ,
            quán cafe và xưởng nhỏ. Ưu tiên phương án đúng nhu cầu, vật tư rõ ràng và hiệu quả thực tế.
          </p>
          <p className="mt-4 text-xs leading-5 text-slate-400">
            Thông tin trên website chỉ mang tính tư vấn tham khảo. Phương án chính xác cần khảo sát thực tế.
          </p>
        </div>
        <div>
          <p className="font-black text-white">Link nhanh</p>
          <div className="mt-3 grid gap-2 text-sm">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-slate-300 hover:text-amber-300">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="font-black text-white">Liên hệ</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-300">
            <p>Điện thoại/Zalo: {contactInfo.phone}</p>
            <p>Email: {contactInfo.email}</p>
            <div className="grid gap-2">
              <p>
                Địa chỉ: <span className="font-semibold text-slate-100">{contactInfo.address}</span>
              </p>
              <a
                href={contactInfo.mapHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-md border border-amber-300/45 bg-amber-300/10 px-3 py-2 font-black text-amber-200 transition hover:bg-amber-300 hover:text-slate-950"
                aria-label={`Mở Google Maps tới ${contactInfo.address}`}
              >
                <MapPin size={16} aria-hidden />
                Mở bản đồ Google Maps
              </a>
            </div>
            <p>Giờ làm việc: {contactInfo.workingHours}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
