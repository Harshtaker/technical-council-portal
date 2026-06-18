import type { Metadata } from "next"; // ✅ Required import
import { Inter } from "next/font/google";
// @ts-ignore: Suppress missing type declarations for CSS side-effect import
import "./globals.css";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Technical Council | REC Ambedkar Nagar",
  description: "Official Hub for Innovation and Technical Excellence",
  metadataBase: new URL("https://technical-council-portal.vercel.app"),
  icons: {
    // ✅ SYSTEM THEME ICON MATRIX: Detects system mode and changes tab icon automatically
    icon: [
      {
        url: "/favicon-dark.png",
        media: "(prefers-color-scheme: light)", // Light system theme -> shows dark logo
      },
      {
        url: "/favicon-light.png",
        media: "(prefers-color-scheme: dark)",  // Dark system theme -> shows white logo
      },
    ],
    shortcut: "/favicon-light.png",
    apple: "/favicon-light.png",
  },
  openGraph: {
    title: "Technical Council | REC Ambedkar Nagar",
    description: "Official Hub for Innovation and Technical Excellence",
    url: "/",
    siteName: "Technical Council RECABN",
    images: [
      {
        url: "/logo.png", 
        width: 1200,
        height: 630,
        alt: "Technical Council Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* ✅ FIXED: Added smooth transition classes to body wrapper for flawless system theme adaptation */}
      <body className={`${inter.className} min-h-screen bg-theme-bg text-theme-text transition-colors duration-300 antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}