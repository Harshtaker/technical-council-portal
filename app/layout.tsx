import type { Metadata } from "next"; // ✅ Required import
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Technical Council | REC Ambedkar Nagar",
  description: "Official Hub for Innovation and Technical Excellence",
  metadataBase: new URL("https://technical-council-portal.vercel.app"),
  icons: {
    icon: "/logo.png", 
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
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}