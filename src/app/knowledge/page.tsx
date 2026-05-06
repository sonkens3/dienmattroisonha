import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { articles } from "@/data/articles";

export const metadata: Metadata = {
  title: "Kiến thức điện mặt trời áp mái",
  description:
    "Các bài viết ngắn giúp khách hàng hiểu khi nào nên lắp điện mặt trời, chọn hòa lưới hay hybrid, có cần pin lưu trữ không và cách tính số tấm pin.",
};

export default function KnowledgePage() {
  return (
    <section className="bg-slate-50 py-14 sm:py-16">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Kiến thức"
          title="Bài viết ngắn cho khách hàng mới tìm hiểu"
          description="Nội dung được viết theo cách dễ hiểu để khách nắm được những quyết định quan trọng trước khi khảo sát."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article key={article.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-teal-700 text-white">
                <BookOpen size={20} aria-hidden />
              </span>
              <h2 className="mt-4 text-lg font-black leading-snug text-slate-950">{article.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{article.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
