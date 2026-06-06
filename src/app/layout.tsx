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

const siteUrl = "https://dienmattroisonha.com";
const siteTitle = "Điện mặt trời Sơn Hà | Lắp đặt điện mặt trời áp mái";
const siteDescription =
  "Tư vấn lắp đặt điện mặt trời cho hộ gia đình, nhà nghỉ, quán cafe và xưởng nhỏ. Tính công suất, chi phí đầu tư và mốc hoàn vốn theo hóa đơn điện thực tế.";
const shareImage = {
  url: "/share-cover.jpg",
  width: 1280,
  height: 604,
  alt: "Biển hiệu Điện mặt trời Sơn Hà với số điện thoại 0975 284 194 và website dienmattroisonha.com",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "Điện mặt trời Sơn Hà",
    locale: "vi_VN",
    type: "website",
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [shareImage],
  },
};

const publicAssetBasePath =
  process.env.GITHUB_PAGES === "true" && process.env.GITHUB_PAGES_CUSTOM_DOMAIN !== "true"
    ? `/${process.env.GITHUB_PAGES_REPO ?? "dienmattroisonha"}`
    : "";

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
