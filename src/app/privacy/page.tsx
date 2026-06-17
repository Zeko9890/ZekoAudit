import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-24 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase mb-12">
        <ArrowLeft className="h-4 w-4" /> Back to System
      </Link>
      
      <div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter uppercase mb-6 text-white">
          Privacy Policy
        </h1>
        <p className="text-zinc-400 font-light text-lg leading-relaxed mb-12">
          Effective Date: {new Date().toLocaleDateString()}
        </p>

        <div className="border-l-2 border-[#FF5500] pl-6 py-2 space-y-6">
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
    </div>
  );
}
