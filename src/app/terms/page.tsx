import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white px-4 pt-32 pb-24 sm:px-6 lg:px-8 max-w-[900px] mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase mb-12">
        <ArrowLeft className="h-4 w-4" /> Back to System
      </Link>
      
      <div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter uppercase mb-6 text-white">
          Terms of Service
        </h1>
        <p className="text-zinc-400 font-light text-lg leading-relaxed mb-12">
          Effective Date: {new Date().toLocaleDateString()}
        </p>

        <div className="border-l-2 border-[#00E66A] pl-6 py-2 space-y-6">
           <div>
             <h3 className="text-xl font-bold mb-2">Service Availability</h3>
             <p className="text-zinc-400 leading-relaxed text-sm">ZekoAudit relies on upstream APIs (Google PageSpeed Insights, Gemini) that may enforce rate limits or experience downtime. We do not guarantee 100% uptime or successful audits for every domain (e.g., sites blocking automated bots or sitting behind CAPTCHAs).</p>
           </div>
           <div>
             <h3 className="text-xl font-bold mb-2">Liability</h3>
             <p className="text-zinc-400 leading-relaxed text-sm">The software is provided "as is", without warranty of any kind. ZekoAudit is not responsible for any impact to your web infrastructure that results from implementing our AI-generated suggestions. Always test changes in a staging environment.</p>
           </div>
           <div>
             <h3 className="text-xl font-bold mb-2">User-Provided API Keys & Billing</h3>
             <p className="text-zinc-400 leading-relaxed text-sm">If you utilize the Bring Your Own Key (BYOK) features, you are entirely responsible for the security, usage limits, and billing costs associated with your Google API account. ZekoAudit is not liable for any charges incurred due to token usage, quotas, or key exposure resulting from browser compromise.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
