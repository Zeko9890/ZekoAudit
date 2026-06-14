import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#FF5500]/10 border border-[#FF5500]/20">
                <ShieldCheck className="h-5 w-5 text-[#FF5500]" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Zeko<span className="text-[#FF5500]">Audit</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-400 max-w-xs">
              Automated audit platform delivering instant page speed, SEO, accessibility, and best practice metrics for modern web apps.
            </p>
          </div>

          {/* Links Grid */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-zinc-200">Product</h3>
                <ul role="list" className="mt-4 space-y-3">
                  <li>
                    <Link href="/#features" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="/#examples" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      Example Audits
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-zinc-200">Resources</h3>
                <ul role="list" className="mt-4 space-y-3">
                  <li>
                    <Link href="https://nextjs.org/docs" target="_blank" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      Documentation
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} ZekoAudit. All rights reserved.
          </p>
          <p className="text-xs text-zinc-500 mt-4 md:mt-0">
            Designed for performance and clarity.
          </p>
        </div>
      </div>
    </footer>
  );
}
