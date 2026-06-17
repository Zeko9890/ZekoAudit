'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

const links = [
  { name: 'Features', path: '/#features' },
  { name: 'How It Works', path: '/#how-it-works' },
  { name: 'Examples', path: '/examples' },
  { name: 'Docs', path: '/docs' }
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  // --- Transform-based indicator ---
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const indicatorRef = useRef<HTMLDivElement>(null);

  // Track which link the indicator should follow: hover takes priority, then active route
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeIndex = links.findIndex((link) => link.path === pathname);

  // The "target" index: hover wins, otherwise fall back to active route
  const targetIndex = hoveredIndex !== null ? hoveredIndex : (activeIndex >= 0 ? activeIndex : null);

  const positionIndicator = useCallback(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator) return;

    if (targetIndex === null) {
      indicator.style.opacity = '0';
      return;
    }

    const targetEl = linkRefs.current[targetIndex];
    if (!targetEl) {
      indicator.style.opacity = '0';
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    const x = targetRect.left - navRect.left;
    const width = targetRect.width;

    indicator.style.opacity = '1';
    indicator.style.transform = `translateX(${x}px)`;
    indicator.style.width = `${width}px`;
  }, [targetIndex]);

  // Reposition whenever targetIndex changes
  useEffect(() => {
    positionIndicator();
  }, [positionIndicator]);

  // Also reposition on window resize
  useEffect(() => {
    window.addEventListener('resize', positionIndicator);
    return () => window.removeEventListener('resize', positionIndicator);
  }, [positionIndicator]);

  return (
    <motion.header 
      className={`fixed top-0 z-50 w-full transition-all duration-300 border-b ${scrolled ? 'bg-black/80 backdrop-blur-md border-white/10' : 'bg-transparent border-transparent'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
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

        <nav
          ref={navRef}
          className="hidden md:flex items-center space-x-1 relative"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Single persistent indicator — never remounts */}
          <div
            ref={indicatorRef}
            className="absolute top-0 left-0 h-full rounded-sm pointer-events-none"
            style={{
              opacity: 0,
              willChange: 'transform, width',
              transition: 'transform 0.2s ease-out, width 0.2s ease-out, opacity 0.15s ease-out',
            }}
          >
            <div className="absolute inset-0 bg-white/5 rounded-sm" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-[#FF5500]" />
          </div>

          {links.map((link, i) => {
            const isActive = link.path === pathname;
            return (
              <Link
                key={link.path}
                ref={(el) => { linkRefs.current[i] = el; }}
                href={link.path}
                onMouseEnter={() => setHoveredIndex(i)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${isActive ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                {link.name}
              </Link>
            );
          })}
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
    </motion.header>
  );
}
