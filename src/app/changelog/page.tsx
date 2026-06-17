import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-24 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase mb-12">
        <ArrowLeft className="h-4 w-4" /> Back to System
      </Link>
      
      <div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter uppercase mb-6 text-white">
          Changelog
        </h1>
        <p className="text-zinc-400 font-light text-lg leading-relaxed mb-12">
          Recent updates and improvements to the ZekoAudit platform.
        </p>

        <div className="border-l-2 border-[#FF5500] pl-6 py-2 space-y-8">
           <div>
             <h3 className="text-xl font-bold mb-2 flex items-center gap-4">v0.1.1 <span className="text-xs font-mono text-[#FF5500] border border-[#FF5500]/30 bg-[#FF5500]/10 px-2 py-1 rounded">Latest</span></h3>
             <p className="text-zinc-400 leading-relaxed text-sm mb-4">Security, Compliance & API Quotas.</p>
             <ul className="list-disc pl-5 text-sm text-zinc-500 font-mono space-y-1">
               <li>Established Bring Your Own Key (BYOK) architecture to bypass global AI rate limits.</li>
               <li>Introduced experimental placeholder for upcoming Visual Audit capability.</li>
               <li>Published dedicated Security page detailing ephemeral data processing workflows.</li>
               <li>Updated Privacy Policy and Terms of Service with user-provided API key constraints.</li>
             </ul>
           </div>
           
           <div>
             <h3 className="text-xl font-bold mb-2 flex items-center gap-4">v0.1.0</h3>
             <p className="text-zinc-400 leading-relaxed text-sm mb-4">Initial release of the ZekoAudit platform.</p>
             <ul className="list-disc pl-5 text-sm text-zinc-500 font-mono space-y-1">
               <li>Added core Google Lighthouse API integration.</li>
               <li>Implemented Gemini-based AI diagnostic generation.</li>
               <li>Launched Side-by-Side comparison tool.</li>
               <li>Shipped dynamic client-side PDF export system.</li>
             </ul>
           </div>
        </div>
      </div>
    </div>
  );
}
