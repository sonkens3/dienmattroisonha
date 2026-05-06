"use client";

import { Menu, PhoneCall, ShieldCheck, SunMedium, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { contactInfo } from "@/data/contact";

const navItems = [
  { label: "Trang chủ", href: "/" },
  { label: "Dự án", href: "/projects" },
  { label: "Bảng giá", href: "/pricing" },
  { label: "Tính hoàn vốn", href: "/calculator" },
  { label: "Kiến thức", href: "/knowledge" },
  { label: "Bảo hành", href: "/warranty" },
  { label: "Liên hệ", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/96 shadow-sm backdrop-blur">
      <div className="section-shell flex h-[68px] items-center justify-between gap-3">
        <Link href="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-teal-700 text-white shadow-sm">
            <SunMedium size={23} aria-hidden />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-base font-black text-slate-950 sm:text-lg">
              {contactInfo.brandName}
            </span>
            <span className="hidden truncate text-xs font-bold text-amber-700 sm:block">
              Tư vấn điện mặt trời áp mái
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Menu chính">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-bold transition ${
                  active
                    ? "bg-teal-50 text-teal-800"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={contactInfo.phoneHref}
            className="hidden items-center gap-2 rounded-md border border-slate-200 bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-teal-800 lg:inline-flex"
          >
            <PhoneCall size={17} aria-hidden />
            Gọi kỹ thuật
          </a>
          <a
            href={contactInfo.phoneHref}
            className="grid h-10 w-10 place-items-center rounded-md bg-teal-700 text-white shadow-sm lg:hidden"
            aria-label="Gọi kỹ thuật"
          >
            <PhoneCall size={18} aria-hidden />
          </a>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-md border border-slate-300 bg-white text-slate-800 xl:hidden"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={21} aria-hidden /> : <Menu size={21} aria-hidden />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white xl:hidden">
          <nav className="section-shell grid gap-1 py-3" aria-label="Menu mobile">
            <div className="mb-2 flex items-center gap-2 rounded-lg border border-teal-100 bg-teal-50 p-3 text-sm font-bold text-teal-900">
              <ShieldCheck size={18} aria-hidden />
              Khảo sát đúng nhu cầu, báo giá rõ từng hạng mục.
            </div>
            {navItems.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-3 text-sm font-bold ${
                    active ? "bg-teal-50 text-teal-800" : "text-slate-800 hover:bg-slate-100"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href={contactInfo.phoneHref}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-black text-white"
            >
              <PhoneCall size={17} aria-hidden />
              Gọi tư vấn trực tiếp
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
