import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import { Target } from 'lucide-react';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Macro-Resume Pro | AI Resume Optimizer",
  description: "Get past the ATS. Optimize your resume with AI specifically tailored for your target job description.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-emerald-500/30 flex flex-col`}
      >
        {/* Universal Navigation */}
        <nav className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">

              <Link href="/" className="flex items-center gap-2 group">
                <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 p-1.5 rounded-lg group-hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] transition-shadow">
                  <Target className="w-5 h-5 text-neutral-950" />
                </div>
                <span className="font-bold text-xl tracking-tight hidden sm:block">
                  Macro-Resume<span className="text-emerald-400">Pro</span>
                </span>
              </Link>

              <div className="flex items-center gap-4">
                <Link href="/builder" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">
                  Try the Tool
                </Link>
                <Link href="/builder" className="bg-white hover:bg-neutral-200 text-neutral-950 text-sm font-bold px-4 py-2 rounded-full transition-colors">
                  Get Started
                </Link>
              </div>

            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-neutral-800 py-12 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 opacity-50">
              <Target className="w-5 h-5 text-neutral-400" />
              <span className="font-bold tracking-tight text-neutral-400">
                Macro-Resume<span className="text-emerald-500">Pro</span>
              </span>
            </div>

            <div className="flex items-center gap-8 text-sm font-medium text-neutral-400">
              <Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link>
              <Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link>
              <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            </div>

            <p className="text-neutral-500 text-sm">
              © {new Date().getFullYear()} Macro-Resume Pro. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
