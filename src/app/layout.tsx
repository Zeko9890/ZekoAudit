import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZekoAudit | Premium Website Audit & Speed Analyzer",
  description: "Analyze your website performance, SEO, accessibility, and best practices instantly. Get comprehensive audit reports and recommendations to optimize your page.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark scroll-smooth scroll-pt-14`}
      style={{ colorScheme: 'dark' }}
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-[#9CA3AF] selection:bg-[#00E66A]/30 selection:text-[#00E66A]">
        <Header />
        <main className="flex-grow flex flex-col pt-14">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
