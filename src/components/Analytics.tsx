"use client";

import Script from "next/script";

const id = process.env.NEXT_PUBLIC_ANALYTICS_ID;

/** Plausible-style: set NEXT_PUBLIC_ANALYTICS_ID to your domain (e.g. careersimulator.app) */
export function Analytics() {
  if (!id) return null;
  const isPlausible = !id.startsWith("G-");
  if (isPlausible) {
    return (
      <Script
        defer
        data-domain={id}
        src="https://plausible.io/js/script.js"
        strategy="afterInteractive"
      />
    );
  }
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}

export function trackEvent(name: string, props?: Record<string, string>) {
  if (typeof window === "undefined") return;
  const w = window as Window & {
    plausible?: (e: string, o?: { props: Record<string, string> }) => void;
    gtag?: (...args: unknown[]) => void;
  };
  if (w.plausible) {
    w.plausible(name, props ? { props } : undefined);
  } else if (w.gtag) {
    w.gtag("event", name, props);
  }
}
