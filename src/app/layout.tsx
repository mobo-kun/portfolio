import type { Metadata } from "next";
import { Intel_One_Mono, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const intelOneMono = Intel_One_Mono({
  subsets: ["latin"],
  variable: "--font-intel-one-mono",
  weight: ["400", "700"],
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://behdad.vercel.app"),
  title: "Behdad Morsalpoor — Senior Product Design Lead",
  description:
    "Senior Product Design Lead with 12+ years scaling Fintech platforms (11M+ users). HCI · Crypto · Behavioural Design. Relocating to Barcelona, Oct 2026.",
  openGraph: {
    title: "Behdad Morsalpoor — Senior Product Design Lead",
    description:
      "Senior Product Design Lead with 12+ years scaling Fintech platforms (11M+ users). HCI · Crypto · Behavioural Design.",
    images: [{ url: "/og-default.png" }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${intelOneMono.variable} ${robotoMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-bg text-text-primary font-roboto">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
