import type { Metadata, Viewport } from "next";
import { ClearStaleServiceWorker } from "@/components/layout/ClearStaleServiceWorker";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SkipLink } from "@/components/layout/SkipLink";
import { ChatWidget } from "@/components/layout/ChatWidget";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { school } from "@/lib/school";
import { heroImage } from "@/lib/activities";
import { siteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${school.name} — Bingerville, Adjamé-Bingerville`,
    template: `%s | ${school.name}`,
  },
  description: school.description,
  applicationName: school.name,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${school.name} — Bingerville`,
    description: school.description,
    locale: "fr_CI",
    type: "website",
    siteName: school.name,
    url: siteUrl,
    images: [
      {
        url: heroImage.src,
        width: 1200,
        height: 630,
        alt: heroImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${school.name} — Bingerville`,
    description: school.description,
    images: [heroImage.src],
  },
};

export const viewport: Viewport = {
  themeColor: "#12305c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-paper text-ink antialiased">
        <ClearStaleServiceWorker />
        <DemoBanner />
        <SkipLink />
        <SiteHeader />
        <main id="contenu-principal">{children}</main>
        <SiteFooter />
        <WhatsAppButton />
        <ChatWidget />
      </body>
    </html>
  );
}
