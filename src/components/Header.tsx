'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, GitCompareArrows } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black backdrop-blur-none">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#FF5500]/10 border border-[#FF5500]/20 group-hover:border-[#FF5500]/50 transition-all">
            <ShieldCheck className="h-5 w-5 text-[#FF5500] group-hover:text-[#E64C00] transition-colors" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Zeko<span className="text-[#FF5500]">Audit</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-400">
          <Link href="/#features" className="hover:text-white transition-colors">
            Features
          </Link>
          <Link href="/#how-it-works" className="hover:text-white transition-colors">
            How It Works
          </Link>
          <Link href="/examples" className="hover:text-white transition-colors">
            Examples
          </Link>
          <Link href="/docs" className="hover:text-white transition-colors">
            Docs
          </Link>
        </nav>

        {/* Mobile Menu Button / Secondary Actions */}
        <div className="flex items-center space-x-4">
          <Link 
            href="/#analyze" 
            className="hidden md:inline-flex items-center justify-center rounded-sm bg-white/5 border border-white/10 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-white/10"
          >
            Run Audit
          </Link>
          <button className="md:hidden text-zinc-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>
      </div>
    </header>
  );
}
