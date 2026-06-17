'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const links = [
    { name: 'Features', path: '/#features' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'Examples', path: '/examples' },
    { name: 'Docs', path: '/docs' }
  ];

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

        <nav className="hidden md:flex items-center space-x-1">
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                onMouseEnter={() => setHoveredPath(link.path)}
                onMouseLeave={() => setHoveredPath(null)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                <span className="relative z-10">{link.name}</span>
                {hoveredPath === link.path && (
                  <motion.div
                    layoutId="navbar-hover"
                    className="absolute inset-0 bg-white/5 rounded-sm -z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      layout: { type: "tween", ease: "easeOut", duration: 0.2 },
                      opacity: { duration: 0.15 }
                    }}
                  >
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-[#FF5500]"></div>
                  </motion.div>
                )}
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
