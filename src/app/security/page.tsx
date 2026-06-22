import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white px-4 pt-32 pb-24 sm:px-6 lg:px-8 max-w-[900px] mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase mb-12">
        <ArrowLeft className="h-4 w-4" /> Back to System
      </Link>
      
      <div>
        <div className="flex items-center gap-4 mb-6">
          <ShieldCheck className="h-10 w-10 text-[#00E66A]" />
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter uppercase text-white">
            Security Overview
          </h1>
        </div>
        <p className="text-zinc-400 font-light text-lg leading-relaxed mb-12">
          Transparency is critical. Learn exactly how ZekoAudit processes, transmits, and secures your data.
        </p>

        <div className="border-l-2 border-[#00E66A] pl-6 py-2 space-y-12">
           
           <div>
             <h3 className="text-xl font-bold mb-3 uppercase tracking-wider text-white">How Audits Work</h3>
             <p className="text-zinc-400 leading-relaxed text-sm">
               ZekoAudit functions as an edge-rendered analysis engine. When you submit a URL, our backend servers dispatch concurrent requests to Google PageSpeed Insights and Google Gemini APIs. The resulting diagnostics are compiled and streamed directly back to your browser session.
             </p>
           </div>

           <div>
             <h3 className="text-xl font-bold mb-3 uppercase tracking-wider text-white">Data Storage & Transmission</h3>
             <p className="text-zinc-400 leading-relaxed text-sm mb-4">
               <strong>What data is transmitted:</strong> Only the target URL you input is transmitted over secure HTTPS to our backend and subsequently to Google's APIs.
             </p>
             <p className="text-zinc-400 leading-relaxed text-sm mb-4">
               <strong>What data is stored:</strong> Absolutely nothing. ZekoAudit does not utilize a persistent database for audit results. We do not store your reports, URLs, or personal identifiable information.
             </p>
             <p className="text-zinc-400 leading-relaxed text-sm">
               <strong>What data is NOT stored:</strong> Because audits are ephemeral, once you close your browser tab, your report is permanently destroyed unless you explicitly export it as a PDF.
             </p>
           </div>

           <div>
             <h3 className="text-xl font-bold mb-3 uppercase tracking-wider text-white">Bring Your Own Key (BYOK)</h3>
             <p className="text-zinc-400 leading-relaxed text-sm mb-4">
               For advanced features like the experimental Visual Audit or rate-limit overrides, you may be prompted to provide your own Google Gemini API key.
             </p>
             <ul className="list-disc pl-5 text-sm text-zinc-400 space-y-2 marker:text-[#00E66A]">
               <li><strong>Storage:</strong> User API keys are stored strictly in your browser's local storage (`localStorage`).</li>
               <li><strong>Zero Backend Storage:</strong> Keys are never saved to our database.</li>
               <li><strong>Zero Logging:</strong> Keys are scrubbed from all server logs and error trackers.</li>
               <li><strong>Transmission:</strong> Keys are passed via secure custom HTTP headers during the exact moment of API execution.</li>
             </ul>
           </div>

           <div>
             <h3 className="text-xl font-bold mb-3 uppercase tracking-wider text-white">Visual Audits & Screenshots</h3>
             <p className="text-zinc-400 leading-relaxed text-sm">
               When running a Visual Audit, a transient serverless function captures a screenshot of your target URL. This image is held in volatile memory (RAM) just long enough to be converted to Base64 and sent to the Gemini Vision API. It is never written to disk or long-term cloud storage.
             </p>
           </div>

           <div>
             <h3 className="text-xl font-bold mb-3 uppercase tracking-wider text-white">Report Sharing</h3>
             <p className="text-zinc-400 leading-relaxed text-sm">
               Because we do not store your data, there are no shareable "cloud links" for reports. All sharing must be done by generating a client-side PDF export, which is constructed securely within your own browser without relying on external PDF generation services.
             </p>
           </div>

        </div>
      </div>
    </div>
  );
}
