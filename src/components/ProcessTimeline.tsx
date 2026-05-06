import { SectionHeading } from "@/components/SectionHeading";

const steps = [
  {
    title: "Tiếp nhận thông tin",
    text: "Hóa đơn điện, ảnh mái, loại công trình và nhu cầu dùng điện.",
  },
  {
    title: "Khảo sát kỹ thuật",
    text: "Kiểm tra hướng nắng, bóng che, tủ điện, đường dây và kết cấu mái.",
  },
  {
    title: "Chốt phương án",
    text: "Tính công suất, số tấm pin, inverter, tủ bảo vệ và chi phí dự kiến.",
  },
  {
    title: "Thi công bàn giao",
    text: "Lắp đặt, chạy thử, nghiệm thu, hướng dẫn app và bảo trì sau lắp.",
  },
];

export function ProcessTimeline() {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Quy trình làm việc"
          title="Từ hóa đơn điện đến phương án lắp đặt rõ ràng"
          description="Rút gọn thành các bước khách dễ hiểu, nhưng vẫn thể hiện đủ phần kỹ thuật cần kiểm tra trước khi quyết định đầu tư."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative rounded-lg border border-slate-200 bg-slate-50 p-5">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-amber-300 text-sm font-black text-slate-950">
                {index + 1}
              </span>
              <h3 className="mt-5 text-lg font-black text-slate-950">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
