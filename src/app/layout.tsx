import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import Script from "next/script";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { FloatingContactButtons } from "@/components/FloatingContactButtons";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-be-vietnam-pro",
});

export const metadata: Metadata = {
  title: "Điện mặt trời Sơn Hà | Lắp đặt điện mặt trời áp mái",
  description:
    "Tư vấn lắp đặt điện mặt trời cho hộ gia đình, nhà nghỉ, quán cafe và xưởng nhỏ. Tính công suất, chi phí đầu tư và mốc hoàn vốn theo hóa đơn điện thực tế.",
};

const publicAssetBasePath =
  process.env.GITHUB_PAGES === "true" ? `/${process.env.GITHUB_PAGES_REPO ?? "dienmattroisonha"}` : "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} h-full scroll-smooth`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col bg-slate-50 text-slate-950 antialiased"
        suppressHydrationWarning
      >
        <Script
          id="strip-extension-hydration-attrs"
          src={`${publicAssetBasePath}/strip-extension-hydration-attrs.js`}
          strategy="beforeInteractive"
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingContactButtons />
        <ChatbotWidget />
      </body>
    </html>
  );
}
