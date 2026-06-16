'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  RefreshCw,
  Terminal,
  ShieldCheck,
  Zap,
  Search,
  Accessibility,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  FileDown,
  Loader2,
} from 'lucide-react';
import { AuditReport, ScoreMetric, GeminiAnalysis, GeminiIssue } from '@/types/audit';

// ---------------------------------------------------------------------------
// CountUp Animation Component
// ---------------------------------------------------------------------------
function CountUp({ value, duration = 1.5, className = '' }: { value: number; duration?: number; className?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(end);
      return;
    }
    let startTime: number;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span className={className}>{count}</span>;
}

// ---------------------------------------------------------------------------
// Gemini AI Analysis section component
// ---------------------------------------------------------------------------

function PriorityBadge({ priority }: { priority: GeminiIssue['priority'] }) {
  const styles: Record<GeminiIssue['priority'], string> = {
    critical: 'border-[#FF5500] text-[#FF5500]',
    high: 'border-orange-400 text-orange-400',
    medium: 'border-zinc-400 text-zinc-400',
    low: 'border-zinc-600 text-zinc-600',
  };
  return (
    <span className={`text-[10px] font-mono uppercase border px-1.5 py-0.5 ${styles[priority]}`}>
      {priority}
    </span>
  );
}

function GeminiSection({
  report,
  onAnalysisReady,
}: {
  report: AuditReport;
  onAnalysisReady?: (analysis: GeminiAnalysis) => void;
}) {
  const [analysis, setAnalysis] = useState<GeminiAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      setAnalysis(null);

      try {
        const res = await fetch('/api/gemini-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(report),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.details || err.error || `HTTP ${res.status}`);
        }

        const data: GeminiAnalysis = await res.json();
        if (!cancelled) {
          setAnalysis(data);
          setLoading(false);
          onAnalysisReady?.(data);
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
  }, [report.url, report.overallScore]);

  // Loading state
  if (loading) {
    return (
      <div className="mt-16 border-t border-white/20 pt-8">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="h-5 w-5 text-[#FF5500]" />
          <h2 className="text-2xl font-extrabold text-white uppercase tracking-tight">
            AI Analysis
          </h2>
          <span className="text-[10px] font-mono text-[#FF5500] border border-[#FF5500]/30 px-2 py-0.5 uppercase tracking-widest">
            Gemini 2.5 Flash
          </span>
        </div>
        <div className="border border-white/20 p-8 bg-black">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-3 w-3 bg-[#FF5500] animate-pulse"></div>
            <p className="text-sm font-mono text-zinc-400 uppercase tracking-widest">
              Generating expert analysis...
            </p>
          </div>
          <div className="space-y-3">
            {['Executive summary', 'Identifying top issues', 'Prioritizing recommendations', 'Compiling quick wins'].map((step, i) => (
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

  // Error state
  if (error) {
    return (
      <div className="mt-16 border-t border-white/20 pt-8">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="h-5 w-5 text-zinc-600" />
          <h2 className="text-2xl font-extrabold text-white uppercase tracking-tight">
            AI Analysis
          </h2>
        </div>
        <div className="border border-[#FF5500]/30 p-6 bg-[#FF5500]/5">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="h-4 w-4 text-[#FF5500]" />
            <h4 className="text-sm font-bold text-white uppercase tracking-widest">
              Gemini Analysis Unavailable
            </h4>
          </div>
          <p className="text-xs font-mono text-zinc-400 leading-relaxed">{error}</p>
          <p className="text-[10px] font-mono text-zinc-600 mt-3">
            Ensure GEMINI_API_KEY is set in .env.local and the key has Gemini API access.
          </p>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const verdictStyles: Record<GeminiAnalysis['verdict'], string> = {
    Excellent: 'border-white text-white',
    Good: 'border-zinc-300 text-zinc-300',
    Fair: 'border-zinc-500 text-zinc-500',
    Poor: 'border-[#FF5500] text-[#FF5500]',
  };

  return (
    <div className="mt-16 border-t border-white/20 pt-8">
      {/* Section header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-[#FF5500]" />
          <h2 className="text-2xl font-extrabold text-white uppercase tracking-tight">
            AI Analysis
          </h2>
          <span className="text-[10px] font-mono text-[#FF5500] border border-[#FF5500]/30 px-2 py-0.5 uppercase tracking-widest">
            Gemini 2.5 Flash
          </span>
        </div>
        <div className={`ml-auto text-xs font-mono uppercase border px-3 py-1 tracking-widest ${verdictStyles[analysis.verdict]}`}>
          Verdict: {analysis.verdict}
        </div>
      </div>

      {/* Executive Summary */}
      <div className="border border-white/20 p-6 bg-black mb-6">
        <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">
          Executive Summary
        </h3>
        <p className="text-sm text-zinc-200 leading-relaxed font-light">
          {analysis.executiveSummary}
        </p>
      </div>

      {/* Top Issues */}
      <div className="mb-6">
        <h3 className="text-lg font-extrabold text-white uppercase tracking-tight mb-4">
          Prioritized Issues
        </h3>
        <div className="border border-white/20">
          {analysis.topIssues.map((issue, index) => {
            const isExpanded = expandedIssue === `${index}`;
            return (
              <div
                key={index}
                className={`bg-black ${index !== analysis.topIssues.length - 1 ? 'border-b border-white/20' : ''}`}
              >
                <button
                  onClick={() => setExpandedIssue(isExpanded ? null : `${index}`)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <PriorityBadge priority={issue.priority} />
                    <span className="text-sm font-bold text-white uppercase tracking-wide">
                      {issue.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 pl-4 flex-shrink-0">
                    <span className="text-[10px] font-mono text-[#FF5500] hidden md:block">
                      {issue.estimatedImpact}
                    </span>
                    {isExpanded
                      ? <ChevronUp className="h-4 w-4 text-zinc-500" />
                      : <ChevronDown className="h-4 w-4 text-zinc-500" />
                    }
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-white/10 bg-zinc-950">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                      <div>
                        <h5 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <AlertTriangle className="h-3 w-3" /> Problem
                        </h5>
                        <p className="text-xs text-zinc-300 font-mono leading-relaxed">
                          {issue.description}
                        </p>
                        <div className="mt-4 inline-flex items-center gap-2 text-[10px] font-mono text-[#FF5500] border border-[#FF5500]/20 px-2 py-1">
                          Expected: {issue.estimatedImpact}
                        </div>
                      </div>
                      <div className="border-l border-white/10 pl-8">
                        <h5 className="font-mono text-[10px] text-[#FF5500] uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Terminal className="h-3 w-3" /> Recommended Fix
                        </h5>
                        <p className="text-xs text-white font-mono leading-relaxed">
                          {issue.fix}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Wins + Strategic grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Wins */}
        <div className="border border-white/20 p-6 bg-black">
          <h3 className="text-[10px] font-mono text-[#FF5500] uppercase tracking-widest mb-4">
            Quick Wins / &lt;1hr
          </h3>
          <ul className="space-y-3">
            {analysis.quickWins.map((win, i) => (
              <li key={i} className="flex items-start gap-3 text-xs font-mono text-zinc-300 leading-relaxed">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#FF5500] mt-0.5 flex-shrink-0" />
                {win}
              </li>
            ))}
          </ul>
        </div>

        {/* Strategic Recommendations */}
        <div className="border border-white/20 p-6 bg-black">
          <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4">
            Strategic Recommendations
          </h3>
          <ul className="space-y-3">
            {analysis.strategicRecommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 text-xs font-mono text-zinc-400 leading-relaxed">
                <span className="text-zinc-600 font-bold flex-shrink-0">{i + 1}.</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-4 text-[10px] font-mono text-zinc-700 text-right">
        Generated by Gemini 2.5 Flash · {new Date(analysis.generatedAt).toLocaleString()}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main audit results content
// ---------------------------------------------------------------------------

function AuditResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawUrl = searchParams.get('url') || '';

  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [error, setError] = useState<{ message: string; details?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'high' | 'medium' | 'passed'>('all');
  const [expandedRecId, setExpandedRecId] = useState<string | null>(null);
  const [geminiAnalysisForPdf, setGeminiAnalysisForPdf] = useState<GeminiAnalysis | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const [inputUrl, setInputUrl] = useState('');
  const [formError, setFormError] = useState('');

  const loadingSteps = [
    { text: 'Analyzing Performance...', time: '0.45s' },
    { text: 'Checking Accessibility...', time: '0.89s' },
    { text: 'Reviewing SEO...', time: '1.24s' },
    { text: 'Evaluating Best Practices...', time: '1.76s' },
    { text: 'Generating AI Recommendations...', time: '2.01s' },
  ];

  useEffect(() => {
    if (!rawUrl) return;

    const abortController = new AbortController();
    let stepInterval: NodeJS.Timeout;

    const runInit = async () => {
      setLoading(true);
      setError(null);
      setLoadingStep(0);
      setReport(null);

      let currentStep = 0;
      stepInterval = setInterval(() => {
        if (currentStep < 4) {
          currentStep += 1;
          setLoadingStep(currentStep);
        }
      }, 400);

      try {
        const response = await fetch(`/api/audit?url=${encodeURIComponent(rawUrl)}`, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(
            JSON.stringify({
              message: errData.error || 'Failed to analyze website',
              details:
                errData.details || 'PageSpeed API returned an unexpected error status.',
            })
          );
        }

        const data: AuditReport = await response.json();

        clearInterval(stepInterval);
        setLoadingStep(5);

        setReport(data);
        setLoading(false);
      } catch (err: unknown) {
        if ((err as Error)?.name === 'AbortError') return;

        clearInterval(stepInterval);

        setError({ 
          message: 'Analysis failed. Please try again.', 
          details: 'We were unable to complete the audit. Please check the URL and try again.' 
        });
        setLoading(false);
      }
    };

    runInit();

    return () => {
      abortController.abort();
      if (stepInterval) clearInterval(stepInterval);
    };
  }, [rawUrl, searchParams]);

  const handleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = inputUrl.trim();
    if (!url) {
      setFormError('Please enter a website URL');
      return;
    }
    router.push(`/audit?url=${encodeURIComponent(url.toLowerCase())}`);
  };

  if (!rawUrl) {
    return (
      <div className="flex flex-col flex-grow items-center justify-center px-4 py-24 bg-black min-h-[70vh]">
        <div className="max-w-xl w-full p-8 border border-white/20 bg-black">
          <Sparkles className="h-8 w-8 text-[#FF5500] mb-4" />
          <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-2">Run Audit</h2>
          <p className="text-xs text-zinc-400 font-mono mb-8">Enter a URL to run a comprehensive performance audit.</p>
          
          <form onSubmit={handleAuditSubmit} className="space-y-4">
            <div className="flex items-center px-4 gap-3 bg-black border border-white/20 focus-within:border-[#FF5500] transition-colors">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest w-8 flex-shrink-0">URL</span>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => { setInputUrl(e.target.value); if (formError) setFormError(''); }}
                placeholder="Target URL (e.g., stripe.com)"
                className="w-full bg-transparent py-3 text-white placeholder-zinc-600 focus:outline-none text-sm font-mono"
              />
            </div>
            
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#FF5500] hover:bg-[#E64C00] text-white font-bold px-8 py-4 transition-colors uppercase tracking-wider text-sm mt-4"
            >
              Start Analysis
            </button>
            
            {formError && (
              <p className="mt-3 text-sm text-[#FF5500] text-left font-mono flex items-center gap-2">
                <span className="h-1 w-1 bg-[#FF5500]"></span> {formError}
              </p>
            )}
          </form>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative flex flex-col flex-grow items-center justify-center px-4 py-24 bg-black min-h-[70vh]">
        <div className="absolute inset-0 grid-bg-sharp opacity-30 pointer-events-none"></div>
        <div className="max-w-xl w-full p-8 border border-[#FF5500]/50 bg-black relative z-10">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-[#FF5500]/30">
            <AlertTriangle className="h-6 w-6 text-[#FF5500]" />
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-widest">
                Audit Failed
              </h2>
              <p className="text-xs text-[#FF5500] font-mono">{rawUrl}</p>
            </div>
          </div>
          <div className="bg-[#FF5500]/10 border border-[#FF5500]/20 p-4 mb-8">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest">
              {error.message}
            </h4>
            {error.details && (
              <p className="text-xs text-zinc-400 mt-2 font-mono leading-relaxed">
                {error.details}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex-1 text-center py-3 border border-white/20 hover:border-white/50 text-xs font-mono text-white transition-colors uppercase tracking-widest"
            >
              Cancel
            </Link>
            <button
              onClick={() =>
                router.push(
                  `/audit?url=${encodeURIComponent(rawUrl)}&refresh=${Date.now()}`
                )
              }
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#FF5500] hover:bg-[#E64C00] text-xs font-mono text-white transition-colors uppercase tracking-widest"
            >
              <RefreshCw className="h-4 w-4" /> Restart
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading || !report) {
    return (
      <div className="relative flex flex-col flex-grow items-center justify-center px-4 py-24 bg-black min-h-[70vh]">
        <div className="absolute inset-0 grid-bg-sharp opacity-30 pointer-events-none"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full p-8 border border-white/20 bg-black relative z-10 shadow-2xl"
        >
          <div className="flex justify-between items-end mb-8 pb-4 border-b border-white/20">
            <div>
              <h2 className="text-2xl font-extrabold text-white uppercase tracking-tight">
                System Diagnostic
              </h2>
              <p className="text-xs text-[#FF5500] font-mono mt-1">TARGET: {rawUrl}</p>
            </div>
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="h-6 w-6 border-2 border-white/20 border-t-[#FF5500] rounded-full"
            ></motion.div>
          </div>
          
          <div className="space-y-6 font-mono">
            {loadingSteps.map((step, idx) => {
              const isDone = idx < loadingStep;
              const isCurrent = idx === loadingStep;
              if (!isDone && !isCurrent) return null;
              return (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx}
                  className="flex items-center gap-4"
                >
                  <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
                     {isDone ? (
                       <CheckCircle2 className="w-5 h-5 text-green-500" />
                     ) : (
                       <div className="w-2 h-2 rounded-full bg-[#FF5500] animate-ping"></div>
                     )}
                  </div>
                  <div className="flex-1">
                     <div className={`text-sm ${isCurrent ? 'text-white' : 'text-zinc-500'}`}>
                        {step.text}
                     </div>
                     {isCurrent && (
                        <div className="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: "100%" }}
                             transition={{ duration: 0.4 }}
                             className="h-full bg-[#FF5500]"
                           ></motion.div>
                        </div>
                     )}
                  </div>
                  <div className="text-xs text-zinc-600 shrink-0">
                     {isDone ? `[${step.time}]` : ''}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-[#22c55e]'; // Green
    if (score >= 50) return 'text-[#f97316]'; // Orange
    return 'text-[#ef4444]'; // Red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'OPTIMAL';
    if (score >= 50) return 'NEEDS WORK';
    return 'CRITICAL';
  };

  const getImpactBadge = (impact: 'high' | 'medium' | 'passed') => {
    switch (impact) {
      case 'high':
        return (
          <span className="text-[10px] font-mono text-[#FF5500] uppercase border border-[#FF5500]/30 px-1">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="text-[10px] font-mono text-zinc-400 uppercase border border-white/20 px-1">
            Med
          </span>
        );
      case 'passed':
        return (
          <span className="text-[10px] font-mono text-white uppercase border border-white/20 px-1">
            Pass
          </span>
        );
    }
  };

  const filteredRecs = report.recommendations.filter((rec) => {
    if (activeTab === 'all') return true;
    return rec.impact === activeTab;
  });

  const handleExportPdf = async () => {
    if (!report || pdfLoading) return;
    setPdfLoading(true);
    setPdfError(null);
    try {
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report, analysis: geminiAnalysisForPdf }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.details || err.error || `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = `zekoaudit-${report.url.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(objectUrl);
    } catch {
      setPdfError('Failed to generate PDF. Please try again later.');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-12 sm:px-6 lg:px-8 flex-grow bg-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between pb-8 border-b border-white/20 gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase mb-4"
          >
            <ArrowLeft className="h-3 w-3" /> Back to System
          </Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-white uppercase">
            Engineering Report
          </h1>
          <p className="text-xs text-[#FF5500] font-mono mt-2">
            TARGET: {report.url} &bull; {report.date}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Export PDF */}
          <button
            id="export-pdf-btn"
            onClick={handleExportPdf}
            disabled={pdfLoading}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF5500] hover:bg-[#E64C00] disabled:opacity-50 disabled:cursor-not-allowed text-xs font-mono text-white transition-colors uppercase"
            title="Download professional PDF report"
          >
            {pdfLoading
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <FileDown className="h-3.5 w-3.5" />}
            {pdfLoading ? 'Generating...' : 'Export PDF'}
          </button>

          {/* Re-execute */}
          <button
            onClick={() => {
              setLoading(true);
              setLoadingStep(0);
              router.push(
                `/audit?url=${encodeURIComponent(report.url)}&refresh=${Date.now()}`
              );
            }}
            className="flex items-center gap-2 px-4 py-2 border border-white/20 hover:border-[#FF5500] hover:text-[#FF5500] text-xs font-mono text-white transition-colors uppercase"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Re-execute
          </button>
        </div>
      </div>

      {/* PDF error toast */}
      {pdfError && (
        <div className="mt-4 flex items-center gap-3 border border-[#FF5500]/30 bg-[#FF5500]/5 px-4 py-2 text-xs font-mono text-[#FF5500]">
          <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
          PDF export failed: {pdfError}
        </div>
      )}

      {/* Scores grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 mt-12 border border-white/20">
        {/* Overall Score */}
        <div className="p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/20 flex flex-col items-center justify-center text-center bg-black">
          <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">
            Master Grade
          </h3>
          <div className="text-[120px] leading-none font-black tracking-tighter text-white">
            <CountUp value={report.overallScore} duration={2} />
          </div>
          <div className="mt-6">
            <div
              className={`px-4 py-1 border text-[10px] font-mono uppercase tracking-widest ${
                report.overallScore >= 90
                  ? 'border-[#22c55e] text-[#22c55e]'
                  : report.overallScore >= 50
                  ? 'border-[#f97316] text-[#f97316]'
                  : 'border-[#ef4444] text-[#ef4444]'
              }`}
            >
              {report.overallScore >= 90
                ? 'EXCELLENT'
                : report.overallScore >= 75
                ? 'GOOD'
                : report.overallScore >= 50
                ? 'SUBOPTIMAL'
                : 'CRITICAL'}
            </div>
          </div>
        </div>

        {/* Four pillars */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-0 bg-black">
          {/* Performance */}
          <div className="p-6 md:p-8 border-b border-r border-white/20 flex flex-col justify-between hover:bg-white/5 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                Performance
              </h4>
              <Zap className={`h-4 w-4 ${getScoreColor(report.scores.performance)}`} />
            </div>
            <div>
              <span className={`text-5xl font-black block leading-none ${getScoreColor(report.scores.performance)}`}>
                <CountUp value={report.scores.performance} />
              </span>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-3">
                {getScoreLabel(report.scores.performance)}
              </p>
            </div>
          </div>
          
          {/* SEO */}
          <div className="p-6 md:p-8 border-b border-white/20 flex flex-col justify-between hover:bg-white/5 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                Search Engine
              </h4>
              <Search className={`h-4 w-4 ${getScoreColor(report.scores.seo)}`} />
            </div>
            <div>
              <span className={`text-5xl font-black block leading-none ${getScoreColor(report.scores.seo)}`}>
                <CountUp value={report.scores.seo} />
              </span>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-3">
                {getScoreLabel(report.scores.seo)}
              </p>
            </div>
          </div>

          {/* Accessibility */}
          <div className="p-6 md:p-8 border-r border-white/20 flex flex-col justify-between hover:bg-white/5 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                Accessibility
              </h4>
              <Accessibility className={`h-4 w-4 ${getScoreColor(report.scores.accessibility)}`} />
            </div>
            <div>
              <span className={`text-5xl font-black block leading-none ${getScoreColor(report.scores.accessibility)}`}>
                <CountUp value={report.scores.accessibility} />
              </span>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-3">
                {getScoreLabel(report.scores.accessibility)}
              </p>
            </div>
          </div>

          {/* Best Practices */}
          <div className="p-6 md:p-8 flex flex-col justify-between hover:bg-white/5 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                Best Practices
              </h4>
              <ShieldCheck className={`h-4 w-4 ${getScoreColor(report.scores.bestPractices)}`} />
            </div>
            <div>
              <span className={`text-5xl font-black block leading-none ${getScoreColor(report.scores.bestPractices)}`}>
                <CountUp value={report.scores.bestPractices} />
              </span>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-3">
                {getScoreLabel(report.scores.bestPractices)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Vectors */}
      <div className="mt-16 border-t border-white/20 pt-8">
        <h3 className="text-2xl font-extrabold text-white uppercase tracking-tight mb-6">
          Core Vectors
        </h3>
        <div className="grid grid-cols-1 border border-white/20">
          {Object.entries(report.metrics).map(
            ([key, metric]: [string, ScoreMetric], index) => (
              <div
                key={key}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-black ${
                  index !== Object.keys(report.metrics).length - 1
                    ? 'border-b border-white/10'
                    : ''
                } hover:bg-white/5 transition-colors`}
              >
                <div className="flex items-center gap-4 w-full sm:w-1/3 mb-2 sm:mb-0">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase w-16">
                    [{key.substring(0, 3).toUpperCase()}]
                  </span>
                  <span className="text-sm font-bold text-white uppercase tracking-wide">
                    {metric.label}
                  </span>
                </div>
                <div className="w-full sm:w-1/3 flex justify-start sm:justify-center mb-2 sm:mb-0">
                  <span
                    className={`text-xl font-mono font-bold ${
                      metric.status === 'poor' ? 'text-[#ef4444]' : metric.status === 'average' ? 'text-[#f97316]' : 'text-[#22c55e]'
                    }`}
                  >
                    {metric.value}
                  </span>
                </div>
                <div className="w-full sm:w-1/3 flex justify-start sm:justify-end">
                  <span
                    className={`text-xs font-mono uppercase px-2 py-0.5 border ${
                      metric.status === 'poor'
                        ? 'border-[#ef4444] text-[#ef4444]'
                        : metric.status === 'average'
                        ? 'border-[#f97316] text-[#f97316]'
                        : 'border-[#22c55e] text-[#22c55e]'
                    }`}
                  >
                    Score: {metric.score}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Gemini AI Analysis — renders independently after PageSpeed data arrives */}
      <GeminiSection report={report} onAnalysisReady={setGeminiAnalysisForPdf} />

      {/* Lighthouse Diagnostics & Actions */}
      <div className="mt-16 border-t border-white/20 pt-8">
        <div className="flex flex-col md:flex-row items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-tight">
              Lighthouse Diagnostics
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              / RAW PAGESPEED AUDIT DATA
            </p>
          </div>
          <div className="flex mt-4 md:mt-0 font-mono text-[10px] border border-white/20 bg-black">
            {(['all', 'high', 'medium', 'passed'] as const).map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 uppercase tracking-widest ${
                  i > 0 ? 'border-l border-white/20' : ''
                } ${
                  activeTab === tab
                    ? tab === 'high'
                      ? 'bg-[#FF5500] text-black font-bold'
                      : tab === 'all'
                      ? 'bg-white text-black font-bold'
                      : 'bg-zinc-700 text-white font-bold'
                    : tab === 'high'
                    ? 'text-[#FF5500] hover:text-[#FF5500]/80'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab === 'all'
                  ? 'All'
                  : tab === 'high'
                  ? 'High'
                  : tab === 'medium'
                  ? 'Med'
                  : 'Pass'}
              </button>
            ))}
          </div>
        </div>

        {filteredRecs.length === 0 ? (
          <div className="p-8 text-center border border-white/20 bg-black font-mono text-xs text-zinc-500 uppercase tracking-widest">
            NO DATA FOUND
          </div>
        ) : (
          <div className="border border-white/20">
            {filteredRecs.map((rec, index) => {
              const isExpanded = expandedRecId === rec.id;
              return (
                <div
                  key={rec.id}
                  className={`bg-black ${
                    index !== filteredRecs.length - 1 ? 'border-b border-white/20' : ''
                  }`}
                >
                  <div
                    onClick={() => setExpandedRecId(isExpanded ? null : rec.id)}
                    className={`p-4 sm:p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors border-l-4 ${
                      rec.impact === 'high'
                        ? 'border-l-[#ef4444]'
                        : rec.impact === 'medium'
                        ? 'border-l-[#f97316]'
                        : 'border-l-[#22c55e]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {getImpactBadge(rec.impact)}
                      <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                        {rec.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-6">
                      <span
                    className={`text-[10px] font-mono hidden md:block ${
                      rec.impact === 'passed' ? 'text-zinc-500' : rec.impact === 'high' ? 'text-red-500' : 'text-orange-500'
                    }`}
                  >
                        {rec.improvement}
                      </span>
                      <span className="font-mono text-zinc-500 text-lg">
                        {isExpanded ? '-' : '+'}
                      </span>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-white/10 bg-zinc-950">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                        <div>
                          <h5 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-3 w-3" /> Technical Analysis
                          </h5>
                          <p className="text-xs text-zinc-300 font-mono leading-relaxed">
                            {rec.description}
                          </p>
                        </div>
                        <div className="border-l border-white/10 pl-8">
                          <h5 className="font-mono text-[10px] text-[#FF5500] uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Terminal className="h-3 w-3" /> Suggested Patch
                          </h5>
                          <p className="text-xs text-white font-mono leading-relaxed">
                            {rec.solution}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page export
// ---------------------------------------------------------------------------

export default function AuditPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col flex-grow items-center justify-center bg-black min-h-[70vh] text-white">
          <div className="flex flex-col items-center gap-4">
            <div className="h-4 w-4 bg-[#FF5500] animate-pulse"></div>
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">
              Booting diagnostic sequence...
            </p>
          </div>
        </div>
      }
    >
      <AuditResultsContent />
    </Suspense>
  );
}
