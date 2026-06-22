'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Zap, ShieldCheck, Search, Accessibility } from 'lucide-react';

const EXAMPLES = [
  {
    id: 'stripe',
    name: 'Stripe',
    url: 'stripe.com',
    sector: 'Payment Infrastructure',
    scores: { perf: 92, a11y: 98, best: 100, seo: 100 }
  },
  {
    id: 'vercel',
    name: 'Vercel',
    url: 'vercel.com',
    sector: 'Deployment Platform',
    scores: { perf: 96, a11y: 100, best: 100, seo: 100 }
  },
  {
    id: 'github',
    name: 'GitHub',
    url: 'github.com',
    sector: 'Code Hosting',
    scores: { perf: 81, a11y: 94, best: 92, seo: 90 }
  },
  {
    id: 'linear',
    name: 'Linear',
    url: 'linear.app',
    sector: 'Product Engineering',
    scores: { perf: 98, a11y: 100, best: 100, seo: 100 }
  }
];

function getScoreColor(score: number) {
  if (score >= 90) return 'text-[#00E66A]';
  if (score >= 50) return 'text-amber-400';
  return 'text-red-400';
}

export default function ExamplesPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white px-4 py-24 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-white transition-colors mb-12">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={itemVariants} className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00E66A]/5 border border-[#00E66A]/20 rounded-full mb-6">
            <span className="text-[11px] font-semibold text-[#00E66A] uppercase tracking-wider">Live Examples</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-white">
            Example Audits
          </h1>
          <p className="text-[#9CA3AF] text-lg leading-relaxed">
            Explore live snapshots of industry leaders. See how top-tier engineering teams score on core web vitals and accessibility standards.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EXAMPLES.map((ex) => (
            <motion.div 
              key={ex.id}
              variants={itemVariants}
              className="bg-[#0A0A0A] border border-white/[0.06] p-6 sm:p-8 rounded-2xl relative overflow-hidden group hover:border-[#00E66A]/20 transition-all hover:-translate-y-1"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-[#00E66A]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10 flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-xl font-bold text-white">{ex.name}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-zinc-500">{ex.url}</span>
                    <span className="text-[10px] border border-white/10 px-2 py-0.5 rounded text-zinc-500">{ex.sector}</span>
                  </div>
                </div>
                <Link 
                  href={`/audit?url=${encodeURIComponent(ex.url)}`}
                  className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 hover:bg-[#00E66A] hover:text-black text-zinc-400 transition-all"
                  title={`Run real audit for ${ex.name}`}
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              {/* Score Grid */}
              <div className="bg-[#050505] border border-white/[0.04] rounded-xl p-4 sm:p-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center text-center p-3 border border-white/[0.04] bg-[#0A0A0A] rounded-lg">
                    <Zap className={`w-4 h-4 mb-2 ${getScoreColor(ex.scores.perf)}`} />
                    <span className={`text-2xl font-bold leading-none mb-1 ${getScoreColor(ex.scores.perf)}`}>{ex.scores.perf}</span>
                    <span className="text-[9px] text-zinc-600 uppercase tracking-widest">Perf</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 border border-white/[0.04] bg-[#0A0A0A] rounded-lg">
                    <Accessibility className="w-4 h-4 mb-2 text-[#00E66A]" />
                    <span className="text-2xl font-bold leading-none mb-1 text-[#00E66A]">{ex.scores.a11y}</span>
                    <span className="text-[9px] text-zinc-600 uppercase tracking-widest">A11y</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 border border-white/[0.04] bg-[#0A0A0A] rounded-lg">
                    <ShieldCheck className="w-4 h-4 mb-2 text-[#00E66A]" />
                    <span className="text-2xl font-bold leading-none mb-1 text-[#00E66A]">{ex.scores.best}</span>
                    <span className="text-[9px] text-zinc-600 uppercase tracking-widest">Best</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 border border-white/[0.04] bg-[#0A0A0A] rounded-lg">
                    <Search className="w-4 h-4 mb-2 text-[#00E66A]" />
                    <span className="text-2xl font-bold leading-none mb-1 text-[#00E66A]">{ex.scores.seo}</span>
                    <span className="text-[9px] text-zinc-600 uppercase tracking-widest">SEO</span>
                  </div>
                </div>
                
                <div className="mt-4 border-t border-white/[0.04] pt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] text-zinc-600 uppercase tracking-widest">AI Recommendations</div>
                    <div className="text-[11px] text-[#00E66A] bg-[#00E66A]/5 border border-[#00E66A]/20 px-2 py-0.5 rounded uppercase tracking-widest">Available</div>
                  </div>
                  <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      whileInView={{ width: '100%' }} 
                      transition={{ duration: 1, delay: 0.4 }}
                      className="h-full bg-gradient-to-r from-[#00E66A]/20 to-[#00E66A]"
                    ></motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div variants={itemVariants} className="mt-20 text-center border-t border-white/[0.06] pt-16">
          <h2 className="text-2xl font-bold mb-2 text-white">Want to see your site?</h2>
          <p className="text-[#9CA3AF] mb-8">Run a free audit in seconds — no login required.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-[#00E66A] hover:bg-[#00c55a] text-black font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,230,106,0.15)] hover:shadow-[0_0_30px_rgba(0,230,106,0.3)] text-sm">
            Run Free Audit
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
}
