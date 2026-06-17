import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PDFReportsPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-24 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase mb-12">
        <ArrowLeft className="h-4 w-4" /> Back to System
      </Link>
      
      <div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter uppercase mb-6 text-white">
          PDF Reports Engine
        </h1>
        <p className="text-zinc-400 font-light text-lg leading-relaxed mb-12">
          Generate presentation-ready, client-facing PDF documents from any audit result instantly.
        </p>

        <div className="border-l-2 border-[#FF5500] pl-6 py-2">
           <h3 className="text-xl font-bold mb-4">Under the Hood</h3>
           <p className="text-zinc-400 leading-relaxed">
             Our PDF generation relies on <code className="bg-white/10 px-1 rounded">@react-pdf/renderer</code> to convert our dynamic React-based UI elements into a static PDF blob in the browser. You don't have to wait for server-side generation — the entire layout computation happens client-side, giving you a shareable diagnostic document immediately.
           </p>
        </div>
      </div>
    </div>
  );
}
