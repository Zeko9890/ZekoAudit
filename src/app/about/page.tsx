import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-24 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase mb-12">
        <ArrowLeft className="h-4 w-4" /> Back to System
      </Link>
      
      <div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter uppercase mb-6 text-white">
          About ZekoAudit
        </h1>
        <p className="text-zinc-400 font-light text-lg leading-relaxed mb-12">
          Built for engineers who care about performance down to the millisecond.
        </p>

        <div className="border-l-2 border-[#FF5500] pl-6 py-2">
           <h3 className="text-xl font-bold mb-4">Our Mission</h3>
           <p className="text-zinc-400 leading-relaxed">
             We were tired of slow, clunky marketing tools that gave superficial advice on website performance. We built ZekoAudit to bring the raw power of Google Lighthouse directly into a fast, premium, dark-mode interface, augmented by an AI engineer capable of debugging the specific DOM and network waterfall issues holding your site back.
           </p>
        </div>
      </div>
    </div>
  );
}
