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
    <div className="min-h-screen bg-[#050505] text-white px-4 py-24 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-white transition-colors mb-12">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-white">
          Documentation
        </motion.h1>
        <motion.p variants={itemVariants} className="text-[#9CA3AF] text-lg mb-16 leading-relaxed max-w-2xl">
          Learn how ZekoAudit analyzes your web applications, scores performance, and utilizes AI to generate actionable engineering tasks.
        </motion.p>

        {/* Section 1 */}
        <motion.section variants={itemVariants} className="mb-12 border-l-2 border-[#00E66A] pl-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-[#00E66A] w-5 h-5" />
            <h2 className="text-xl font-bold">What We Measure</h2>
          </div>
          <p className="text-[#9CA3AF] leading-relaxed mb-4">
            We use the Google Lighthouse core engine to simulate a mid-tier mobile device on a throttled 4G network. This ensures we measure the 90th percentile user experience, not just optimal lab conditions.
          </p>
          <ul className="list-disc pl-5 text-sm text-zinc-500 space-y-2 marker:text-[#00E66A]">
            <li><span className="text-white">Performance:</span> Core Web Vitals (LCP, FID, CLS).</li>
            <li><span className="text-white">Accessibility:</span> WCAG 2.1 AA compliance, ARIA attributes.</li>
            <li><span className="text-white">Best Practices:</span> HTTPS, image aspect ratios, deprecated APIs.</li>
            <li><span className="text-white">SEO:</span> Meta tags, robots.txt, indexing rules.</li>
          </ul>
        </motion.section>

        {/* Section 2 */}
        <motion.section variants={itemVariants} className="mb-12 border-l-2 border-white/10 pl-6 hover:border-white/20 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="text-zinc-400 w-5 h-5" />
            <h2 className="text-xl font-bold">Understanding Scores</h2>
          </div>
          <p className="text-[#9CA3AF] leading-relaxed mb-6">
            Scores range from 0 to 100. They are calculated based on log-normal distributions of real-world website performance data.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0A0A0A] border border-[#00E66A]/20 p-4 rounded-xl">
              <span className="text-[#00E66A] font-bold text-xl block mb-2">90 – 100</span>
              <p className="text-xs text-zinc-500">OPTIMAL. Top 5% of web experiences.</p>
            </div>
            <div className="bg-[#0A0A0A] border border-amber-400/20 p-4 rounded-xl">
              <span className="text-amber-400 font-bold text-xl block mb-2">50 – 89</span>
              <p className="text-xs text-zinc-500">NEEDS WORK. Average experience, room for optimization.</p>
            </div>
            <div className="bg-[#0A0A0A] border border-red-500/20 p-4 rounded-xl">
              <span className="text-red-500 font-bold text-xl block mb-2">0 – 49</span>
              <p className="text-xs text-zinc-500">CRITICAL. Significant user frustration likely.</p>
            </div>
          </div>
        </motion.section>

        {/* Section 3 */}
        <motion.section variants={itemVariants} className="mb-12 border-l-2 border-[#00E66A] pl-6">
          <div className="flex items-center gap-3 mb-4">
            <BrainCircuit className="text-[#00E66A] w-5 h-5" />
            <h2 className="text-xl font-bold">AI Recommendations</h2>
          </div>
          <p className="text-[#9CA3AF] leading-relaxed">
            Raw Lighthouse JSON is dense. We pipe the diagnostic data into Gemini 2.5 Flash, which is instructed to act as a Staff Web Engineer. It correlates failing metrics to specific DOM nodes or server configurations and outputs actionable fixes rather than generic advice.
          </p>
        </motion.section>

        {/* Section 4 */}
        <motion.section variants={itemVariants} className="mb-12 border-l-2 border-white/10 pl-6 hover:border-white/20 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <FileDown className="text-zinc-400 w-5 h-5" />
            <h2 className="text-xl font-bold">PDF Reports</h2>
          </div>
          <p className="text-[#9CA3AF] leading-relaxed">
            Clicking the &quot;Export PDF&quot; button on any audit page generates a client-ready document. The PDF engine uses <code className="text-[#00E66A] bg-[#00E66A]/10 px-1.5 py-0.5 rounded text-sm">@react-pdf/renderer</code> to dynamically build a multi-page report containing the executive summary, raw scores, and prioritized task list.
          </p>
        </motion.section>

        {/* FAQ Section */}
        <motion.section variants={itemVariants} className="pt-8 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="text-zinc-500 w-5 h-5" />
            <h2 className="text-xl font-bold">FAQ</h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-[#0A0A0A] border border-white/[0.06] p-5 rounded-xl">
              <h3 className="font-semibold text-white mb-2">Do you store my audit data?</h3>
              <p className="text-sm text-[#9CA3AF] leading-relaxed">No. All audits are ephemeral. We proxy the request to PageSpeed, run the AI analysis, and return the result to your browser. Once you close the tab, the data is gone.</p>
            </div>
            <div className="bg-[#0A0A0A] border border-white/[0.06] p-5 rounded-xl">
              <h3 className="font-semibold text-white mb-2">Why did my score change on a second run?</h3>
              <p className="text-sm text-[#9CA3AF] leading-relaxed">Performance can fluctuate based on network latency, third-party script execution (like ads or analytics), and server response times during the exact moment of the audit.</p>
            </div>
          </div>
        </motion.section>

      </motion.div>
    </div>
  );
}
