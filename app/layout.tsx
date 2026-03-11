import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const siteUrl = "https://cant-maintain.saschb2b.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Can't Maintain — React Component API Game",
    template: "%s — Can't Maintain",
  },
  description:
    "Train your eye for clean React component APIs. Pick the better design in 10 side-by-side challenges — props, composition, TypeScript patterns, and more.",
  keywords: [
    "React",
    "props",
    "TypeScript",
    "component API",
    "prop naming",
    "component API design",
    "React patterns",
    "composition",
    "generics",
    "quiz",
    "training",
    "best practices",
    "JSDoc",
    "callbacks",
    "boolean props",
  ],
  authors: [{ name: "Sascha", url: "https://saschb2b.com/" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Can't Maintain",
    title: "Can't Maintain — React Component API Game",
    description:
      "Can you spot the better API? Train your eye for clean React component APIs in under 5 minutes.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Can't Maintain — React Component API Game",
    description:
      "Can you spot the better API? Train your eye for clean React component APIs in under 5 minutes.",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <header>
        <Script
          async
          src="https://umami.saschb2b.com/script.js"
          data-website-id="c4123bd8-26b2-45df-9f44-ff7139d83c30"
        />
      </header>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
