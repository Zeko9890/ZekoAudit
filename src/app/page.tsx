'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Globe, 
  ArrowRight, 
  Zap, 
  Shield,
  SearchCode,
  Accessibility,
  GitCompareArrows,
  FileText,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
} from 'lucide-react';

const FAQS = [
  {
    question: "How is ZekoAudit different from standard Lighthouse?",
    answer: "While we use the same reliable engine, ZekoAudit layers on AI-driven recommendations, side-by-side comparisons, and professional PDF reporting tailored for agencies and engineers."
  },
  {
    question: "Can I export the audit reports for clients?",
    answer: "Yes, every audit can be exported as a presentation-ready PDF document that you can hand straight to clients, stakeholders, or your engineering team."
  },
  {
    question: "Does it check for Accessibility (A11y)?",
    answer: "Absolutely. We run comprehensive WCAG 2.1 AA checks including contrast ratios, semantic HTML, and keyboard navigability."
  },
  {
    question: "How does the comparison feature work?",
    answer: "You can input two different URLs (e.g., your site vs a competitor) and we will generate a side-by-side benchmark showing where you win and where you lose."
  }
];

export default function Home() {
  const [url, setUrl] = useState('');
  const [urlB, setUrlB] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'single' | 'compare'>('single');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const router = useRouter();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please enter a valid website URL');
      return;
    }
    router.push(`/audit?url=${encodeURIComponent(trimmed.toLowerCase())}`);
  };

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    const a = url.trim();
    const b = urlB.trim();
    if (!a || !b) {
      setError('Please enter both website URLs');
      return;
    }
    if (a.toLowerCase() === b.toLowerCase()) {
      setError('Please enter two different URLs');
      return;
    }
    router.push(`/compare?a=${encodeURIComponent(a.toLowerCase())}&b=${encodeURIComponent(b.toLowerCase())}`);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="relative isolate flex flex-col items-center w-full bg-black overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF5500]/5 rounded-full blur-[120px] pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3"></div>

      {/* Asymmetric Hero Section */}
      <section id="analyze" className="w-full max-w-7xl px-4 pt-24 pb-32 sm:px-6 lg:px-8 sm:pt-32">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
          
          {/* Left: Huge Title, asymmetric positioning */}
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer} 
            className="w-full lg:w-7/12 pt-8"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center space-x-2 border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] sm:text-xs text-zinc-300 mb-8 uppercase tracking-widest font-mono backdrop-blur-sm rounded-sm">
              <span className="w-2 h-2 bg-[#FF5500] animate-pulse rounded-full"></span>
              <span>Engineering-Grade Web Audits</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter text-white leading-[1.05] mb-8">
              PRECISION <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5500] to-orange-400">AUDITS.</span><br/>
              MAXIMUM<br/>
              VELOCITY.
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg sm:text-xl text-zinc-400 font-light mb-10 max-w-md leading-relaxed border-l-2 border-white/10 pl-6">
              Professional audits powered by Google PageSpeed Insights. Actionable AI insights, automated PDF reporting, and competitor benchmarking.
            </motion.p>
          </motion.div>

          {/* Right: Floating Interactive Card */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-5/12 relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-b from-[#FF5500]/20 to-transparent blur-2xl opacity-50 -z-10 rounded-full"></div>
            <motion.div 
              whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(255, 85, 0, 0.15)" }}
              className="bg-zinc-950 border border-white/10 p-8 sm:p-10 rounded-sm shadow-2xl relative overflow-hidden"
            >
              {/* Subtle grid bg inside card */}
              <div className="absolute inset-0 grid-bg-sharp opacity-20 pointer-events-none"></div>

              {/* Tabs */}
              <div className="flex items-center gap-6 border-b border-white/10 mb-8 pb-4 relative z-10">
                <button
                  onClick={() => { setMode('single'); setError(''); }}
                  className={`text-xs font-mono uppercase tracking-widest transition-colors flex items-center gap-2 ${
                    mode === 'single' ? 'text-[#FF5500] font-bold' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  <Globe className="h-4 w-4" /> Single Audit
                </button>
                <button
                  onClick={() => { setMode('compare'); setError(''); }}
                  className={`text-xs font-mono uppercase tracking-widest transition-colors flex items-center gap-2 ${
                    mode === 'compare' ? 'text-[#FF5500] font-bold' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  <GitCompareArrows className="h-4 w-4" /> Compare
                </button>
              </div>

              {/* Forms */}
              <div className="relative z-10 min-h-[220px]">
                {mode === 'single' && (
                  <motion.form 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleAnalyze} className="space-y-6"
                  >
                    <div>
                      <label htmlFor="url-input" className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Target URL</label>
                      <div className="flex items-center px-4 gap-3 bg-black border border-white/10 focus-within:border-[#FF5500]/50 transition-colors rounded-sm">
                        <Globe className="h-5 w-5 text-zinc-600" />
                        <input
                          id="url-input"
                          type="text"
                          value={url}
                          onChange={(e) => { setUrl(e.target.value); if (error) setError(''); }}
                          placeholder="e.g., stripe.com"
                          className="w-full bg-transparent py-4 text-white placeholder-zinc-700 focus:outline-none text-base font-mono"
                        />
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-[#FF5500] hover:bg-[#E64C00] text-white font-bold px-8 py-4 uppercase tracking-wider text-sm rounded-sm"
                    >
                      Run Diagnostics <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </motion.form>
                )}

                {mode === 'compare' && (
                  <motion.form 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleCompare} className="space-y-5"
                  >
                    <div>
                      <div className="flex items-center px-4 gap-3 bg-black border border-white/10 focus-within:border-[#FF5500]/50 transition-colors rounded-sm">
                        <span className="text-[10px] font-mono text-zinc-500 w-4">A</span>
                        <input
                          type="text" value={url} onChange={(e) => { setUrl(e.target.value); if (error) setError(''); }}
                          placeholder="e.g., stripe.com" className="w-full bg-transparent py-3 text-white placeholder-zinc-700 focus:outline-none text-sm font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center px-4 gap-3 bg-black border border-white/10 focus-within:border-[#FF5500]/50 transition-colors rounded-sm mt-2">
                        <span className="text-[10px] font-mono text-zinc-500 w-4">B</span>
                        <input
                          type="text" value={urlB} onChange={(e) => { setUrlB(e.target.value); if (error) setError(''); }}
                          placeholder="e.g., linear.app" className="w-full bg-transparent py-3 text-white placeholder-zinc-700 focus:outline-none text-sm font-mono"
                        />
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-[#FF5500] hover:bg-[#E64C00] text-white font-bold px-8 py-4 uppercase tracking-wider text-sm mt-6 rounded-sm"
                    >
                      <GitCompareArrows className="h-4 w-4" /> Execute Comparison
                    </motion.button>
                  </motion.form>
                )}

                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -bottom-8 left-0 text-sm text-[#FF5500] font-mono flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF5500]"></span> {error}
                  </motion.p>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Asymmetric Workflow Section */}
      <section id="how-it-works" className="w-full bg-zinc-950 py-32 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="mb-20 pl-4 border-l-4 border-[#FF5500]"
          >
            <h2 className="text-xs text-zinc-500 font-mono uppercase tracking-widest mb-2">Workflow Engine</h2>
            <h3 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
              From URL to Actionable<br/>Insights in Seconds
            </h3>
          </motion.div>

          {/* Staggered diagonal layout for steps */}
          <div className="relative">
             {/* Decorative diagonal line for desktop */}
             <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-[5deg] origin-left pointer-events-none"></div>
             
             <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4 lg:gap-8">
               {[
                 { step: '01', title: 'Target', desc: 'Enter any public URL. No authentication required.', icon: Globe, offset: 'md:mt-0' },
                 { step: '02', title: 'Process', desc: 'Our engine runs a real-time Lighthouse diagnostic.', icon: Cpu, offset: 'md:mt-12' },
                 { step: '03', title: 'Analyze', desc: 'AI reviews the metrics to generate human-readable fixes.', icon: Sparkles, offset: 'md:mt-24' },
                 { step: '04', title: 'Export', desc: 'Download a clean PDF report to share with your team.', icon: FileText, offset: 'md:mt-36' },
               ].map((item, idx) => (
                 <motion.div 
                   key={idx}
                   initial={{ opacity: 0, y: 50 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.6, delay: idx * 0.15 }}
                   className={`relative group flex flex-col ${item.offset}`}
                 >
                   <div className="w-16 h-16 rounded-sm bg-black border border-white/10 flex items-center justify-center mb-6 group-hover:border-[#FF5500] group-hover:bg-[#FF5500]/5 transition-colors shadow-2xl relative z-10">
                     <item.icon className="w-6 h-6 text-zinc-400 group-hover:text-[#FF5500] transition-colors" />
                   </div>
                   <div className="text-[10px] font-mono text-[#FF5500] mb-3">STEP {item.step}</div>
                   <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                   <p className="text-sm text-zinc-400 font-light leading-relaxed max-w-[200px]">{item.desc}</p>
                 </motion.div>
               ))}
             </div>
          </div>
        </div>
      </section>

      {/* Features Asymmetric Split */}
      <section id="features" className="w-full max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="lg:w-1/3 sticky top-32"
          >
            <h2 className="text-xs text-zinc-500 font-mono uppercase tracking-widest mb-4">
              / CORE VECTORS
            </h2>
            <h3 className="text-4xl font-extrabold text-white tracking-tight mb-6">
              Deep Inspection Metrics
            </h3>
            <p className="text-zinc-400 font-light leading-relaxed mb-8 border-l-2 border-[#FF5500] pl-4">
              Our platform utilizes a multi-threaded approach to extract, analyze, and validate over 100 specific metrics mapped to current web standards.
            </p>
            <div className="hidden lg:block w-full h-48 bg-zinc-950 border border-white/5 rounded-sm relative overflow-hidden mt-12 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-black to-zinc-900/50"></div>
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -right-12 -bottom-12 w-48 h-48 border border-white/10 rounded-full border-dashed"
              ></motion.div>
              <div className="absolute top-6 left-6 text-[#FF5500]">
                 <SearchCode className="w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </motion.div>
          
          <div className="lg:w-2/3 w-full">
            <div className="grid grid-cols-1 gap-6">
              {[
                { icon: Zap, title: 'Performance Core', desc: 'Measures the loading speed and visual responsiveness via Lighthouse Core Web Vitals analysis.', tags: ['LCP', 'FID', 'CLS'] },
                { icon: SearchCode, title: 'Search Analytics', desc: 'Verifies whether your page is correctly configured to be indexed by major search engines.', tags: ['Meta Tags', 'Robots.txt', 'Structured Data'] },
                { icon: Accessibility, title: 'A11y Compliance', desc: 'Evaluates screen reader support, keyboard navigability, and visual readability (WCAG 2.1 AA).', tags: ['Contrast', 'ARIA Attributes', 'Navigation'] },
                { icon: Shield, title: 'Best Practices', desc: 'Assesses security protocols, network transmission standards, and code delivery safety.', tags: ['HTTPS', 'CSP', 'Trust & Safety'] },
              ].map((spec, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.03)" }}
                  className="p-8 border border-white/10 bg-black rounded-sm group transition-all relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF5500] scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="w-12 h-12 rounded-sm bg-zinc-900/50 flex items-center justify-center shrink-0">
                       <spec.icon className="h-5 w-5 text-[#FF5500]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-wide mb-3">{spec.title}</h3>
                      <p className="text-sm text-zinc-400 font-light mb-5 leading-relaxed">{spec.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {spec.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-mono text-zinc-500 bg-black border border-white/10 px-2.5 py-1 uppercase rounded-sm">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Asymmetric Block */}
      <section id="why" className="w-full bg-zinc-950 py-32 border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
           
           <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
             
             {/* Image/Abstract block spans 5 cols */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
               whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="md:col-span-5 relative h-[500px] border border-white/10 bg-black p-8 flex flex-col justify-between group"
             >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF5500]/5 to-transparent"></div>
                <div className="relative z-10 flex justify-between">
                  <div className="w-16 h-1 bg-white/20"></div>
                  <div className="w-16 h-1 bg-white/20"></div>
                </div>
                
                <div className="relative z-10 grid grid-cols-2 gap-4">
                  <motion.div whileHover={{ y: -5 }} className="bg-zinc-900 border border-white/5 p-4 shadow-xl">
                    <div className="text-xs text-zinc-500 font-mono mb-2">RAW JSON</div>
                    <div className="space-y-1 opacity-30">
                       <div className="h-2 w-full bg-white rounded-full"></div>
                       <div className="h-2 w-2/3 bg-white rounded-full"></div>
                       <div className="h-2 w-4/5 bg-white rounded-full"></div>
                       <div className="h-2 w-1/2 bg-white rounded-full"></div>
                    </div>
                  </motion.div>
                  <motion.div whileHover={{ y: -5 }} className="bg-[#FF5500]/10 border border-[#FF5500]/30 p-4 shadow-xl translate-y-6">
                    <div className="text-xs text-[#FF5500] font-mono mb-2 flex justify-between"><span>AI OUTPUT</span><Sparkles className="w-3 h-3"/></div>
                    <p className="text-[9px] text-white font-mono leading-relaxed">Fix: Defer offscreen images in hero section. Expected impact: -1.2s LCP.</p>
                  </motion.div>
                </div>
                
                <div className="relative z-10 flex justify-between items-end">
                  <div className="w-8 h-8 rounded-full border border-white/20"></div>
                  <div className="text-4xl font-black text-white/5 group-hover:text-white/10 transition-colors">010</div>
                </div>
             </motion.div>

             {/* Text block spans 7 cols, offset to the right */}
             <motion.div 
               initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
               className="md:col-span-7 md:pl-12 lg:pl-20"
             >
                <motion.h3 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-8 leading-[1.1]">
                  Stop guessing what <br/>Lighthouse scores mean.
                </motion.h3>
                <motion.p variants={fadeUp} className="text-zinc-400 font-light text-lg mb-12 leading-relaxed max-w-xl">
                  Raw performance data is only useful if you know how to fix it. ZekoAudit bridges the gap between complex diagnostic output and actionable engineering tasks.
                </motion.p>
                
                <div className="space-y-8">
                  {[
                    { title: 'AI-Powered Recommendations', desc: 'Get specific, context-aware suggestions on how to improve your metrics.' },
                    { title: 'Executive Summaries', desc: 'Generate reports that make sense to non-technical stakeholders.' },
                    { title: 'Historical Benchmarking', desc: 'Compare your site against competitors to see exactly where you stand.' }
                  ].map((item, idx) => (
                    <motion.div variants={fadeUp} key={idx} className="flex items-start gap-5">
                      <div className="mt-1 bg-white/5 border border-white/10 w-8 h-8 rounded-sm flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-[#FF5500]" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-2 text-lg">{item.title}</h4>
                        <p className="text-sm text-zinc-500 font-light">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
             </motion.div>
             
           </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="w-full max-w-4xl mx-auto px-4 py-32 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
          <h2 className="text-xs text-zinc-500 font-mono uppercase tracking-widest mb-4">Support</h2>
          <h3 className="text-4xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h3>
        </motion.div>
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={idx} 
              className="bg-zinc-950 border border-white/10 rounded-sm overflow-hidden"
            >
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-lg font-bold text-white">{faq.question}</span>
                <motion.div animate={{ rotate: openFaq === idx ? 180 : 0 }}>
                  <ChevronDown className="w-5 h-5 text-zinc-500" />
                </motion.div>
              </button>
              <motion.div 
                initial={false}
                animate={{ height: openFaq === idx ? 'auto' : 0, opacity: openFaq === idx ? 1 : 0 }}
                className="overflow-hidden bg-black"
              >
                <div className="p-6 pt-0 text-zinc-400 font-light leading-relaxed border-t border-white/5 mt-2">
                  {faq.answer}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full max-w-5xl mx-auto px-4 py-24 sm:px-6 lg:px-8 mb-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-sm p-16 sm:p-24 text-center overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-[#FF5500]/20 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-8">
              Ready to optimize?
            </h2>
            <p className="text-xl text-zinc-400 font-light max-w-2xl mx-auto mb-12">
              Stop losing users to slow load times and poor accessibility. Run a free audit today and get actionable engineering tasks instantly.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setMode('single'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="inline-flex items-center justify-center gap-2 bg-[#FF5500] hover:bg-[#E64C00] text-white font-bold px-12 py-6 uppercase tracking-wider text-sm rounded-sm shadow-[0_0_40px_rgba(255,85,0,0.3)]"
            >
              Start Free Audit Now
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
