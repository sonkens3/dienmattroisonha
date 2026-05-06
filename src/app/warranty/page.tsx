import type { Metadata } from "next";
import { ClipboardCheck, ShieldCheck, Wrench } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Chính sách bảo hành điện mặt trời",
  description:
    "Thông tin bảo hành vật tư, thi công, hướng dẫn theo dõi sản lượng và bảo trì hệ thống điện mặt trời áp mái.",
};

const policies = [
  {
    icon: ShieldCheck,
    title: "Bảo hành vật tư",
    text: "Pin, inverter, khung giàn và thiết bị điện được ghi rõ theo chính sách của từng hãng trong báo giá/hợp đồng.",
  },
  {
    icon: Wrench,
    title: "Bảo hành thi công",
    text: "Kiểm tra điểm bắt khung, máng cáp, đấu nối AC/DC, chống sét lan truyền, tiếp địa và nghiệm thu vận hành.",
  },
  {
    icon: ClipboardCheck,
    title: "Hỗ trợ sau lắp",
    text: "Hướng dẫn xem app inverter, theo dõi sản lượng, phát hiện cảnh báo và lên lịch vệ sinh/bảo trì khi cần.",
  },
];

export default function WarrantyPage() {
  return (
    <section className="bg-slate-50 py-14 sm:py-16">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Bảo hành"
          title="Bàn giao rõ ràng để khách tự theo dõi hệ thống"
          description="Chính sách bảo hành cần được thể hiện ngay trong báo giá và hợp đồng để khách biết rõ vật tư, thi công và hỗ trợ sau lắp."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {policies.map((policy) => {
            const Icon = policy.icon;
            return (
              <article key={policy.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-amber-300 text-slate-950">
                  <Icon size={22} aria-hidden />
                </span>
                <h2 className="mt-4 text-xl font-black text-slate-950">{policy.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{policy.text}</p>
              </article>
            );
          })}
        </div>
        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Ghi chú vận hành</h2>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-700">
            <li>• Kiểm tra app sản lượng định kỳ để phát hiện bất thường sớm.</li>
            <li>• Vệ sinh tấm pin tùy mức bụi, độ dốc mái và môi trường xung quanh.</li>
            <li>• Không tự ý tháo tủ điện, inverter hoặc dây DC khi chưa có kỹ thuật hỗ trợ.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
