import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { AppFooter } from "@/components/AppFooter";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HtmlLang } from "@/components/HtmlLang";
import { LocaleProvider } from "@/components/LocaleProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NavLinks } from "@/components/NavLinks";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
  "http://localhost:3456";

const geistSans = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-geist-sans",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Career Simulator — 20 вопросов, 5 профессий",
    template: "%s | Career Simulator",
  },
  description:
    "Симулятор карьеры для подростков: зарплаты, AI-risk и roadmap на 30 дней. 200+ профессий в каталоге.",
  openGraph: {
    title: "Career Simulator",
    description: "15 questions → 5 careers with salary, AI-risk, and roadmap",
    url: appUrl,
    siteName: "Career Simulator",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Simulator",
    description: "15 questions → 5 careers with salary, AI-risk, and roadmap",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${display.variable}`}
      style={{ background: "#0a0f14" }}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-[#0a0f14] font-sans text-[#e8eef4] antialiased"
        style={{ backgroundColor: "#0a0f14", color: "#e8eef4" }}
      >
        <noscript>
          <div
            style={{
              padding: 24,
              textAlign: "center",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Career Simulator требует JavaScript. Включите его в настройках браузера
            и откройте{" "}
            <a href="http://localhost:3456" style={{ color: "#2dd4bf" }}>
              http://localhost:3456
            </a>
          </div>
        </noscript>
        <Analytics />
        <ErrorBoundary>
          <LocaleProvider>
            <HtmlLang />
            <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0f14]/90 backdrop-blur-lg">
              <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3">
                <Link
                  href="/"
                  className="shrink-0 font-display text-lg font-bold tracking-tight"
                >
                  Career<span className="text-brand-400">Sim</span>
                </Link>
                <NavLinks />
                <LanguageSwitcher />
              </div>
            </header>
            <DisclaimerBanner />
            <main>{children}</main>
            <AppFooter />
          </LocaleProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
