import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white px-4 pt-32 pb-24 sm:px-6 lg:px-8 max-w-[900px] mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase mb-12">
        <ArrowLeft className="h-4 w-4" /> Back to System
      </Link>
      
      <div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter uppercase mb-6 text-white">
          Product Roadmap
        </h1>
        <p className="text-zinc-400 font-light text-lg leading-relaxed mb-12">
          What we're building next to make ZekoAudit even more powerful.
        </p>

        <div className="border-l-2 border-[#00E66A] pl-6 py-2 space-y-6">
           <div>
             <h3 className="text-xl font-bold mb-2">Q3 2026: Scheduled Audits</h3>
             <p className="text-zinc-400 leading-relaxed text-sm">Automate your reporting. Run daily or weekly checks on your primary domains and receive Slack notifications if scores drop below a certain threshold.</p>
           </div>
           <div>
             <h3 className="text-xl font-bold mb-2">Q4 2026: CI/CD Pipeline Integration</h3>
             <p className="text-zinc-400 leading-relaxed text-sm">Fail builds automatically in GitHub Actions or Vercel if a new commit degrades your core web vitals.</p>
           </div>
           <div>
             <h3 className="text-xl font-bold mb-2">Q1 2027: Multi-Page Spidering</h3>
             <p className="text-zinc-400 leading-relaxed text-sm">Crawl the entire domain map to audit every route, not just the single URL provided.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
