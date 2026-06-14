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

        <nav className="hidden md:flex space-x-8 text-sm font-medium text-zinc-400">
          <Link href="/#features" className="hover:text-white transition-colors">
            Features
          </Link>
          <Link href="/#examples" className="hover:text-white transition-colors">
            Examples
          </Link>
          <Link href="/compare" className="hover:text-white transition-colors flex items-center gap-1.5">
            <GitCompareArrows className="h-3.5 w-3.5" />
            Compare Websites
          </Link>
        </nav>

        {/* CTA Button */}
        <div className="flex items-center space-x-4">
          <Link 
            href="/audit" 
            className="group relative inline-flex items-center justify-center rounded-sm bg-[#FF5500] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[#E64C00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5500]"
          >
            Start Auditing
            <ArrowRight className="ml-1.5 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </header>
  );
}
