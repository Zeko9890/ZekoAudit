import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] bg-[#050505]">
      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-5 xl:gap-8">
          
          {/* Brand info (2 cols) */}
          <div className="space-y-6 xl:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 2L3 9.5V22.5L16 30L29 22.5V9.5L16 2Z" stroke="#00E66A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 8L23.5 12.3301V20.9904L16 25.3205L8.5 20.9904V12.3301L16 8Z" stroke="#00E66A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11 16H14L16 11L18 21L20 16H22" stroke="#00E66A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-[18px] font-bold tracking-tight text-white">
                Zeko<span className="text-[#00E66A]">Audit</span>
              </span>
            </Link>
            <p className="text-sm text-[#9CA3AF] max-w-xs leading-relaxed">
              Premium website auditing and performance analytics. Run Lighthouse diagnostics, AI-powered analysis, and generate professional PDF reports.
            </p>
          </div>

          {/* Links Grid (3 cols) */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-3 xl:mt-0 sm:grid-cols-3">
            <div>
              <h3 className="text-[13px] font-semibold text-white tracking-wide mb-6">Product</h3>
              <ul role="list" className="space-y-4">
                <li><Link href="/#features" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pdf-reports" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">Reports</Link></li>
                <li><Link href="/audit" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">Visual Audit</Link></li>
                <li><Link href="/compare" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">Compare</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[13px] font-semibold text-white tracking-wide mb-6">Resources</h3>
              <ul role="list" className="space-y-4">
                <li><Link href="/docs" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">Docs</Link></li>
                <li><Link href="/examples" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">Examples</Link></li>
                <li><Link href="/privacy" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[13px] font-semibold text-white tracking-wide mb-6">Company</h3>
              <ul role="list" className="space-y-4">
                <li><Link href="/about" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">About</Link></li>
                <li><Link href="/changelog" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">Changelog</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 border-t border-white/[0.04] pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-[#9CA3AF]">
            &copy; {new Date().getFullYear()} ZekoAudit. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0 text-xs text-[#9CA3AF]">
            <span>Designed for engineers.</span>
            <span className="w-1 h-1 rounded-full bg-zinc-800"></span>
            <span>Built with Next.js & Framer Motion.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
