import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white px-4 pt-32 pb-24 sm:px-6 lg:px-8 max-w-[900px] mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase mb-12">
        <ArrowLeft className="h-4 w-4" /> Back to System
      </Link>
      
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00E66A]/50 to-transparent mb-12"></div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase mb-6 text-white mt-8">
          Privacy Policy
        </h1>
        <p className="text-[#00E66A] font-mono text-xs uppercase tracking-widest mb-12">
          Effective Date: {new Date().toLocaleDateString()}
        </p>

        <div className="border-l-2 border-white/10 pl-6 py-2 space-y-8">
           <div>
             <h3 className="text-xl font-bold mb-2">No Data Storage</h3>
             <p className="text-zinc-400 leading-relaxed text-sm">ZekoAudit does not store your audit results in a database. All audits are run on-the-fly and processed purely in-memory on our edge servers. Once your browser session is closed, the audit data is permanently gone from our systems.</p>
           </div>
           <div>
             <h3 className="text-xl font-bold mb-2">Third-Party Subprocessors</h3>
             <p className="text-zinc-400 leading-relaxed text-sm">To provide our service, we relay the URL you submit to Google PageSpeed Insights and Google Gemini APIs. Please refer to their respective privacy policies to understand how they handle inbound API requests.</p>
           </div>
           <div>
             <h3 className="text-xl font-bold mb-2">User-Provided API Keys</h3>
             <p className="text-zinc-400 leading-relaxed text-sm">If you opt to use experimental features or override rate limits by providing your own API key (Bring Your Own Key), that key is stored securely in your browser's local storage. We do not store, log, or sell your API keys. They are transmitted securely only at the exact moment of execution.</p>
           </div>
        </div>
    </div>
  );
}
