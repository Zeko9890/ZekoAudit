'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Zap,
  ShieldCheck,
  FileText,
  Download,
  Image as ImageIcon,
  GitCompareArrows,
  Accessibility
} from 'lucide-react';

// ─── Animation Variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const, delay }
  })
};

const staggerChildren = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-[#00E66A]/30 selection:text-[#00E66A] overflow-hidden">
      
      {/* Background Texture & Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Faint grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        {/* Subtle top-right glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00E66A]/10 rounded-full blur-[150px] opacity-60"></div>
        {/* Subtle center-left glow */}
        <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-[#00E66A]/5 rounded-full blur-[150px] opacity-50"></div>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 w-full max-w-[1200px] mx-auto px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Copy */}
          <div className="flex flex-col items-start z-10">
            <motion.div 
              initial="hidden" animate="visible" custom={0} variants={fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1 bg-[#00E66A]/5 border border-[#00E66A]/20 rounded-full mb-6 shadow-[0_0_15px_rgba(0,230,106,0.05)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00E66A]" />
              <span className="text-[11px] font-semibold tracking-wider text-[#00E66A] uppercase">AI-Powered Website Analysis</span>
            </motion.div>
            
            <motion.h1 
              initial="hidden" animate="visible" custom={0.1} variants={fadeUp}
              className="text-5xl lg:text-7xl font-extrabold text-white tracking-tighter leading-[1.05] mb-6"
            >
              Audit. Optimize.<br/>Ship with <span className="text-[#00E66A]">Confidence.</span>
            </motion.h1>
            
            <motion.p 
              initial="hidden" animate="visible" custom={0.2} variants={fadeUp}
              className="text-lg text-[#9CA3AF] max-w-lg mb-10 leading-relaxed font-light"
            >
              Run Lighthouse diagnostics, AI-powered analysis, visual audits, competitor benchmarking, and generate professional PDF reports in seconds.
            </motion.p>
            
            <motion.div 
              initial="hidden" animate="visible" custom={0.3} variants={fadeUp}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10"
            >
              <Link
                href="/audit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#00E66A] hover:bg-[#00c55a] text-black px-8 py-3.5 rounded-md font-bold transition-all duration-300 shadow-[0_0_25px_rgba(0,230,106,0.25)] hover:shadow-[0_0_35px_rgba(0,230,106,0.4)]"
              >
                Run Free Audit <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/examples"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent hover:bg-white/5 border border-white/20 text-white px-8 py-3.5 rounded-md font-semibold transition-all duration-300"
              >
                View Sample Report
              </Link>
            </motion.div>

            {/* Checkmarks */}
            <motion.div 
              initial="hidden" animate="visible" custom={0.4} variants={fadeUp}
              className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] font-medium text-[#9CA3AF]"
            >
              {['Instant Results', 'PDF Reports', 'Visual Audit', 'Privacy Focused'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00E66A]" /> {item}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Premium Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
            className="w-full relative z-10 lg:ml-8"
          >
            {/* The Glass Mockup Container */}
            <div className="bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative group hover:border-[#00E66A]/20 transition-colors duration-500">
              
              {/* Inner ambient glow behind the mockup */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#00E66A]/10 rounded-full blur-[100px] pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60" />

              {/* Mockup Header (Window controls) */}
              <div className="flex items-center px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
              </div>

              {/* Mockup Body */}
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div>
                    <div className="text-[#9CA3AF] text-[13px] font-medium mb-1">Overall Score</div>
                    <div className="text-5xl font-bold text-[#00E66A] font-mono tracking-tighter drop-shadow-[0_0_15px_rgba(0,230,106,0.3)]">98</div>
                    <div className="text-[11px] text-[#00E66A] font-semibold mt-1 tracking-wider uppercase">Excellent</div>
                  </div>
                </div>

                {/* Radar / Circular UI */}
                <div className="relative w-full flex items-center justify-center py-6 mb-8">
                  {/* Concentric Rings */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <svg width="280" height="280" viewBox="0 0 280 280" className="opacity-20">
                       <circle cx="140" cy="140" r="90" stroke="white" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                       <circle cx="140" cy="140" r="130" stroke="white" strokeWidth="1" strokeDasharray="2 6" fill="none" />
                     </svg>
                  </div>

                  {/* Pulsing Shield Center */}
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative flex items-center justify-center w-28 h-28 rounded-full border-2 border-[#00E66A]/60 shadow-[0_0_40px_rgba(0,230,106,0.2)] z-10 bg-black/60 backdrop-blur-md"
                  >
                    <div className="absolute inset-0 rounded-full border border-[#00E66A]/30 animate-ping" style={{ animationDuration: '3s' }}></div>
                    <ActivityIcon className="w-10 h-10 text-[#00E66A]" />
                  </motion.div>

                  {/* Floating Metrics */}
                  <div className="absolute top-[10%] left-[10%] text-center">
                    <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-semibold mb-0.5">Performance</div>
                    <div className="text-xl font-bold text-[#00E66A] font-mono">98</div>
                  </div>
                  <div className="absolute top-[15%] right-[5%] text-center">
                    <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-semibold mb-0.5">Accessibility</div>
                    <div className="text-xl font-bold text-[#00E66A] font-mono">100</div>
                  </div>
                  <div className="absolute bottom-[15%] left-[5%] text-center">
                    <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-semibold mb-0.5">Best Practices</div>
                    <div className="text-xl font-bold text-[#00E66A] font-mono">100</div>
                  </div>
                  <div className="absolute bottom-[10%] right-[10%] text-center">
                    <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-semibold mb-0.5">SEO</div>
                    <div className="text-xl font-bold text-[#00E66A] font-mono">92</div>
                  </div>
                </div>

                {/* Bottom Bar inside Mockup */}
                <div className="bg-[#050505] border border-white/10 rounded-lg p-3.5 flex items-center justify-between gap-4 relative z-10 shadow-inner">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#9CA3AF] font-medium mb-1">Generated Report</span>
                    <div className="flex items-center gap-2 text-xs text-white">
                      <FileText className="w-3.5 h-3.5 text-[#00E66A]" /> zeko.dev-audit-report.pdf
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded transition-colors cursor-pointer">
                    Download PDF <Download className="w-3 h-3" />
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── LOGOS SECTION ── */}
      <section className="w-full border-y border-white/[0.04] py-12 relative z-10 bg-black/40">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col items-center">
          <div className="text-[11px] text-[#9CA3AF] font-semibold mb-8 uppercase tracking-widest text-center">
            Trusted by developers and teams
          </div>
          
          {/* Centered Logo Viewport (~3 logos wide) */}
          <div className="w-full max-w-3xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            {/* Ambient Marquee with opacity breathing */}
            <div className="flex w-max animate-ambient-marquee hover:[animation-play-state:paused] opacity-60">
              <div className="flex w-max animate-ambient-pulse">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-10 md:gap-16 px-5 md:px-8">
                    <div className="font-bold text-xl flex items-center tracking-tighter text-white">Next.js</div>
                    <div className="font-bold text-xl flex items-center gap-1.5 text-white">⚛ React</div>
                    <div className="font-bold text-xl flex items-center tracking-tight text-white">▲ Vercel</div>
                    <div className="font-bold text-xl flex items-center tracking-tight text-white">🔥 Firebase</div>
                    <div className="font-bold text-xl flex items-center tracking-tight text-white">⬢ Node.js</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" className="relative z-10 w-full max-w-[1200px] mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Everything you need in one audit</h2>
          <p className="text-[#9CA3AF] text-sm md:text-base max-w-2xl mx-auto">Comprehensive analysis. Actionable insights. Real impact.</p>
        </div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={staggerChildren}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {/* Feature 1 */}
          <motion.div variants={fadeUp} className="bg-[#0A0A0A]/60 backdrop-blur-sm border border-white/[0.05] p-6 rounded-xl hover:border-[#00E66A]/20 transition-all duration-300 group hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(0,230,106,0.05)]">
            <div className="w-10 h-10 bg-white/5 group-hover:bg-[#00E66A]/10 rounded-lg flex items-center justify-center mb-5 border border-white/5 group-hover:border-[#00E66A]/20 transition-colors">
              <Zap className="w-5 h-5 text-white group-hover:text-[#00E66A] transition-colors" />
            </div>
            <h3 className="text-white font-semibold text-[15px] mb-2">Lighthouse Analysis</h3>
            <p className="text-[#9CA3AF] text-[13px] leading-relaxed">Get instant results using the industry-standard engine for Performance, SEO, and Best Practices.</p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div variants={fadeUp} className="bg-[#0A0A0A]/60 backdrop-blur-sm border border-white/[0.05] p-6 rounded-xl hover:border-[#00E66A]/20 transition-all duration-300 group hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(0,230,106,0.05)]">
            <div className="w-10 h-10 bg-white/5 group-hover:bg-[#00E66A]/10 rounded-lg flex items-center justify-center mb-5 border border-white/5 group-hover:border-[#00E66A]/20 transition-colors">
              <Sparkles className="w-5 h-5 text-white group-hover:text-[#00E66A] transition-colors" />
            </div>
            <h3 className="text-white font-semibold text-[15px] mb-2">AI Recommendations</h3>
            <p className="text-[#9CA3AF] text-[13px] leading-relaxed">Smart recommendations generated by Gemini tailored to your exact site architecture and stack.</p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div variants={fadeUp} className="bg-[#0A0A0A]/60 backdrop-blur-sm border border-white/[0.05] p-6 rounded-xl hover:border-[#00E66A]/20 transition-all duration-300 group hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(0,230,106,0.05)]">
            <div className="w-10 h-10 bg-white/5 group-hover:bg-[#00E66A]/10 rounded-lg flex items-center justify-center mb-5 border border-white/5 group-hover:border-[#00E66A]/20 transition-colors">
              <ImageIcon className="w-5 h-5 text-white group-hover:text-[#00E66A] transition-colors" />
            </div>
            <h3 className="text-white font-semibold text-[15px] mb-2">Visual Audit Screenshots</h3>
            <p className="text-[#9CA3AF] text-[13px] leading-relaxed">Automatic generation of full-page desktop and mobile layouts for visual verification.</p>
          </motion.div>

          {/* Feature 4 */}
          <motion.div variants={fadeUp} className="bg-[#0A0A0A]/60 backdrop-blur-sm border border-white/[0.05] p-6 rounded-xl hover:border-[#00E66A]/20 transition-all duration-300 group hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(0,230,106,0.05)]">
            <div className="w-10 h-10 bg-white/5 group-hover:bg-[#00E66A]/10 rounded-lg flex items-center justify-center mb-5 border border-white/5 group-hover:border-[#00E66A]/20 transition-colors">
              <GitCompareArrows className="w-5 h-5 text-white group-hover:text-[#00E66A] transition-colors" />
            </div>
            <h3 className="text-white font-semibold text-[15px] mb-2">Competitor Comparison</h3>
            <p className="text-[#9CA3AF] text-[13px] leading-relaxed">Run side-by-side audits against competitors or compare staging environments against production.</p>
          </motion.div>

          {/* Feature 5 */}
          <motion.div variants={fadeUp} className="bg-[#0A0A0A]/60 backdrop-blur-sm border border-white/[0.05] p-6 rounded-xl hover:border-[#00E66A]/20 transition-all duration-300 group hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(0,230,106,0.05)]">
            <div className="w-10 h-10 bg-white/5 group-hover:bg-[#00E66A]/10 rounded-lg flex items-center justify-center mb-5 border border-white/5 group-hover:border-[#00E66A]/20 transition-colors">
              <FileText className="w-5 h-5 text-white group-hover:text-[#00E66A] transition-colors" />
            </div>
            <h3 className="text-white font-semibold text-[15px] mb-2">PDF Reports</h3>
            <p className="text-[#9CA3AF] text-[13px] leading-relaxed">Download professional, client-ready PDF reports highlighting key metrics and technical solutions.</p>
          </motion.div>

          {/* Feature 6 */}
          <motion.div variants={fadeUp} className="bg-[#0A0A0A]/60 backdrop-blur-sm border border-white/[0.05] p-6 rounded-xl hover:border-[#00E66A]/20 transition-all duration-300 group hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(0,230,106,0.05)]">
            <div className="w-10 h-10 bg-white/5 group-hover:bg-[#00E66A]/10 rounded-lg flex items-center justify-center mb-5 border border-white/5 group-hover:border-[#00E66A]/20 transition-colors">
              <Accessibility className="w-5 h-5 text-white group-hover:text-[#00E66A] transition-colors" />
            </div>
            <h3 className="text-white font-semibold text-[15px] mb-2">Accessibility Testing</h3>
            <p className="text-[#9CA3AF] text-[13px] leading-relaxed">Ensure your web apps comply with accessibility guidelines and deliver an inclusive user experience.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* ── REPORT PREVIEW SECTION ── */}
      <section className="relative z-10 w-full border-t border-white/[0.04] bg-[#050505]">
        <div className="max-w-[1200px] mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left: Text */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">Professional Insights.<br/>Actionable Data.</h2>
              <p className="text-[#9CA3AF] text-base leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                Dive deep into the metrics that matter. Our detailed reports break down every performance bottleneck, SEO issue, and accessibility flaw into clear, engineering-grade tasks.
              </p>
              <div className="flex flex-col gap-4 max-w-md mx-auto lg:mx-0">
                <div className="flex items-center gap-3 text-sm text-[#9CA3AF]">
                  <CheckCircle2 className="w-5 h-5 text-[#00E66A]" /> Complete score breakdown by category
                </div>
                <div className="flex items-center gap-3 text-sm text-[#9CA3AF]">
                  <CheckCircle2 className="w-5 h-5 text-[#00E66A]" /> AI-generated recommendation cards
                </div>
                <div className="flex items-center gap-3 text-sm text-[#9CA3AF]">
                  <CheckCircle2 className="w-5 h-5 text-[#00E66A]" /> Executive summary and PDF exports
                </div>
              </div>
            </div>

            {/* Right: Realistic Report Preview Mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="flex-1 w-full relative"
            >
              <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#00E66A]/5 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="border-b border-white/5 bg-white/[0.02] px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/10">
                      <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">example.com</div>
                      <div className="text-[10px] text-[#9CA3AF]">Audited 2 minutes ago</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-[#00E66A]/10 border border-[#00E66A]/20 text-[#00E66A] text-[10px] font-bold uppercase tracking-wider rounded">Excellent</div>
                </div>
                
                <div className="p-6 space-y-6 relative z-10">
                  {/* Score breakdown row */}
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { l: 'Perf', s: 98 }, { l: 'A11y', s: 100 }, { l: 'Best', s: 100 }, { l: 'SEO', s: 92 }
                    ].map(m => (
                      <div key={m.l} className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                        <div className="text-2xl font-bold text-[#00E66A] font-mono">{m.s}</div>
                        <div className="text-[10px] text-[#9CA3AF] uppercase mt-1">{m.l}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* AI Recommendation mock */}
                  <div className="bg-[#050505] border border-white/5 rounded-lg p-4">
                     <div className="flex items-center justify-between mb-3">
                       <span className="text-[11px] font-semibold text-white uppercase tracking-wide">Top Recommendation</span>
                       <span className="text-[10px] font-medium text-red-400 bg-red-400/10 px-2 py-0.5 rounded">High Impact</span>
                     </div>
                     <h4 className="text-sm font-semibold text-white mb-1">Defer unused CSS</h4>
                     <p className="text-xs text-[#9CA3AF] leading-relaxed">Split `globals.css` into critical and non-critical paths. Currently 45KB of unused CSS is blocking the initial render.</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
}

// Inline Activity Icon (similar to a pulse)
function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.48 12H2"/>
    </svg>
  );
}
