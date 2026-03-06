import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { CookieConsent } from "@/components/shared/CookieConsent";

export const metadata: Metadata = {
  title: {
    default: "SNIF - Social Networking In Fur",
    template: "%s | SNIF",
  },
  description:
    "Connect your pets with others for playdates, breeding, and friendship. SNIF is the social network for pets and their humans.",
  keywords: ["pets", "dog matching", "pet social network", "pet playdates"],
  openGraph: {
    title: "SNIF - Social Networking In Fur",
    description: "Connect your pets with others",
    type: "website",
  },
};

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <CookieConsent />
      </body>
    </html>
  );
}
