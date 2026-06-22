'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

const links = [
  { name: 'Features', path: '/#features' },
  { name: 'How It Works', path: '/#how-it-works' },
  { name: 'Compare', path: '/compare' },
  { name: 'Docs', path: '/docs' },
  { name: 'Examples', path: '/examples' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => setScrolled(latest > 20));

  useEffect(() => setMobileOpen(false), [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (path.startsWith('/#')) {
      e.preventDefault();
      const id = path.slice(2);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.location.href = path;
      setMobileOpen(false);
    }
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#050505]/70 backdrop-blur-xl border-b border-[#00E66A]/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent border-transparent'
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="mx-auto flex max-w-[1200px] h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group shrink-0">
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

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className="text-[13px] font-semibold text-zinc-400 hover:text-white transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com"
              target="_blank"
              className="hidden md:inline-flex items-center justify-center rounded-md border border-white/10 px-4 py-2 text-[13px] font-semibold text-zinc-300 hover:bg-white/5 hover:text-white transition-all duration-200"
            >
              Star on GitHub
            </Link>
            <Link
              href="/audit"
              className="hidden md:inline-flex items-center justify-center rounded-md bg-[#00E66A] hover:bg-[#00c55a] text-black px-4 py-2 text-[13px] font-bold transition-all duration-200 gap-1.5 shadow-[0_0_25px_rgba(0,230,106,0.25)] hover:shadow-[0_0_35px_rgba(0,230,106,0.4)]"
            >
              Start Free Audit <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1.5 text-zinc-400 hover:text-white transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 inset-x-0 z-40 md:hidden bg-[#050505]/95 backdrop-blur-xl border-b border-[#00E66A]/10 shadow-xl"
          >
            <nav className="flex flex-col divide-y divide-white/5 px-4 py-2">
              {links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className="py-4 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="py-6 flex flex-col gap-3">
                <Link
                  href="https://github.com"
                  target="_blank"
                  className="flex items-center justify-center rounded-md border border-white/10 px-4 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-white/5 hover:text-white transition-all"
                >
                  Star on GitHub
                </Link>
                <Link
                  href="/audit"
                  className="flex items-center justify-center rounded-md bg-[#00E66A] text-black px-4 py-2.5 text-sm font-bold gap-2 shadow-[0_0_25px_rgba(0,230,106,0.25)]"
                >
                  Start Free Audit <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
