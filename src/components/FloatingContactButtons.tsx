import { Calculator, MessageCircle, PhoneCall } from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";
import { contactInfo } from "@/data/contact";

export function FloatingContactButtons() {
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/96 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-10px_30px_rgba(15,23,42,0.14)] backdrop-blur sm:hidden">
        <div className="grid grid-cols-3 gap-2">
          <MobileAction href={contactInfo.phoneHref} label="Gọi ngay" icon={PhoneCall} tone="dark" />
          <MobileAction href={contactInfo.zaloHref} label="Zalo" icon={MessageCircle} tone="blue" />
          <MobileAction href="/calculator" label="Tính nhanh" icon={Calculator} tone="amber" internal />
        </div>
      </div>

      <div className="fixed bottom-5 left-5 z-30 hidden gap-2 sm:grid">
        <a
          href={contactInfo.phoneHref}
          className="grid h-11 w-11 place-items-center rounded-md bg-slate-950 text-white shadow-lg transition hover:bg-teal-800"
          aria-label="Gọi ngay"
          title="Gọi ngay"
        >
          <PhoneCall size={20} aria-hidden />
        </a>
        <a
          href={contactInfo.zaloHref}
          className="grid h-11 w-11 place-items-center rounded-md bg-blue-600 text-white shadow-lg transition hover:bg-blue-700"
          aria-label="Liên hệ Zalo"
          title="Liên hệ Zalo"
        >
          <MessageCircle size={20} aria-hidden />
        </a>
      </div>
    </>
  );
}

function MobileAction({
  href,
  label,
  icon: Icon,
  tone,
  internal = false,
}: {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
  tone: "dark" | "blue" | "amber";
  internal?: boolean;
}) {
  const className = `flex min-h-[52px] items-center justify-center gap-1.5 rounded-md px-2 py-2 text-center text-[13px] font-black shadow-sm ${
    tone === "dark"
      ? "bg-slate-950 text-white"
      : tone === "blue"
        ? "bg-blue-600 text-white"
        : "bg-amber-300 text-slate-950"
  }`;

  const content = (
    <>
      <Icon size={18} aria-hidden />
      <span>{label}</span>
    </>
  );

  if (internal) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {content}
    </a>
  );
}
