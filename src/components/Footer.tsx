import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-5 xl:gap-8">
          {/* Brand info (2 cols) */}
          <div className="space-y-8 xl:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#FF5500]/10 border border-[#FF5500]/20">
                <ShieldCheck className="h-5 w-5 text-[#FF5500]" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Zeko<span className="text-[#FF5500]">Audit</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-400 max-w-xs leading-relaxed">
              Automated audit platform delivering instant page speed, SEO, accessibility, and best practice metrics for modern web apps. Built for engineers who care about performance.
            </p>
            <div>
              <Link 
                href="/#analyze" 
                className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-6 py-3 rounded-sm transition-all"
              >
                Start Free Audit <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Links Grid (3 cols) */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-3 xl:mt-0 sm:grid-cols-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Product</h3>
              <ul role="list" className="space-y-4">
                <li><Link href="/#analyze" className="text-sm text-zinc-400 hover:text-[#FF5500] transition-colors">Audit Website</Link></li>
                <li><Link href="/compare" className="text-sm text-zinc-400 hover:text-[#FF5500] transition-colors">Compare Websites</Link></li>
                <li><Link href="/examples" className="text-sm text-zinc-400 hover:text-[#FF5500] transition-colors">Examples</Link></li>
                <li><Link href="/pdf-reports" className="text-sm text-zinc-400 hover:text-[#FF5500] transition-colors">PDF Reports</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Resources</h3>
              <ul role="list" className="space-y-4">
                <li><Link href="/docs" className="text-sm text-zinc-400 hover:text-[#FF5500] transition-colors">Documentation</Link></li>
                <li><Link href="/#how-it-works" className="text-sm text-zinc-400 hover:text-[#FF5500] transition-colors">How It Works</Link></li>
                <li><Link href="/docs#faq" className="text-sm text-zinc-400 hover:text-[#FF5500] transition-colors">FAQ</Link></li>
                <li><Link href="/metrics-guide" className="text-sm text-zinc-400 hover:text-[#FF5500] transition-colors">Metrics Guide</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Company</h3>
              <ul role="list" className="space-y-4">
                <li><Link href="/about" className="text-sm text-zinc-400 hover:text-[#FF5500] transition-colors">About</Link></li>
                <li><Link href="/roadmap" className="text-sm text-zinc-400 hover:text-[#FF5500] transition-colors">Roadmap</Link></li>
                <li><Link href="/changelog" className="text-sm text-zinc-400 hover:text-[#FF5500] transition-colors">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Legal</h3>
              <ul role="list" className="space-y-4">
                <li><Link href="/security" className="text-sm text-zinc-400 hover:text-[#FF5500] transition-colors">Security</Link></li>
                <li><Link href="/privacy" className="text-sm text-zinc-400 hover:text-[#FF5500] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-zinc-400 hover:text-[#FF5500] transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} ZekoAudit. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0 text-xs text-zinc-500">
            <span>Designed for engineers.</span>
            <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
            <span>Built with Next.js & Framer Motion.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
