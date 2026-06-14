'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Globe, 
  ArrowRight, 
  Zap, 
  Eye, 
  Shield,
  SearchCode,
  Accessibility,
  GitCompareArrows,
} from 'lucide-react';

// Static reference cards — these trigger a real live audit when clicked.
// The scores shown are indicative; clicking always fetches fresh PageSpeed data.
const REFERENCE_SITES = [
  {
    key: 'stripe.com',
    name: 'Stripe',
    url: 'stripe.com',
    label: 'Payment Infrastructure',
    tags: ['PERF', 'SEO', 'A11Y', 'BEST'],
  },
  {
    key: 'linear.app',
    name: 'Linear',
    url: 'linear.app',
    label: 'Product Engineering',
    tags: ['PERF', 'SEO', 'A11Y', 'BEST'],
  },
  {
    key: 'vercel.com',
    name: 'Vercel',
    url: 'vercel.com',
    label: 'Deployment Platform',
    tags: ['PERF', 'SEO', 'A11Y', 'BEST'],
  },
];

export default function Home() {
  const [url, setUrl] = useState('');
  const [urlB, setUrlB] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'single' | 'compare'>('single');
  const router = useRouter();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please enter a valid website URL');
      return;
    }
    router.push(`/audit?url=${encodeURIComponent(trimmed.toLowerCase())}`);
  };

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    const a = url.trim();
    const b = urlB.trim();
    if (!a || !b) {
      setError('Please enter both website URLs');
      return;
    }
    if (a.toLowerCase() === b.toLowerCase()) {
      setError('Please enter two different URLs');
      return;
    }
    router.push(`/compare?a=${encodeURIComponent(a.toLowerCase())}&b=${encodeURIComponent(b.toLowerCase())}`);
  };

  const handleQuickAudit = (target: string) => {
    router.push(`/audit?url=${encodeURIComponent(target)}`);
  };

  return (
    <div className="relative isolate flex flex-col items-center w-full bg-black">
      {/* Background decoration - minimal sharp grid */}
      <div className="absolute inset-0 -z-10 grid-bg-sharp opacity-50"></div>

      {/* Hero Section */}
      <section id="analyze" className="w-full max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-8 sm:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy */}
          <div>
            <div className="inline-flex items-center space-x-2 border border-white/20 bg-black px-3 py-1 text-xs text-zinc-300 mb-8 uppercase tracking-widest font-mono">
              <span className="w-2 h-2 bg-[#FF5500] animate-pulse"></span>
              <span>Engineering-Grade Web Audits</span>
            </div>
            
            <h1 className="text-5xl font-extrabold tracking-tighter text-white sm:text-7xl leading-none">
              PRECISION AUDITING. <br />
              <span className="text-zinc-500">MAXIMUM VELOCITY.</span>
            </h1>

            <p className="mt-6 text-lg text-zinc-400 font-light max-w-lg">
              Professional audits powered by Google PageSpeed Insights. Deep insights into indexing, performance bottlenecks, WCAG compliance, and architectural best practices.
            </p>
          </div>

          {/* Right Column: Interactive Tool */}
          <div className="bg-zinc-950 border border-white/10 p-1">
            <div className="bg-black border border-white/10 p-6 sm:p-8">
              {/* Tabs */}
              <div className="flex items-center gap-6 border-b border-white/10 mb-8 pb-4">
                <button
                  onClick={() => { setMode('single'); setError(''); }}
                  className={`text-xs font-mono uppercase tracking-widest transition-colors flex items-center gap-2 ${
                    mode === 'single' ? 'text-[#FF5500]' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  <Globe className="h-4 w-4" /> Single Audit
                </button>
                <button
                  onClick={() => { setMode('compare'); setError(''); }}
                  className={`text-xs font-mono uppercase tracking-widest transition-colors flex items-center gap-2 ${
                    mode === 'compare' ? 'text-[#FF5500]' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  <GitCompareArrows className="h-4 w-4" /> Compare
                </button>
              </div>

              {/* Single Mode Form */}
              {mode === 'single' && (
                <form onSubmit={handleAnalyze} className="space-y-6">
                  <div>
                    <label htmlFor="url-input" className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Target URL</label>
                    <div className="flex items-center px-4 gap-3 bg-black border border-white/20 focus-within:border-[#FF5500] transition-colors">
                      <Globe className="h-5 w-5 text-zinc-500" />
                      <input
                        id="url-input"
                        type="text"
                        value={url}
                        onChange={(e) => {
                          setUrl(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="e.g., stripe.com"
                        className="w-full bg-transparent py-4 text-white placeholder-zinc-600 focus:outline-none text-base font-mono"
                        aria-label="Website URL to audit"
                      />
                    </div>
                  </div>
                  
                  <button
                    id="analyze-button"
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#FF5500] hover:bg-[#E64C00] text-white font-bold px-8 py-4 transition-colors uppercase tracking-wider text-sm"
                  >
                    Run Diagnostics
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  {error && (
                    <p className="text-sm text-[#FF5500] font-mono flex items-center gap-2">
                      <span className="h-1 w-1 bg-[#FF5500]"></span> {error}
                    </p>
                  )}
                </form>
              )}

              {/* Compare Mode Form */}
              {mode === 'compare' && (
                <form onSubmit={handleCompare} className="space-y-4">
                  <div>
                    <label htmlFor="url-input-a" className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Site A</label>
                    <div className="flex items-center px-4 gap-3 bg-black border border-white/20 focus-within:border-[#FF5500] transition-colors">
                      <Globe className="h-4 w-4 text-zinc-500" />
                      <input
                        id="url-input-a"
                        type="text"
                        value={url}
                        onChange={(e) => { setUrl(e.target.value); if (error) setError(''); }}
                        placeholder="e.g., stripe.com"
                        className="w-full bg-transparent py-3 text-white placeholder-zinc-600 focus:outline-none text-sm font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="url-input-b" className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2 mt-4">Site B</label>
                    <div className="flex items-center px-4 gap-3 bg-black border border-white/20 focus-within:border-[#FF5500] transition-colors">
                      <Globe className="h-4 w-4 text-zinc-500" />
                      <input
                        id="url-input-b"
                        type="text"
                        value={urlB}
                        onChange={(e) => { setUrlB(e.target.value); if (error) setError(''); }}
                        placeholder="e.g., linear.app"
                        className="w-full bg-transparent py-3 text-white placeholder-zinc-600 focus:outline-none text-sm font-mono"
                      />
                    </div>
                  </div>
                  
                  <button
                    id="compare-button"
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#FF5500] hover:bg-[#E64C00] text-white font-bold px-8 py-4 transition-colors uppercase tracking-wider text-sm mt-6"
                  >
                    <GitCompareArrows className="h-4 w-4" /> Execute Comparison
                  </button>

                  {error && (
                    <p className="mt-3 text-sm text-[#FF5500] font-mono flex items-center gap-2">
                      <span className="h-1 w-1 bg-[#FF5500]"></span> {error}
                    </p>
                  )}
                </form>
              )}

              {/* Quick Try Pills */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-3">Quick Try</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setUrl('stripe.com'); setMode('single'); }}
                    className="px-3 py-1.5 border border-white/10 hover:border-[#FF5500] text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                  >
                    STRIPE.COM
                  </button>
                  <button
                    onClick={() => { setUrl('vercel.com'); setMode('single'); }}
                    className="px-3 py-1.5 border border-white/10 hover:border-[#FF5500] text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                  >
                    VERCEL.COM
                  </button>
                  <button
                    onClick={() => { setUrl('stripe.com'); setUrlB('linear.app'); setMode('compare'); }}
                    className="px-3 py-1.5 border border-white/10 hover:border-[#FF5500] text-xs font-mono text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <GitCompareArrows className="h-3 w-3" /> STRIPE vs LINEAR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features as a Technical Specification List */}
      <section id="features" className="w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="border-t border-white/10 pt-16">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="md:w-1/3">
              <h2 className="text-2xl font-extrabold text-white uppercase tracking-tight">
                Analysis Parameters
              </h2>
              <p className="mt-4 text-sm text-zinc-400 font-mono leading-relaxed">
                / CORE INSPECTION VECTORS
                <br /><br />
                Our engine utilizes a multi-threaded approach to extract, analyze, and validate over 100 specific metrics mapped to current web standards.
              </p>
            </div>
            
            <div className="md:w-2/3 w-full">
              <div className="grid grid-cols-1 border-t border-white/10">
                
                {/* Spec Row 1 */}
                <div className="border-b border-white/10 py-6 flex flex-col sm:flex-row gap-6 hover:bg-white/5 transition-colors group px-4 -mx-4">
                  <div className="sm:w-1/4 flex items-start gap-3">
                    <Zap className="h-5 w-5 text-[#FF5500] shrink-0" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">Performance Core</h3>
                  </div>
                  <div className="sm:w-3/4">
                    <p className="text-sm text-zinc-400 font-light mb-4">Measures the loading speed and visual responsiveness via Lighthouse Core Web Vitals analysis.</p>
                    <div className="flex flex-wrap gap-3">
                      <span className="text-[10px] font-mono text-zinc-500 border border-white/10 px-2 py-1 uppercase">First Contentful Paint</span>
                      <span className="text-[10px] font-mono text-zinc-500 border border-white/10 px-2 py-1 uppercase">Largest Contentful Paint</span>
                      <span className="text-[10px] font-mono text-zinc-500 border border-white/10 px-2 py-1 uppercase">Cumulative Layout Shift</span>
                    </div>
                  </div>
                </div>

                {/* Spec Row 2 */}
                <div className="border-b border-white/10 py-6 flex flex-col sm:flex-row gap-6 hover:bg-white/5 transition-colors group px-4 -mx-4">
                  <div className="sm:w-1/4 flex items-start gap-3">
                    <SearchCode className="h-5 w-5 text-[#FF5500] shrink-0" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">Search Analytics</h3>
                  </div>
                  <div className="sm:w-3/4">
                    <p className="text-sm text-zinc-400 font-light mb-4">Verifies whether your page is correctly configured to be indexed by major search engines.</p>
                    <div className="flex flex-wrap gap-3">
                      <span className="text-[10px] font-mono text-zinc-500 border border-white/10 px-2 py-1 uppercase">Meta Tags Validation</span>
                      <span className="text-[10px] font-mono text-zinc-500 border border-white/10 px-2 py-1 uppercase">Indexing & Robots</span>
                      <span className="text-[10px] font-mono text-zinc-500 border border-white/10 px-2 py-1 uppercase">Structured Schemas</span>
                    </div>
                  </div>
                </div>

                {/* Spec Row 3 */}
                <div className="border-b border-white/10 py-6 flex flex-col sm:flex-row gap-6 hover:bg-white/5 transition-colors group px-4 -mx-4">
                  <div className="sm:w-1/4 flex items-start gap-3">
                    <Accessibility className="h-5 w-5 text-[#FF5500] shrink-0" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">A11y Compliance</h3>
                  </div>
                  <div className="sm:w-3/4">
                    <p className="text-sm text-zinc-400 font-light mb-4">Evaluates screen reader support, keyboard navigability, and visual readability (WCAG 2.1 AA).</p>
                    <div className="flex flex-wrap gap-3">
                      <span className="text-[10px] font-mono text-zinc-500 border border-white/10 px-2 py-1 uppercase">Contrast Ratios</span>
                      <span className="text-[10px] font-mono text-zinc-500 border border-white/10 px-2 py-1 uppercase">Semantic Landmarks</span>
                      <span className="text-[10px] font-mono text-zinc-500 border border-white/10 px-2 py-1 uppercase">Focus State Loops</span>
                    </div>
                  </div>
                </div>

                {/* Spec Row 4 */}
                <div className="border-b border-white/10 py-6 flex flex-col sm:flex-row gap-6 hover:bg-white/5 transition-colors group px-4 -mx-4">
                  <div className="sm:w-1/4 flex items-start gap-3">
                    <Shield className="h-5 w-5 text-[#FF5500] shrink-0" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">Best Practices</h3>
                  </div>
                  <div className="sm:w-3/4">
                    <p className="text-sm text-zinc-400 font-light mb-4">Assesses security protocols, network transmission standards, and code delivery safety.</p>
                    <div className="flex flex-wrap gap-3">
                      <span className="text-[10px] font-mono text-zinc-500 border border-white/10 px-2 py-1 uppercase">Transport Security</span>
                      <span className="text-[10px] font-mono text-zinc-500 border border-white/10 px-2 py-1 uppercase">Deprecated APIs</span>
                      <span className="text-[10px] font-mono text-zinc-500 border border-white/10 px-2 py-1 uppercase">Cross-Origin Policies</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benchmark Reports Section — unchanged layout, fits the professional tool look */}
      <section id="examples" className="w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-white/10 bg-black">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white uppercase">
              Benchmark Reports
            </h2>
            <p className="text-sm text-zinc-400 mt-2 font-mono">
              / LIVE ANALYSIS / CLICK TO RUN A REAL PAGESPEED AUDIT
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-[#FF5500] font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5500] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5500]"></span>
            </span>
            PAGESPEED API ONLINE
          </div>
        </div>

        {/* Reference Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-white/10">
          {REFERENCE_SITES.map((site, index) => (
            <button
              key={site.key}
              onClick={() => handleQuickAudit(site.url)}
              className={`group bg-black p-8 text-left hover-sharp-orange transition-colors w-full ${
                index !== REFERENCE_SITES.length - 1 ? 'border-b lg:border-b-0 lg:border-r border-white/10' : ''
              }`}
              aria-label={`Run live PageSpeed audit for ${site.name}`}
            >
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                    {site.name}
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono mt-1">{site.url}</p>
                  <p className="text-[10px] text-zinc-600 font-mono mt-2 uppercase tracking-widest">{site.label}</p>
                </div>

                {/* Live indicator */}
                <div className="text-right">
                  <div className="text-[10px] text-[#FF5500] font-mono uppercase tracking-widest">
                    Click to Audit
                  </div>
                  <div className="mt-2 w-8 h-0.5 bg-[#FF5500] ml-auto group-hover:w-full transition-all duration-300"></div>
                </div>
              </div>

              {/* Score Dimensions */}
              <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10">
                {site.tags.map((tag) => (
                  <div key={tag} className="bg-black p-3 flex justify-between items-center text-xs">
                    <span className="text-zinc-500 uppercase">{tag}</span>
                    <span className="font-mono text-zinc-600">—</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between text-xs text-[#FF5500] font-mono uppercase tracking-widest group-hover:text-[#E64C00] transition-colors">
                <span>Run Live Audit</span>
                <Eye className="h-4 w-4" />
              </div>
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}
