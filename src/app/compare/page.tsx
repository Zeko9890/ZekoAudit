'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  FileDown,
  Loader2,
  Zap,
  Search,
  Accessibility,
  ShieldCheck,
  Trophy,
  Minus,
  CheckCircle2,
} from 'lucide-react';
import type {
  AuditReport,
  GeminiComparison,
  CategoryWinner,
} from '@/types/audit';

// ---------------------------------------------------------------------------
// Helper: compute winner for a category
// ---------------------------------------------------------------------------
function computeWinner(a: number, b: number): CategoryWinner {
  const delta = Math.abs(a - b);
  if (delta <= 2) return { winner: 'tie', delta };
  return { winner: a > b ? 'a' : 'b', delta };
}

// ---------------------------------------------------------------------------
// Gemini Comparison Section
// ---------------------------------------------------------------------------
function GeminiComparisonSection({
  reportA,
  reportB,
  onComparisonReady,
}: {
  reportA: AuditReport;
  reportB: AuditReport;
  onComparisonReady?: (c: GeminiComparison) => void;
}) {
  const [comparison, setComparison] = useState<GeminiComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      setComparison(null);
      try {
        const res = await fetch('/api/gemini-comparison', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reportA, reportB }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.details || err.error || `HTTP ${res.status}`);
        }
        const data: GeminiComparison = await res.json();
        if (!cancelled) {
          setComparison(data);
          setLoading(false);
          onComparisonReady?.(data);
        }
      } catch {
        if (!cancelled) {
          setError('AI recommendations are temporarily unavailable.');
          setLoading(false);
        }
      }
    };
    run();
    return () => { cancelled = true; };
  }, [reportA.url, reportB.url]);

  if (loading) {
    return (
      <div className="mt-16 border-t border-white/20 pt-8">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="h-5 w-5 text-[#FF5500]" />
          <h2 className="text-2xl font-extrabold text-white uppercase tracking-tight">AI Comparison</h2>
          <span className="text-[10px] font-mono text-[#FF5500] border border-[#FF5500]/30 px-2 py-0.5 uppercase tracking-widest">Gemini 2.5 Flash</span>
        </div>
        <div className="border border-white/20 p-8 bg-black">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-3 w-3 bg-[#FF5500] animate-pulse"></div>
            <p className="text-sm font-mono text-zinc-400 uppercase tracking-widest">Generating comparative analysis...</p>
          </div>
          <div className="space-y-3">
            {['Comparing scores', 'Analyzing strengths', 'Identifying differences', 'Building recommendations'].map((step, i) => (
              <div key={i} className="flex items-center gap-3 text-xs font-mono text-zinc-600">
                <div className="h-1 w-1 bg-zinc-700"></div>
                <span className="uppercase tracking-widest">{step}...</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-16 border-t border-white/20 pt-8">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="h-5 w-5 text-zinc-600" />
          <h2 className="text-2xl font-extrabold text-white uppercase tracking-tight">AI Comparison</h2>
        </div>
        <div className="border border-[#FF5500]/30 p-6 bg-[#FF5500]/5">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="h-4 w-4 text-[#FF5500]" />
            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Comparison Unavailable</h4>
          </div>
          <p className="text-xs font-mono text-zinc-400 leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  if (!comparison) return null;

  return (
    <div className="mt-16 border-t border-white/20 pt-8">
      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="h-5 w-5 text-[#FF5500]" />
        <h2 className="text-2xl font-extrabold text-white uppercase tracking-tight">AI Comparison</h2>
        <span className="text-[10px] font-mono text-[#FF5500] border border-[#FF5500]/30 px-2 py-0.5 uppercase tracking-widest">Gemini 2.5 Flash</span>
      </div>

      {/* Executive Summary */}
      <div className="border border-white/20 p-6 bg-black mb-6">
        <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Executive Summary</h3>
        <p className="text-sm text-zinc-200 leading-relaxed font-light">{comparison.executiveSummary}</p>
      </div>

      {/* Strengths columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="border border-white/20 p-6 bg-black">
          <h3 className="text-[10px] font-mono text-[#FF5500] uppercase tracking-widest mb-4">{reportA.url} Strengths</h3>
          <ul className="space-y-3">
            {comparison.siteAStrengths.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-xs font-mono text-zinc-300 leading-relaxed">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#FF5500] mt-0.5 flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-white/20 p-6 bg-black">
          <h3 className="text-[10px] font-mono text-[#FF5500] uppercase tracking-widest mb-4">{reportB.url} Strengths</h3>
          <ul className="space-y-3">
            {comparison.siteBStrengths.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-xs font-mono text-zinc-300 leading-relaxed">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#FF5500] mt-0.5 flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Key Differences */}
      <div className="border border-white/20 p-6 bg-black mb-6">
        <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4">Key Differences</h3>
        <ul className="space-y-3">
          {comparison.keyDifferences.map((d, i) => (
            <li key={i} className="flex items-start gap-3 text-xs font-mono text-zinc-400 leading-relaxed">
              <span className="text-[#FF5500] font-bold flex-shrink-0">{i + 1}.</span>
              {d}
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="border border-white/20 p-6 bg-black">
        <h3 className="text-[10px] font-mono text-[#FF5500] uppercase tracking-widest mb-4">Recommendations</h3>
        <ul className="space-y-3">
          {comparison.recommendations.map((r, i) => (
            <li key={i} className="flex items-start gap-3 text-xs font-mono text-zinc-300 leading-relaxed">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#FF5500] mt-0.5 flex-shrink-0" />
              {r}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-[10px] font-mono text-zinc-700 text-right">
        Generated by Gemini 2.5 Flash · {new Date(comparison.generatedAt).toLocaleString()}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Score card helper
// ---------------------------------------------------------------------------
function getScoreColor(score: number, bg = false) {
  if (score >= 90) return bg ? 'bg-[#22c55e]' : 'text-[#22c55e]';
  if (score >= 50) return bg ? 'bg-[#f97316]' : 'text-[#f97316]';
  return bg ? 'bg-[#ef4444]' : 'text-[#ef4444]';
}



// ---------------------------------------------------------------------------
// Main comparison content
// ---------------------------------------------------------------------------
function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawA = searchParams.get('a') || '';
  const rawB = searchParams.get('b') || '';

  const [loading, setLoading] = useState(true);
  const [loadingStepA, setLoadingStepA] = useState(0);
  const [loadingStepB, setLoadingStepB] = useState(0);
  const [reportA, setReportA] = useState<AuditReport | null>(null);
  const [reportB, setReportB] = useState<AuditReport | null>(null);
  const [errorA, setErrorA] = useState<string | null>(null);
  const [errorB, setErrorB] = useState<string | null>(null);
  const [geminiForPdf, setGeminiForPdf] = useState<GeminiComparison | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const loadingSteps = [
    '> INIT HANDSHAKE...',
    '> CRAWLING DOM...',
    '> EXTRACTING META...',
    '> COMPUTING VITALS...',
    '> GENERATING REPORT...',
  ];

  useEffect(() => {
    if (!rawA || !rawB) return;

    let intA: NodeJS.Timeout;
    let intB: NodeJS.Timeout;

    const runInit = async () => {
      await Promise.resolve();
      setLoading(true);
      setReportA(null);
      setReportB(null);
      setErrorA(null);
      setErrorB(null);
      setLoadingStepA(0);
      setLoadingStepB(0);
      setGeminiForPdf(null);

      let stepA = 0, stepB = 0;
      intA = setInterval(() => { if (stepA < 3) { stepA++; setLoadingStepA(stepA); } }, 700);
      intB = setInterval(() => { if (stepB < 3) { stepB++; setLoadingStepB(stepB); } }, 900);

      const fetchSite = async (url: string, setSite: (r: AuditReport) => void, setErr: (e: string) => void, setStep: (n: number) => void) => {
        try {
          const res = await fetch(`/api/audit?url=${encodeURIComponent(url)}`);
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }
          const data: AuditReport = await res.json();
          setStep(4);
          setSite(data);
        } catch {
          setErr('Analysis failed. Please check the URL and try again.');
        }
      };

      Promise.allSettled([
        fetchSite(rawA, setReportA, setErrorA, setLoadingStepA),
        fetchSite(rawB, setReportB, setErrorB, setLoadingStepB),
      ]).finally(() => {
        clearInterval(intA);
        clearInterval(intB);
        setLoading(false);
      });
    };

    runInit();

    return () => { clearInterval(intA); clearInterval(intB); };
  }, [rawA, rawB, searchParams]);

  // PDF export
  const handleExportPdf = useCallback(async () => {
    if (!reportA || !reportB || pdfLoading) return;
    setPdfLoading(true);
    setPdfError(null);
    try {
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comparison: true,
          reportA,
          reportB,
          geminiComparison: geminiForPdf,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.details || err.error || `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zekoaudit-compare-${rawA}-vs-${rawB}.pdf`.replace(/[^a-z0-9.-]/gi, '-').toLowerCase();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setPdfError('Failed to generate PDF. Please try again later.');
    } finally {
      setPdfLoading(false);
    }
  }, [reportA, reportB, geminiForPdf, pdfLoading, rawA, rawB]);

  // Missing parameters
  if (!rawA || !rawB) {
    return (
      <div className="flex flex-col flex-grow items-center justify-center px-4 py-24 bg-black min-h-[70vh]">
        <div className="max-w-xl w-full p-8 border border-[#FF5500]/50 bg-black">
          <AlertTriangle className="h-8 w-8 text-[#FF5500] mb-4" />
          <h2 className="text-lg font-bold text-white uppercase tracking-widest mb-2">Missing URLs</h2>
          <p className="text-xs text-zinc-400 font-mono mb-6">Both website URLs are required for comparison.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF5500] text-xs font-mono text-white uppercase">
            <ArrowLeft className="h-3 w-3" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading && !reportA && !reportB) {
    return (
      <div className="relative flex flex-col flex-grow items-center justify-center px-4 py-24 bg-black min-h-[70vh]">
        <div className="absolute inset-0 grid-bg-sharp opacity-30 pointer-events-none"></div>
        <div className="max-w-4xl w-full relative z-10">
          <h2 className="text-2xl font-extrabold text-white uppercase tracking-tight mb-2 text-center">
            Dual Analysis
          </h2>
          <p className="text-xs text-[#FF5500] font-mono text-center mb-8">
            Auditing both sites concurrently
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-white/20">
            {[{ url: rawA, step: loadingStepA }, { url: rawB, step: loadingStepB }].map((site, idx) => (
              <div key={idx} className={`p-6 bg-black ${idx === 0 ? 'md:border-r border-b md:border-b-0 border-white/20' : ''}`}>
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Site {idx === 0 ? 'A' : 'B'}</span>
                    <p className="text-sm text-white font-mono mt-1">{site.url}</p>
                  </div>
                  <div className="h-3 w-3 bg-[#FF5500] animate-pulse"></div>
                </div>
                <div className="space-y-2 font-mono text-xs">
                  {loadingSteps.map((s, si) => {
                    const done = si < site.step;
                    const current = si === site.step;
                    if (!done && !current) return null;
                    return (
                      <div key={si} className={`flex justify-between ${current ? 'text-white' : 'text-zinc-600'}`}>
                        <span>{s}</span>
                        <span>{done ? '[OK]' : '[...]'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Both failed
  if (errorA && errorB) {
    return (
      <div className="flex flex-col flex-grow items-center justify-center px-4 py-24 bg-black min-h-[70vh]">
        <div className="max-w-xl w-full p-8 border border-[#FF5500]/50 bg-black">
          <AlertTriangle className="h-8 w-8 text-[#FF5500] mb-4" />
          <h2 className="text-lg font-bold text-white uppercase tracking-widest mb-4">Both Audits Failed</h2>
          <div className="space-y-3 mb-6">
            <div className="border border-white/10 p-3">
              <span className="text-[10px] font-mono text-zinc-500">SITE A: {rawA}</span>
              <p className="text-xs text-[#FF5500] font-mono mt-1">{errorA}</p>
            </div>
            <div className="border border-white/10 p-3">
              <span className="text-[10px] font-mono text-zinc-500">SITE B: {rawB}</span>
              <p className="text-xs text-[#FF5500] font-mono mt-1">{errorB}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="flex-1 text-center py-3 border border-white/20 text-xs font-mono text-white uppercase tracking-widest hover:border-white/50">
              Back
            </Link>
            <button
              onClick={() => router.push(`/compare?a=${encodeURIComponent(rawA)}&b=${encodeURIComponent(rawB)}&r=${Date.now()}`)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#FF5500] text-xs font-mono text-white uppercase tracking-widest"
            >
              <RefreshCw className="h-4 w-4" /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results view (partial or full)
  const hasResults = reportA || reportB;
  if (!hasResults) return null;

  // Category data
  const categories = [
    { label: 'Performance', key: 'performance' as const, icon: <Zap className="h-4 w-4" /> },
    { label: 'SEO', key: 'seo' as const, icon: <Search className="h-4 w-4" /> },
    { label: 'Accessibility', key: 'accessibility' as const, icon: <Accessibility className="h-4 w-4" /> },
    { label: 'Best Practices', key: 'bestPractices' as const, icon: <ShieldCheck className="h-4 w-4" /> },
  ];

  const overallWinner = reportA && reportB ? computeWinner(reportA.overallScore, reportB.overallScore) : null;

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-12 sm:px-6 lg:px-8 flex-grow bg-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between pb-8 border-b border-white/20 gap-4">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase mb-4">
            <ArrowLeft className="h-3 w-3" /> Back to System
          </Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-white uppercase">
            Comparison Report
          </h1>
          <p className="text-xs text-[#FF5500] font-mono mt-2">
            {rawA} vs {rawB} &bull; {reportA?.date || reportB?.date || 'N/A'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {reportA && reportB && (
            <button
              id="export-compare-pdf-btn"
              onClick={handleExportPdf}
              disabled={pdfLoading}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF5500] hover:bg-[#E64C00] disabled:opacity-50 disabled:cursor-not-allowed text-xs font-mono text-white transition-colors uppercase"
            >
              {pdfLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileDown className="h-3.5 w-3.5" />}
              {pdfLoading ? 'Generating...' : 'Export PDF'}
            </button>
          )}
          <button
            onClick={() => router.push(`/compare?a=${encodeURIComponent(rawA)}&b=${encodeURIComponent(rawB)}&r=${Date.now()}`)}
            className="flex items-center gap-2 px-4 py-2 border border-white/20 hover:border-[#FF5500] hover:text-[#FF5500] text-xs font-mono text-white transition-colors uppercase"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Re-execute
          </button>
        </div>
      </div>

      {pdfError && (
        <div className="mt-4 flex items-center gap-3 border border-[#FF5500]/30 bg-[#FF5500]/5 px-4 py-2 text-xs font-mono text-[#FF5500]">
          <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
          PDF export failed: {pdfError}
        </div>
      )}

      {/* Partial failure banner */}
      {(errorA || errorB) && (
        <div className="mt-6 border border-[#FF5500]/30 bg-[#FF5500]/5 p-4">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-4 w-4 text-[#FF5500]" />
            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Partial Failure</h4>
          </div>
          <p className="text-xs font-mono text-zinc-400">
            {errorA ? `Site A (${rawA}): ${errorA}` : `Site B (${rawB}): ${errorB}`}
          </p>
        </div>
      )}

      {/* Overall Score Face-Off */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-0 border border-white/20">
        {/* Site A */}
        <div className={`p-8 md:p-12 flex flex-col items-center justify-center text-center bg-black ${!reportA ? 'opacity-30' : ''} ${overallWinner?.winner === 'b' ? 'opacity-50' : ''}`}>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Site A</span>
          <span className="text-xs text-white font-mono mb-4">{rawA}</span>
          <div className={`text-[100px] leading-none font-black tracking-tighter ${reportA ? getScoreColor(reportA.overallScore) : 'text-zinc-700'}`}>
            {reportA?.overallScore ?? '—'}
          </div>
          {overallWinner?.winner === 'a' && (
            <div className="mt-6 flex items-center gap-2 border border-[#22c55e] bg-[#22c55e]/10 px-4 py-2">
              <Trophy className="h-4 w-4 text-[#22c55e]" />
              <span className="text-xs font-mono font-bold text-[#22c55e] uppercase tracking-widest">Better Overall Performance</span>
            </div>
          )}
        </div>

        {/* VS */}
        <div className="hidden md:flex flex-col items-center justify-center bg-black border-x border-white/20 px-6">
          <span className="text-2xl font-black text-zinc-600">VS</span>
        </div>
        <div className="md:hidden flex flex-col items-center justify-center bg-black border-y border-white/20 py-3">
          <span className="text-lg font-black text-zinc-600">VS</span>
        </div>

        {/* Site B */}
        <div className={`p-8 md:p-12 flex flex-col items-center justify-center text-center bg-black ${!reportB ? 'opacity-30' : ''} ${overallWinner?.winner === 'a' ? 'opacity-50' : ''}`}>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Site B</span>
          <span className="text-xs text-white font-mono mb-4">{rawB}</span>
          <div className={`text-[100px] leading-none font-black tracking-tighter ${reportB ? getScoreColor(reportB.overallScore) : 'text-zinc-700'}`}>
            {reportB?.overallScore ?? '—'}
          </div>
          {overallWinner?.winner === 'b' && (
            <div className="mt-6 flex items-center gap-2 border border-[#22c55e] bg-[#22c55e]/10 px-4 py-2">
              <Trophy className="h-4 w-4 text-[#22c55e]" />
              <span className="text-xs font-mono font-bold text-[#22c55e] uppercase tracking-widest">Better Overall Performance</span>
            </div>
          )}
        </div>
      </div>

      {/* Gemini AI Comparison */}
      {reportA && reportB && (
        <GeminiComparisonSection
          reportA={reportA}
          reportB={reportB}
          onComparisonReady={setGeminiForPdf}
        />
      )}

      {/* Category Scores Grid */}
      {reportA && reportB && (
        <div className="mt-12">
          <h3 className="text-2xl font-extrabold text-white uppercase tracking-tight mb-6">Category Breakdown</h3>
          <div className="space-y-6">
            {categories.map((cat) => {
              const sa = reportA.scores[cat.key];
              const sb = reportB.scores[cat.key];
              const w = computeWinner(sa, sb);
              return (
                <div key={cat.key} className="border border-white/20 p-6 bg-black">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <span className="text-white">{cat.icon}</span>
                    <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{cat.label}</h4>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Site A */}
                    <div className="flex-1 flex flex-col items-end">
                      <span className={`text-2xl font-black mb-2 ${w.winner === 'b' ? 'opacity-50' : ''} ${getScoreColor(sa)}`}>{sa}</span>
                      <div className="w-full bg-white/10 h-3 flex justify-end overflow-hidden">
                        <div className={`h-full ${getScoreColor(sa, true)} ${w.winner === 'b' ? 'opacity-50' : ''}`} style={{ width: `${sa}%` }}></div>
                      </div>
                    </div>
                    {/* VS */}
                    <div className="text-zinc-600 font-black text-sm px-4">VS</div>
                    {/* Site B */}
                    <div className="flex-1 flex flex-col items-start">
                      <span className={`text-2xl font-black mb-2 ${w.winner === 'a' ? 'opacity-50' : ''} ${getScoreColor(sb)}`}>{sb}</span>
                      <div className="w-full bg-white/10 h-3 flex justify-start overflow-hidden">
                        <div className={`h-full ${getScoreColor(sb, true)} ${w.winner === 'a' ? 'opacity-50' : ''}`} style={{ width: `${sb}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Core Web Vitals */}
      {reportA && reportB && (
        <div className="mt-16 border-t border-white/20 pt-8">
          <h3 className="text-2xl font-extrabold text-white uppercase tracking-tight mb-6">Core Web Vitals</h3>
          <div className="space-y-4">
            {(Object.keys(reportA.metrics) as (keyof AuditReport['metrics'])[]).map((key) => {
              const ma = reportA.metrics[key];
              const mb = reportB.metrics[key];
              const w = computeWinner(ma.score, mb.score);
              return (
                <div key={key} className="border border-white/20 p-4 bg-black flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="sm:w-1/4 text-center sm:text-left">
                    <span className="text-sm font-bold text-white uppercase">{ma.label}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-4">
                    {/* Site A */}
                    <div className={`flex-1 flex flex-col items-end text-right ${w.winner === 'b' ? 'opacity-50' : ''}`}>
                      <span className={`text-sm font-mono font-bold ${getScoreColor(ma.score)}`}>{ma.value}</span>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">{ma.status}</span>
                    </div>
                    
                    {/* Divider / Winner */}
                    <div className="px-4 flex flex-col items-center justify-center">
                      {w.winner === 'tie' ? (
                        <span className="text-[10px] font-mono text-zinc-600 uppercase">Tie</span>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <Trophy className={`h-4 w-4 ${w.winner === 'a' ? getScoreColor(ma.score) : getScoreColor(mb.score)}`} />
                        </div>
                      )}
                    </div>
                    
                    {/* Site B */}
                    <div className={`flex-1 flex flex-col items-start text-left ${w.winner === 'a' ? 'opacity-50' : ''}`}>
                      <span className={`text-sm font-mono font-bold ${getScoreColor(mb.score)}`}>{mb.value}</span>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">{mb.status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

// ---------------------------------------------------------------------------
// Page export
// ---------------------------------------------------------------------------
export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col flex-grow items-center justify-center bg-black min-h-[70vh] text-white">
          <div className="flex flex-col items-center gap-4">
            <div className="h-4 w-4 bg-[#FF5500] animate-pulse"></div>
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">Initializing comparison...</p>
          </div>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
