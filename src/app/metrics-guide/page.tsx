import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function MetricsGuidePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white px-4 pt-32 pb-24 sm:px-6 lg:px-8 max-w-[900px] mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase mb-12">
        <ArrowLeft className="h-4 w-4" /> Back to System
      </Link>
      
      <div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter uppercase mb-6 text-white">
          Core Metrics Guide
        </h1>
        <p className="text-zinc-400 font-light text-lg leading-relaxed mb-12">
          An overview of the Google Lighthouse scoring metrics and Web Vitals evaluated by ZekoAudit.
        </p>

        <div className="border-l-2 border-[#00E66A] pl-6 py-2 space-y-6">
           <div>
             <h3 className="text-xl font-bold mb-2">Largest Contentful Paint (LCP)</h3>
             <p className="text-zinc-400 leading-relaxed text-sm">Measures loading performance. To provide a good user experience, LCP should occur within 2.5 seconds of when the page first starts loading.</p>
           </div>
           <div>
             <h3 className="text-xl font-bold mb-2">First Input Delay (FID) / Interaction to Next Paint (INP)</h3>
             <p className="text-zinc-400 leading-relaxed text-sm">Measures interactivity. Pages should have an INP of 200 milliseconds or less.</p>
           </div>
           <div>
             <h3 className="text-xl font-bold mb-2">Cumulative Layout Shift (CLS)</h3>
             <p className="text-zinc-400 leading-relaxed text-sm">Measures visual stability. To provide a good user experience, pages should maintain a CLS of 0.1. or less.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
