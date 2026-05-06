import { FAQAccordion } from "@/components/FAQAccordion";
import { FeaturedProjectCarousel } from "@/components/FeaturedProjectCarousel";
import { HeroSection } from "@/components/HeroSection";
import { LeadForm } from "@/components/LeadForm";
import { PricingTable } from "@/components/PricingTable";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { QuickCalculator } from "@/components/QuickCalculator";
import { SectionHeading } from "@/components/SectionHeading";
import { TrustSection } from "@/components/TrustSection";
import { faqs } from "@/data/faqs";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedProjectCarousel />
      <section id="calculator" className="bg-white py-14 sm:py-16">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Tính nhanh"
            title="Ước tính công suất và chi phí trước khi khảo sát"
            description="Nhập vài thông tin cơ bản để có khoảng công suất phù hợp, số tấm pin dự kiến, diện tích mái cần dùng và mốc hoàn vốn tốt nhất."
          />
          <QuickCalculator />
        </div>
      </section>
      <TrustSection />
      <ProcessTimeline />
      <section id="pricing" className="bg-slate-50 py-14 sm:py-16">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Bảng giá tham khảo"
            title="Khoảng chi phí theo quy mô công trình"
            description="Giá thực tế phụ thuộc vật tư, loại mái, đường dây, tủ điện, chống sét và nhu cầu lưu trữ. Bảng này giúp khách có mốc ngân sách ban đầu."
          />
          <PricingTable />
        </div>
      </section>
      <section className="bg-white py-14 sm:py-16">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Câu hỏi thường gặp"
            title="Giải đáp nhanh trước khi khách quyết định khảo sát"
          />
          <FAQAccordion faqs={faqs} />
        </div>
      </section>
      <section id="contact" className="bg-slate-50 py-14 sm:py-16">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Nhận tư vấn"
              title="Gửi hóa đơn điện và ảnh mái để kỹ thuật tính phương án đúng hơn"
              description="Thông tin được gửi về Telegram và Google Sheet để bên kỹ thuật liên hệ sớm nhất. Khách càng gửi đủ ảnh, phương án càng sát thực tế."
            />
            <div className="mt-6 grid gap-3 text-sm leading-6 text-slate-700">
              <p>Ưu tiên tư vấn theo hóa đơn điện thực tế, hướng mái, bóng che và tỷ lệ dùng điện ban ngày.</p>
              <p>Kết quả trên website là ước tính sơ bộ; phương án chốt cần khảo sát kỹ thuật tại công trình.</p>
            </div>
          </div>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
