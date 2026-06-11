'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Globe, 
  ArrowRight, 
  Zap, 
  Eye, 
  Shield,
  SearchCode,
  Accessibility
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
  const [error, setError] = useState('');
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

  const handleQuickAudit = (target: string) => {
    router.push(`/audit?url=${encodeURIComponent(target)}`);
  };

  return (
    <div className="relative isolate flex flex-col items-center w-full bg-black">
      {/* Background decoration - minimal sharp grid */}
      <div className="absolute inset-0 -z-10 grid-bg-sharp opacity-50"></div>

      {/* Hero Section */}
      <section id="analyze" className="w-full max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-8 text-center sm:pt-32">
        {/* Sharp Tag */}
        <div className="inline-flex items-center space-x-2 border border-white/20 bg-black px-3 py-1 text-xs text-zinc-300 mb-8 uppercase tracking-widest font-mono">
          <span className="w-2 h-2 bg-[#FF5500]"></span>
          <span>Engineering-Grade Web Audits</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl font-extrabold tracking-tighter text-white sm:text-7xl lg:text-8xl max-w-5xl mx-auto leading-none">
          PRECISION AUDITING. <br />
          <span className="text-zinc-500">MAXIMUM VELOCITY.</span>
        </h1>

        <p className="mt-8 text-lg text-zinc-400 max-w-2xl mx-auto font-light">
          Professional audits powered by Google PageSpeed Insights. Deep insights into indexing, performance bottlenecks, WCAG compliance, and architectural best practices.
        </p>

        {/* URL Input Form */}
        <form onSubmit={handleAnalyze} className="mt-12 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row shadow-2xl transition-all duration-300 group">
            <div className="flex-1 flex items-center px-4 gap-3 bg-black border border-white/20 group-focus-within:border-[#FF5500] transition-colors">
              <Globe className="h-5 w-5 text-zinc-500 group-focus-within:text-[#FF5500] transition-colors" />
              <input
                id="url-input"
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Target URL (e.g., stripe.com)"
                className="w-full bg-transparent py-4 text-white placeholder-zinc-600 focus:outline-none text-base font-mono"
                aria-label="Website URL to audit"
              />
            </div>
            <button
              id="analyze-button"
              type="submit"
              className="flex items-center justify-center gap-2 bg-[#FF5500] hover:bg-[#E64C00] text-white font-bold px-8 py-4 transition-colors uppercase tracking-wider text-sm mt-2 sm:mt-0"
            >
              Analyze
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          {error && (
            <p className="mt-3 text-sm text-[#FF5500] text-left font-mono flex items-center gap-2">
              <span className="h-1 w-1 bg-[#FF5500]"></span> {error}
            </p>
          )}
        </form>

        <p className="mt-6 text-xs text-zinc-500 font-mono">
          TRY:{' '}
          <button
            onClick={() => setUrl('stripe.com')}
            className="text-white hover:text-[#FF5500] transition-colors"
          >
            STRIPE.COM
          </button>{' '}
          OR{' '}
          <button
            onClick={() => setUrl('linear.app')}
            className="text-white hover:text-[#FF5500] transition-colors"
          >
            LINEAR.APP
          </button>
        </p>
      </section>

      {/* Benchmark Reports Section — links trigger live PageSpeed audits */}
      <section id="examples" className="w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-white/10 bg-black">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white uppercase">
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

      {/* Features Section */}
      <section id="features" className="w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="mb-16">
          <h2 className="text-3xl font-extrabold text-white uppercase tracking-tight">
            Analysis Parameters
          </h2>
          <p className="mt-2 text-sm text-zinc-400 font-mono">
            / CORE INSPECTION VECTORS
          </p>
        </div>

        {/* Pillars Strict Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-white/10">
          {/* Card 1: Performance */}
          <div className="bg-black p-8 md:border-r md:border-b border-white/10 hover-sharp-orange transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <Zap className="h-6 w-6 text-white" />
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">Performance Core</h3>
            </div>
            <p className="text-sm text-zinc-400 mb-8 font-light">
              Measures the loading speed and visual responsiveness of your page elements via Lighthouse Core Web Vitals analysis.
            </p>
            <ul className="space-y-3 border-t border-white/10 pt-6 text-xs text-zinc-300 font-mono uppercase">
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#FF5500]"></span> First Contentful Paint</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#FF5500]"></span> Largest Contentful Paint</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#FF5500]"></span> Cumulative Layout Shift</li>
            </ul>
          </div>

          {/* Card 2: SEO */}
          <div className="bg-black p-8 md:border-b border-white/10 hover-sharp-orange transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <SearchCode className="h-6 w-6 text-white" />
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">Search Analytics</h3>
            </div>
            <p className="text-sm text-zinc-400 mb-8 font-light">
              Verifies whether your page is correctly configured to be indexed by major search engines per Google Lighthouse SEO audits.
            </p>
            <ul className="space-y-3 border-t border-white/10 pt-6 text-xs text-zinc-300 font-mono uppercase">
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#FF5500]"></span> Meta Tags Validation</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#FF5500]"></span> Indexing & Robots</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#FF5500]"></span> Structured Schemas</li>
            </ul>
          </div>

          {/* Card 3: Accessibility */}
          <div className="bg-black p-8 md:border-r border-white/10 hover-sharp-orange transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <Accessibility className="h-6 w-6 text-white" />
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">A11y Compliance</h3>
            </div>
            <p className="text-sm text-zinc-400 mb-8 font-light">
              Evaluates screen reader support, keyboard navigability, and visual readability according to WCAG 2.1 AA benchmarks.
            </p>
            <ul className="space-y-3 border-t border-white/10 pt-6 text-xs text-zinc-300 font-mono uppercase">
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#FF5500]"></span> Contrast Ratios</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#FF5500]"></span> Semantic Landmarks</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#FF5500]"></span> Focus State Loops</li>
            </ul>
          </div>

          {/* Card 4: Best Practices */}
          <div className="bg-black p-8 hover-sharp-orange transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <Shield className="h-6 w-6 text-white" />
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">Best Practices</h3>
            </div>
            <p className="text-sm text-zinc-400 mb-8 font-light">
              Assesses security protocols, network transmission standards, and code delivery safety per Lighthouse best-practices audits.
            </p>
            <ul className="space-y-3 border-t border-white/10 pt-6 text-xs text-zinc-300 font-mono uppercase">
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#FF5500]"></span> Transport Security</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#FF5500]"></span> Deprecated APIs</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#FF5500]"></span> Cross-Origin Policies</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
