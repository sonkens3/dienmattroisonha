"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { Faq } from "@/data/faqs";

export function FAQAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mt-8 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-sm">
      {faqs.map((faq, index) => {
        const open = openIndex === index;
        return (
          <div key={faq.question}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold text-slate-950"
              onClick={() => setOpenIndex(open ? -1 : index)}
              aria-expanded={open}
            >
              <span>{faq.question}</span>
              <ChevronDown
                size={19}
                aria-hidden
                className={`shrink-0 transition ${open ? "rotate-180" : ""}`}
              />
            </button>
            {open ? (
              <div className="px-5 pb-5 text-sm leading-7 text-slate-600">{faq.answer}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
