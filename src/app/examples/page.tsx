'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Zap, ShieldCheck, Search, Accessibility, GitCompareArrows } from 'lucide-react';

const EXAMPLES = [
  {
    id: 'stripe',
    name: 'Stripe',
    url: 'stripe.com',
    sector: 'Payment Infrastructure',
    color: 'border-green-500',
    text: 'text-green-500',
    scores: { perf: 92, a11y: 98, best: 100, seo: 100 }
  },
  {
    id: 'vercel',
    name: 'Vercel',
    url: 'vercel.com',
    sector: 'Deployment Platform',
    color: 'border-green-500',
    text: 'text-green-500',
    scores: { perf: 96, a11y: 100, best: 100, seo: 100 }
  },
  {
    id: 'github',
    name: 'GitHub',
    url: 'github.com',
    sector: 'Code Hosting',
    color: 'border-orange-500',
    text: 'text-orange-500',
    scores: { perf: 81, a11y: 94, best: 92, seo: 90 }
  },
  {
    id: 'linear',
    name: 'Linear',
    url: 'linear.app',
    sector: 'Product Engineering',
    color: 'border-green-500',
    text: 'text-green-500',
    scores: { perf: 98, a11y: 100, best: 100, seo: 100 }
  }
];

export default function ExamplesPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-24 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase mb-12">
        <ArrowLeft className="h-4 w-4" /> Back to System
      </Link>

      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={itemVariants} className="max-w-2xl mb-16">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter uppercase mb-6 text-white">
            Example Audits
          </h1>
          <p className="text-zinc-400 font-light text-lg leading-relaxed mb-8">
            Explore live snapshots of industry leaders. See how top-tier engineering teams score on the core web vitals and accessibility standards.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {EXAMPLES.map((ex, idx) => (
            <motion.div 
              key={ex.id}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-zinc-950 border border-white/10 p-6 sm:p-8 rounded-sm relative overflow-hidden group"
            >
              {/* Background Glow */}
              <div className={`absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/5 blur-3xl rounded-full transition-opacity group-hover:opacity-100 opacity-50`}></div>
              
              <div className="relative z-10 flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold uppercase tracking-tight">{ex.name}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-zinc-500 font-mono">{ex.url}</span>
                    <span className="text-[10px] font-mono border border-white/10 px-2 py-0.5 text-zinc-400">{ex.sector}</span>
                  </div>
                </div>
                <Link 
                  href={`/audit?url=${encodeURIComponent(ex.url)}`}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-[#FF5500] hover:text-white text-zinc-400 transition-colors"
                  title={`Run real audit for ${ex.name}`}
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              {/* Mockup Dashboard UI */}
              <div className="bg-black border border-white/5 rounded-sm p-4 sm:p-6 shadow-2xl">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  
                  {/* Perf */}
                  <div className="flex flex-col items-center text-center p-3 border border-white/5 bg-zinc-900/30 rounded-sm">
                    <Zap className={`w-4 h-4 mb-2 ${ex.scores.perf >= 90 ? 'text-green-500' : 'text-orange-500'}`} />
                    <span className={`text-2xl font-black font-mono leading-none mb-1 ${ex.scores.perf >= 90 ? 'text-green-500' : 'text-orange-500'}`}>{ex.scores.perf}</span>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Perf</span>
                  </div>

                  {/* A11y */}
                  <div className="flex flex-col items-center text-center p-3 border border-white/5 bg-zinc-900/30 rounded-sm">
                    <Accessibility className="w-4 h-4 mb-2 text-green-500" />
                    <span className="text-2xl font-black font-mono leading-none mb-1 text-green-500">{ex.scores.a11y}</span>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">A11y</span>
                  </div>

                  {/* Best Practices */}
                  <div className="flex flex-col items-center text-center p-3 border border-white/5 bg-zinc-900/30 rounded-sm">
                    <ShieldCheck className="w-4 h-4 mb-2 text-green-500" />
                    <span className="text-2xl font-black font-mono leading-none mb-1 text-green-500">{ex.scores.best}</span>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Best</span>
                  </div>

                  {/* SEO */}
                  <div className="flex flex-col items-center text-center p-3 border border-white/5 bg-zinc-900/30 rounded-sm">
                    <Search className="w-4 h-4 mb-2 text-green-500" />
                    <span className="text-2xl font-black font-mono leading-none mb-1 text-green-500">{ex.scores.seo}</span>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">SEO</span>
                  </div>

                </div>
                
                <div className="mt-6 border-t border-white/5 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] text-zinc-500 font-mono uppercase">AI Recommendations</div>
                    <div className="text-[10px] text-[#FF5500] font-mono uppercase bg-[#FF5500]/10 px-2 py-0.5 border border-[#FF5500]/20">Available</div>
                  </div>
                  <div className="mt-3 h-2 w-full bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }} 
                        whileInView={{ width: '100%' }} 
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-transparent to-[#FF5500]"
                     ></motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div variants={itemVariants} className="mt-20 text-center border-t border-white/10 pt-16">
          <h2 className="text-2xl font-bold uppercase mb-4">Want to see your site?</h2>
          <Link href="/" className="inline-flex items-center gap-2 bg-[#FF5500] hover:bg-[#E64C00] text-white font-bold px-8 py-4 transition-colors uppercase tracking-wider text-sm rounded-sm">
            Run Free Audit
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
}
