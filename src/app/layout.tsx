import type { Metadata } from "next";
import { Gothic_A1 } from "next/font/google";
import { OG_IMAGE, SITE_DESCRIPTION, SITE_TITLE, SITE_URL, THEME_INIT_SCRIPT } from "@/lib/site";
import "./globals.css";

const gothic = Gothic_A1({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-gothic",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${SITE_TITLE}` },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // 테마 스크립트가 hydration 전에 class를 바꾸므로 불일치 경고를 끕니다.
    <html lang="ko" className={`dark ${gothic.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
