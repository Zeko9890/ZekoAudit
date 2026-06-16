'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Activity, BrainCircuit, FileDown, ShieldCheck, HelpCircle } from 'lucide-react';

export default function DocsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-24 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase mb-12">
        <ArrowLeft className="h-4 w-4" /> Back to System
      </Link>

      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl font-extrabold tracking-tighter uppercase mb-6 text-white">
          Documentation
        </motion.h1>
        <motion.p variants={itemVariants} className="text-zinc-400 font-light text-lg mb-16 leading-relaxed">
          Learn how ZekoAudit analyzes your web applications, scores performance, and utilizes AI to generate actionable engineering tasks.
        </motion.p>

        {/* Section 1 */}
        <motion.section variants={itemVariants} className="mb-16 border-l-2 border-[#FF5500] pl-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-[#FF5500] w-6 h-6" />
            <h2 className="text-2xl font-bold uppercase tracking-wide">What We Measure</h2>
          </div>
          <p className="text-zinc-400 font-light leading-relaxed mb-4">
            We use the Google Lighthouse core engine to simulate a mid-tier mobile device on a throttled 4G network. This ensures we measure the 90th percentile user experience, not just optimal lab conditions.
          </p>
          <ul className="list-disc pl-5 text-sm text-zinc-500 font-mono space-y-2 marker:text-[#FF5500]">
            <li><span className="text-white">Performance:</span> Core Web Vitals (LCP, FID, CLS).</li>
            <li><span className="text-white">Accessibility:</span> WCAG 2.1 AA compliance, ARIA attributes.</li>
            <li><span className="text-white">Best Practices:</span> HTTPS, image aspect ratios, deprecated APIs.</li>
            <li><span className="text-white">SEO:</span> Meta tags, robots.txt, indexing rules.</li>
          </ul>
        </motion.section>

        {/* Section 2 */}
        <motion.section variants={itemVariants} className="mb-16 border-l-2 border-white/20 pl-6 hover:border-white/50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="text-zinc-300 w-6 h-6" />
            <h2 className="text-2xl font-bold uppercase tracking-wide">Understanding Scores</h2>
          </div>
          <p className="text-zinc-400 font-light leading-relaxed mb-6">
            Scores range from 0 to 100. They are calculated based on log-normal distributions of real-world website performance data.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-zinc-950 border border-green-500/20 p-4 rounded-sm">
              <span className="text-green-500 font-mono font-bold text-xl block mb-2">90 - 100</span>
              <p className="text-xs text-zinc-500 font-mono">OPTIMAL. Top 5% of web experiences.</p>
            </div>
            <div className="bg-zinc-950 border border-orange-500/20 p-4 rounded-sm">
              <span className="text-orange-500 font-mono font-bold text-xl block mb-2">50 - 89</span>
              <p className="text-xs text-zinc-500 font-mono">NEEDS WORK. Average experience, room for optimization.</p>
            </div>
            <div className="bg-zinc-950 border border-red-500/20 p-4 rounded-sm">
              <span className="text-red-500 font-mono font-bold text-xl block mb-2">0 - 49</span>
              <p className="text-xs text-zinc-500 font-mono">CRITICAL. Significant user frustration likely.</p>
            </div>
          </div>
        </motion.section>

        {/* Section 3 */}
        <motion.section variants={itemVariants} className="mb-16 border-l-2 border-[#FF5500] pl-6">
          <div className="flex items-center gap-3 mb-4">
            <BrainCircuit className="text-[#FF5500] w-6 h-6" />
            <h2 className="text-2xl font-bold uppercase tracking-wide">AI Recommendations</h2>
          </div>
          <p className="text-zinc-400 font-light leading-relaxed mb-4">
            Raw Lighthouse JSON is dense. We pipe the diagnostic data into Gemini 2.5 Flash, which is instructed to act as a Staff Web Engineer. It correlates failing metrics to specific DOM nodes or server configurations and outputs actionable fixes rather than generic advice.
          </p>
        </motion.section>

        {/* Section 4 */}
        <motion.section variants={itemVariants} className="mb-16 border-l-2 border-white/20 pl-6 hover:border-white/50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <FileDown className="text-zinc-300 w-6 h-6" />
            <h2 className="text-2xl font-bold uppercase tracking-wide">PDF Reports</h2>
          </div>
          <p className="text-zinc-400 font-light leading-relaxed mb-4">
            Clicking the "Export PDF" button on any audit page generates a client-ready document. The PDF engine uses `@react-pdf/renderer` to dynamically build a multi-page report containing the executive summary, raw scores, and prioritized task list.
          </p>
        </motion.section>

        {/* FAQ Section */}
        <motion.section variants={itemVariants} className="pt-8 border-t border-white/10">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="text-zinc-500 w-6 h-6" />
            <h2 className="text-2xl font-bold uppercase tracking-wide">FAQ</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-white mb-2">Do you store my audit data?</h3>
              <p className="text-sm text-zinc-400 font-light">No. All audits are ephemeral. We proxy the request to PageSpeed, run the AI analysis, and return the result to your browser. Once you close the tab, the data is gone.</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">Why did my score change on a second run?</h3>
              <p className="text-sm text-zinc-400 font-light">Performance can fluctuate based on network latency, third-party script execution (like ads or analytics), and server response times during the exact moment of the audit.</p>
            </div>
          </div>
        </motion.section>

      </motion.div>
    </div>
  );
}
