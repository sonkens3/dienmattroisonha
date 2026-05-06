import type { Metadata } from "next";
import { PaybackCalculator } from "@/components/PaybackCalculator";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Công cụ tính chi phí lắp điện mặt trời và mốc hoàn vốn",
  description:
    "Nhập tiền điện hằng tháng để tính sơ bộ hệ điện mặt trời phù hợp, số tấm pin, diện tích mái, chi phí đầu tư và mốc hoàn vốn.",
};

export default function CalculatorPage() {
  return (
    <section className="bg-slate-50 py-14 sm:py-16">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Tính hoàn vốn"
          title="Công cụ tính chi phí và hoàn vốn chi tiết hơn"
          description="Kết quả là khoảng ước tính, không phải cam kết sản lượng. Phương án cuối cùng cần khảo sát hướng mái, bóng che, tủ điện và thói quen dùng điện thực tế."
        />
        <div className="mt-8">
          <PaybackCalculator />
        </div>
      </div>
    </section>
  );
}
