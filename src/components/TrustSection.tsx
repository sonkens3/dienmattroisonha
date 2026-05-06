import { BadgeCheck, FileText, LineChart, ShieldCheck, Sun, Wrench } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

const reasons = [
  {
    icon: FileText,
    title: "Tư vấn theo hóa đơn thực tế",
    text: "Không đẩy công suất quá lớn nếu mức dùng điện ban ngày, diện tích mái hoặc ngân sách chưa phù hợp.",
  },
  {
    icon: BadgeCheck,
    title: "Báo giá minh bạch",
    text: "Tách rõ pin, inverter, khung giàn, dây dẫn, tủ điện, chống sét, tiếp địa và nhân công.",
  },
  {
    icon: Sun,
    title: "Khảo sát kỹ điều kiện mái",
    text: "Kiểm tra hướng nắng, bóng che, lối đi dây, vị trí inverter và độ phù hợp của kết cấu mái.",
  },
  {
    icon: LineChart,
    title: "Theo dõi sản lượng",
    text: "Hướng dẫn khách xem sản lượng ngày, tháng, năm trên app để biết hệ đang vận hành ra sao.",
  },
  {
    icon: ShieldCheck,
    title: "Bảo hành rõ ràng",
    text: "Chính sách bảo hành vật tư và thi công được giải thích trước khi ký hợp đồng.",
  },
  {
    icon: Wrench,
    title: "Ưu tiên hiệu quả thật",
    text: "Tính theo tỷ lệ tự dùng ban ngày, không vẽ lợi nhuận ảo hay bỏ qua chi phí thi công thực tế.",
  },
];

export function TrustSection() {
  return (
    <section className="bg-slate-950 py-14 text-white sm:py-16">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Năng lực tư vấn"
              title="Khách cần thấy đây là đội kỹ thuật, không chỉ là nơi bán thiết bị"
              description="Mỗi phương án phải khớp với hóa đơn điện, kiểu mái, thói quen dùng điện và khả năng đầu tư của chủ công trình."
              theme="dark"
            />
            <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.06] p-5">
              <p className="text-sm font-bold uppercase tracking-wide text-amber-200">
                Quy tắc tư vấn
              </p>
              <p className="mt-2 text-lg font-black leading-8 text-white">
                Tính đúng hệ cần lắp, nói rõ phần cần khảo sát, không hứa hoàn vốn thiếu căn cứ.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {reasons.map((reason) => {
              const Icon = reason.icon;
              return (
                <article key={reason.title} className="rounded-lg border border-white/[0.12] bg-white/[0.06] p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-md bg-teal-500 text-white">
                    <Icon size={22} aria-hidden />
                  </span>
                  <h3 className="mt-4 text-lg font-black">{reason.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{reason.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
