import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Terminal } from 'lucide-react';

export default function ApiPolicyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white px-4 pt-32 pb-24 sm:px-6 lg:px-8 max-w-[900px] mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase mb-12">
        <ArrowLeft className="h-4 w-4" /> Back to System
      </Link>
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00E66A]/50 to-transparent mb-12"></div>
      <div className="flex items-center gap-4 mb-6 mt-8">
        <Terminal className="h-10 w-10 text-[#00E66A]" />
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase text-white">
          API Usage Policy
        </h1>
      </div>
      <p className="text-[#00E66A] font-mono text-xs uppercase tracking-widest mb-12">
        Effective Date: {new Date().toLocaleDateString()}
      </p>

      <div className="border-l-2 border-white/10 pl-6 py-2 space-y-12">
          <div>
            <h3 className="text-xl font-bold mb-3 uppercase tracking-wider text-white">Zero Data Retention</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">
              ZekoAudit's API operates entirely in-memory. We do not log, store, or persist any of the data passing through our API endpoints. Your submitted URLs and the generated reports exist only for the duration of the request lifecycle and are immediately purged from server memory upon response.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3 uppercase tracking-wider text-white">Rate Limiting</h3>
            <p className="text-zinc-400 leading-relaxed text-sm mb-4">
              To ensure system stability, public API endpoints are strictly rate-limited. If you exceed the maximum number of requests allowed per minute from a single IP, you will receive an HTTP 429 status code. Please wait and retry.
            </p>
            <p className="text-zinc-400 leading-relaxed text-sm">
              Users leveraging the "Bring Your Own Key" (BYOK) functionality bypass our internal rate limits but remain subject to the rate limits enforced directly by Google PageSpeed Insights and Gemini APIs.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3 uppercase tracking-wider text-white">Key Security</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">
              When utilizing BYOK mode, your API keys are embedded in your browser's local storage and injected as headers on the client-side. Our API acts purely as a secure proxy to forward these requests, ensuring no credentials are ever intercepted, logged, or stored on ZekoAudit servers.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3 uppercase tracking-wider text-white">Acceptable Use</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">
              You agree not to use the ZekoAudit API for malicious purposes, including but not limited to DDoS attacks, scraping, or attempting to reverse-engineer our backend systems. Violators will be permanently blocked at the CDN level.
            </p>
          </div>
      </div>
    </div>
  );
}
