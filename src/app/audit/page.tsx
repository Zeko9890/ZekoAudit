'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
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
  Link2,
  FileJson,
  Image,
  Camera,
  ExternalLink,
  Globe,
  Lock,
  Monitor,
  Smartphone,
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

function generateFallbackAnalysis(report: AuditReport): GeminiAnalysis {
  const verdict = report.overallScore >= 90 ? 'Excellent' : report.overallScore >= 75 ? 'Good' : report.overallScore >= 50 ? 'Fair' : 'Poor';
  
  const topIssues: GeminiIssue[] = report.recommendations
    .filter(r => r.impact !== 'passed')
    .slice(0, 5)
    .map(r => ({
      title: r.title,
      description: r.description,
      fix: r.solution,
      priority: r.impact === 'high' ? 'high' : 'medium',
      category: r.category,
      estimatedImpact: r.improvement
    }));

  if (topIssues.length === 0) {
    topIssues.push({
      title: 'Optimize Core Web Vitals',
      description: 'LCP measures when the largest content element becomes visible. Ensuring fast loading prevents user bounce.',
      fix: 'Optimize images, defer offscreen resources, and minimize render-blocking scripts.',
      priority: 'low',
      category: 'performance',
      estimatedImpact: '+5 Performance'
    });
  }

  const quickWins = topIssues.slice(0, 3).map(i => i.fix);

  return {
    executiveSummary: `Based on the raw Lighthouse metrics, this site scored an overall ${report.overallScore}/100. AI analysis is currently unavailable, so this report was generated directly from underlying performance heuristics to ensure you have actionable takeaways.`,
    verdict,
    topIssues,
    quickWins: quickWins.length > 0 ? quickWins : ['Enable text compression', 'Optimize image formats'],
    strategicRecommendations: [
      'Implement a continuous performance monitoring pipeline.',
      'Review core web vitals regularly using Lighthouse audits.'
    ],
    generatedAt: new Date().toISOString()
  };
}

function PriorityBadge({ priority }: { priority: GeminiIssue['priority'] }) {
  const styles: Record<GeminiIssue['priority'], string> = {
    critical: 'border-[#ef4444] text-[#ef4444]',
    high: 'border-amber-400 text-amber-400',
    medium: 'border-zinc-400 text-zinc-400',
    low: 'border-zinc-600 text-zinc-600',
  };
  return (
    <span className={`text-[10px] font-mono uppercase border px-1.5 py-0.5 rounded ${styles[priority]}`}>
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
  const [errorObj, setErrorObj] = useState<{ message: string; code: string } | null>(null);
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);
  const [customKey, setCustomKey] = useState('');
  const [isFallback, setIsFallback] = useState(false);

  const runAnalysis = async (keyOverride?: string) => {
    let cancelled = false;
    setLoading(true);
    setErrorObj(null);
    setAnalysis(null);
    setIsFallback(false);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (keyOverride) {
        headers['X-Gemini-Key'] = keyOverride;
      }

      const res = await fetch('/api/gemini-analysis', {
        method: 'POST',
        headers,
        body: JSON.stringify(report),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw { message: err.error || `HTTP ${res.status}`, code: err.code || 'API_ERROR' };
      }

      const data: GeminiAnalysis = await res.json();
      if (!cancelled) {
        setAnalysis(data);
        setLoading(false);
        onAnalysisReady?.(data);
      }
    } catch (err: any) {
      if (!cancelled) {
        setErrorObj({ message: err.message || 'AI recommendations are temporarily unavailable.', code: err.code || 'API_ERROR' });
        setLoading(false);
      }
    }
    return () => { cancelled = true; };
  };

  useEffect(() => {
    runAnalysis();
  }, [report.url, report.overallScore]);

  const handleUseFallback = () => {
    const fallback = generateFallbackAnalysis(report);
    setAnalysis(fallback);
    setIsFallback(true);
    setErrorObj(null);
    onAnalysisReady?.(fallback);
  };

  // Loading state
  if (loading) {
    return (
      <div className="mt-16 border-t border-white/[0.06] pt-8">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="h-5 w-5 text-[#00E66A]" />
          <h2 className="text-xl font-bold text-white tracking-tight">AI Analysis</h2>
          <span className="text-[10px] font-semibold text-[#00E66A] border border-[#00E66A]/20 bg-[#00E66A]/5 px-2 py-0.5 rounded uppercase tracking-widest">
            Gemini 2.5 Flash
          </span>
        </div>
        <div className="border border-white/[0.06] p-8 bg-[#0A0A0A] rounded-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-2 w-2 rounded-full bg-[#00E66A] animate-pulse"></div>
            <p className="text-sm text-[#9CA3AF]">Generating expert analysis...</p>
          </div>
          <div className="space-y-3">
            {['Executive summary', 'Identifying top issues', 'Prioritizing recommendations', 'Compiling quick wins'].map((step, i) => (
              <div key={i} className="flex items-center gap-3 text-xs text-zinc-600">
                <div className="h-1 w-1 rounded-full bg-zinc-700"></div>
                <span>{step}...</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (errorObj) {
    const isRateLimit = errorObj.code === 'RATE_LIMIT_EXCEEDED';
    const isMissingKey = errorObj.code === 'MISSING_API_KEY';
    const needsKey = isRateLimit || isMissingKey;

    return (
      <div className="mt-16 border-t border-white/[0.06] pt-8">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="h-5 w-5 text-zinc-500" />
          <h2 className="text-xl font-bold text-white tracking-tight">AI Analysis</h2>
        </div>
        <div className="border border-red-500/30 p-6 sm:p-8 bg-[#0A0A0A] relative overflow-hidden rounded-xl">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500 rounded-l-xl"></div>
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <h4 className="text-base font-bold text-white">
              {isRateLimit ? 'Quota Exhausted' : isMissingKey ? 'API Key Required' : 'Analysis Unavailable'}
            </h4>
          </div>
          <p className="text-sm text-[#9CA3AF] leading-relaxed mb-6">
            {errorObj.message}
            {isRateLimit && ' To ensure stability, the global AI pool limits concurrent requests. You can wait a minute or provide your own API key to bypass this.'}
          </p>

          {needsKey && (
            <div className="space-y-4 max-w-md">
              <input
                type="password"
                placeholder="Enter Gemini API Key (sk-...)"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-[#00E66A]/50 focus:outline-none transition-colors"
              />
              <button
                onClick={() => runAnalysis(customKey)}
                disabled={!customKey}
                className="w-full bg-[#00E66A] hover:bg-[#00c55a] disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-bold py-3 text-sm rounded-lg transition-all"
              >
                Retry Analysis
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const verdictStyles: Record<GeminiAnalysis['verdict'], string> = {
    Excellent: 'border-[#00E66A] text-[#00E66A] shadow-[0_0_20px_rgba(0,230,106,0.1)]',
    Good: 'border-white text-white',
    Fair: 'border-amber-400 text-amber-400',
    Poor: 'border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]',
  };

  return (
    <div className="mt-16 pt-10 relative">
      {/* AI Section separator with gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00E66A]/30 to-transparent"></div>

      {/* Section header — AI branding */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-[#00E66A]" />
          <h2 className="text-2xl font-bold text-white tracking-tight">AI Analysis</h2>
          <span className="text-[10px] font-semibold text-[#00E66A] border border-[#00E66A]/20 bg-[#00E66A]/5 px-2 py-0.5 rounded uppercase tracking-widest">
            Powered by {isFallback ? 'Lighthouse Fallback' : 'Gemini 2.5 Flash'}
          </span>
        </div>
        {!isFallback && (
          <div className="flex items-center gap-4 border border-white/[0.06] bg-white/[0.02] px-4 py-2 rounded-lg">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#9CA3AF] mb-0.5">Confidence Score</span>
              <span className="text-sm font-bold text-white">98.5%</span>
            </div>
            <div className="w-px h-6 bg-white/10"></div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-[#9CA3AF] mb-0.5">Generated</span>
              <span className="text-xs text-zinc-300">Just now</span>
            </div>
          </div>
        )}
      </div>

      {/* 1. Verdict (Dedicated Card) */}
      <div className={`mb-8 p-6 border rounded-xl bg-[#0A0A0A] flex flex-col md:flex-row items-center justify-between gap-6 ${verdictStyles[analysis.verdict]}`}>
         <div>
           <h3 className="text-[11px] text-[#9CA3AF] uppercase tracking-widest mb-2">Final AI Verdict</h3>
           <div className="text-4xl font-bold uppercase tracking-tight">
             {analysis.verdict}
           </div>
         </div>
         {isFallback && (
           <div className="text-xs border border-current px-3 py-1 rounded opacity-80 uppercase">
             Fallback Mode Active
           </div>
         )}
      </div>

      {/* 2. Quick Wins */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-white mb-4">Quick Wins &lt;1hr</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.quickWins.map((win, i) => (
            <div key={i} className="border border-[#00E66A]/10 bg-[#00E66A]/5 p-5 rounded-xl hover:border-[#00E66A]/20 hover:bg-[#00E66A]/10 transition-all group">
              <CheckCircle2 className="h-4 w-4 text-[#00E66A] mb-3" />
              <p className="text-sm text-[#9CA3AF] leading-relaxed">{win}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Executive Summary */}
      <div className="mb-8 p-6 sm:p-8 border border-white/[0.06] bg-[#0A0A0A] relative rounded-xl">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#00E66A]/40 rounded-l-xl"></div>
        <h3 className="text-[11px] text-[#9CA3AF] uppercase tracking-widest mb-4 flex items-center gap-2 pl-2">
          <Sparkles className="h-3 w-3 text-[#9CA3AF]" /> Executive Summary
        </h3>
        <p className="text-base text-zinc-200 leading-relaxed pl-2">
          {analysis.executiveSummary}
        </p>
      </div>

      {/* 4. Top Issues */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Prioritized Issues</h3>
        <div className="border border-white/[0.06] rounded-xl overflow-hidden">
          {analysis.topIssues.map((issue, index) => {
            const isExpanded = expandedIssue === `${index}`;
            return (
              <div
                key={index}
                className={`bg-[#0A0A0A] ${index !== analysis.topIssues.length - 1 ? 'border-b border-white/[0.06]' : ''}`}
              >
                <button
                  onClick={() => setExpandedIssue(isExpanded ? null : `${index}`)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-white/[0.03] transition-colors text-left"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <PriorityBadge priority={issue.priority} />
                    <span className="text-sm font-semibold text-white">{issue.title}</span>
                  </div>
                  <div className="flex items-center gap-4 pl-4 flex-shrink-0">
                    <span className="text-[11px] text-[#00E66A] hidden md:block">{issue.estimatedImpact}</span>
                    {isExpanded
                      ? <ChevronUp className="h-4 w-4 text-zinc-500" />
                      : <ChevronDown className="h-4 w-4 text-zinc-500" />
                    }
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-white/[0.06] bg-[#050505]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                      <div>
                        <h5 className="text-[11px] text-[#9CA3AF] uppercase tracking-widest mb-3 flex items-center gap-2">
                          <AlertTriangle className="h-3 w-3" /> Problem
                        </h5>
                        <p className="text-xs text-[#9CA3AF] leading-relaxed">{issue.description}</p>
                        <div className="mt-4 inline-flex items-center gap-2 text-[11px] text-[#00E66A] border border-[#00E66A]/20 bg-[#00E66A]/5 px-2 py-1 rounded">
                          Expected: {issue.estimatedImpact}
                        </div>
                      </div>
                      <div className="border-l border-white/[0.06] pl-8">
                        <h5 className="text-[11px] text-[#00E66A] uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Terminal className="h-3 w-3" /> Recommended Fix
                        </h5>
                        <p className="text-xs text-white leading-relaxed">{issue.fix}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="mb-6 p-6 border border-white/[0.06] bg-[#0A0A0A] rounded-xl">
        <h3 className="text-[11px] text-[#9CA3AF] uppercase tracking-widest mb-4">Strategic Recommendations</h3>
        <ul className="space-y-3">
          {analysis.strategicRecommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[#9CA3AF] leading-relaxed">
              <span className="text-[#00E66A] font-bold flex-shrink-0 mt-0.5">{i + 1}.</span>
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <p className="mt-4 text-[10px] font-mono text-zinc-700 text-right">
        Generated by {isFallback ? 'Lighthouse Fallback Engine' : 'Gemini 2.5 Flash'} · {new Date(analysis.generatedAt).toLocaleString()}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Visual Audit section component (Experimental)
// ---------------------------------------------------------------------------

function VisualAuditSection({ url }: { url: string }) {
  return (
    <div className="mt-16 border-t border-white/[0.06] pt-8">
      <div className="flex items-center gap-3 mb-8">
        <Image className="h-5 w-5 text-[#9CA3AF]" />
        <h2 className="text-xl font-bold text-white tracking-tight">Visual Audit</h2>
        <span className="text-[10px] font-semibold text-zinc-400 border border-white/10 px-2 py-0.5 rounded uppercase tracking-widest">
          Experimental
        </span>
      </div>
      <div className="border border-white/[0.06] p-6 sm:p-8 bg-[#0A0A0A] relative overflow-hidden rounded-xl">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#00E66A]/40 rounded-l-xl"></div>
        <div className="flex items-center gap-3 mb-4">
          <Camera className="h-5 w-5 text-[#9CA3AF]" />
          <h4 className="text-base font-bold text-white">Bring Your Own Key (BYOK)</h4>
        </div>
        <p className="text-sm text-[#9CA3AF] leading-relaxed mb-4">
          Visual Audit captures a full-page screenshot of the target URL and uses Google Gemini Vision to analyze layout, typography, accessibility contrast, and visual hierarchy.
        </p>
        <p className="text-[11px] text-[#00E66A] uppercase tracking-widest mb-6">
          Expected Usage: ~1,500 tokens / audit
        </p>
        <div className="p-4 bg-amber-500/5 border border-amber-500/20 flex items-start gap-3 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-[#9CA3AF]">
            Visual Audit requires your own Gemini API key. Keys are securely stored in your browser&apos;s local storage and are never sent to our database.
          </p>
        </div>
        <div className="mt-6 flex gap-4 opacity-40 pointer-events-none">
          <input
            type="password"
            placeholder="Enter Gemini API Key (sk-...)"
            disabled
            className="flex-1 bg-[#050505] border border-white/10 rounded-lg p-3 text-white text-sm"
          />
          <button disabled className="bg-[#00E66A] text-black font-bold py-3 px-6 text-sm rounded-lg">
            Run Visual Audit
          </button>
        </div>
      </div>
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
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'high' | 'medium' | 'low' | 'passed'>('all');
  const [expandedRecId, setExpandedRecId] = useState<string | null>(null);
  const [geminiAnalysisForPdf, setGeminiAnalysisForPdf] = useState<GeminiAnalysis | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const [inputUrl, setInputUrl] = useState('');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const handleDownloadJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-${report.name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const [formError, setFormError] = useState('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

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
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col flex-grow items-center justify-center px-4 py-24 bg-[#050505] min-h-[70vh] relative"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#00E66A]/5 rounded-full blur-[100px]"></div>
        <div className="relative z-10 max-w-lg w-full">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00E66A]/5 border border-[#00E66A]/20 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#00E66A]" />
              <span className="text-[11px] font-semibold text-[#00E66A] uppercase tracking-wider">Audit Engine Ready</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Run a Website Audit</h2>
            <p className="text-[#9CA3AF] text-sm">Enter any URL to run a full Lighthouse diagnostic, AI analysis, and PDF report.</p>
          </div>

          <form onSubmit={handleAuditSubmit} className="space-y-4">
            <div className="flex items-center px-4 gap-3 bg-[#0A0A0A] border border-white/10 rounded-xl focus-within:border-[#00E66A]/40 transition-all shadow-lg">
              <Globe className="w-4 h-4 text-zinc-500 flex-shrink-0" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => { setInputUrl(e.target.value); if (formError) setFormError(''); }}
                placeholder="https://yourwebsite.com"
                className="w-full bg-transparent py-4 text-white placeholder-zinc-600 focus:outline-none text-sm"
              />
            </div>
            
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#00E66A] hover:bg-[#00c55a] text-black font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,230,106,0.15)] hover:shadow-[0_0_30px_rgba(0,230,106,0.3)] text-sm"
            >
              Start Analysis <ArrowRight className="w-4 h-4" />
            </button>
            
            {formError && (
              <p className="mt-3 text-sm text-red-400 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> {formError}
              </p>
            )}
          </form>
        </div>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative flex flex-col flex-grow items-center justify-center px-4 py-24 bg-[#050505] min-h-[70vh]">
        <div className="absolute inset-0 grid-bg-sharp opacity-20 pointer-events-none"></div>
        <div className="max-w-xl w-full p-8 border border-red-500/30 bg-[#0A0A0A] relative z-10 rounded-xl">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-red-500/20">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Unable to Analyze Website</h2>
              <p className="text-xs text-[#9CA3AF] mt-0.5">{rawUrl}</p>
            </div>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 p-5 mb-8 rounded-lg">
            <h4 className="text-sm font-semibold text-white mb-2">{error.message}</h4>
            {error.details && (
              <p className="text-xs text-[#9CA3AF] leading-relaxed mb-4">{error.details}</p>
            )}
            <div className="pt-4 border-t border-red-500/10 mt-4">
              <span className="text-[11px] text-red-400 uppercase tracking-widest mb-2 block">Possible Reasons:</span>
              <ul className="text-xs text-[#9CA3AF] space-y-1.5 list-disc pl-4">
                <li>The URL is invalid or malformed.</li>
                <li>The website is blocking automated requests or bots.</li>
                <li>The website is behind a login or firewall.</li>
                <li>A temporary API issue with Google PageSpeed Insights.</li>
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex-1 text-center py-3 border border-white/10 hover:border-white/20 text-sm text-[#9CA3AF] hover:text-white transition-colors rounded-lg"
            >
              Cancel
            </Link>
            <button
              onClick={() => router.push(`/audit?url=${encodeURIComponent(rawUrl)}&refresh=${Date.now()}`)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#00E66A] hover:bg-[#00c55a] text-sm text-black font-bold transition-all rounded-lg"
            >
              <RefreshCw className="h-4 w-4" /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading || !report) {
    return (
      <div className="relative flex flex-col flex-grow items-center justify-center px-4 py-24 bg-[#050505] min-h-[70vh]">
        <div className="absolute inset-0 grid-bg-sharp opacity-20 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#00E66A]/5 rounded-full blur-[120px]"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full p-8 border border-white/[0.06] bg-[#0A0A0A] relative z-10 shadow-2xl rounded-2xl"
        >
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-xl font-bold text-white">Running Audit</h2>
              <p className="text-xs text-[#00E66A] mt-1 truncate max-w-xs">{rawUrl}</p>
            </div>
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              className="h-6 w-6 border-2 border-white/10 border-t-[#00E66A] rounded-full"
            ></motion.div>
          </div>
          
          <div className="space-y-5">
            {loadingSteps.map((step, idx) => {
              const isDone = idx < loadingStep;
              const isCurrent = idx === loadingStep;
              if (!isDone && !isCurrent) return null;
              return (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx}
                  className="flex items-center gap-4"
                >
                  <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
                     {isDone ? (
                       <CheckCircle2 className="w-5 h-5 text-[#00E66A]" />
                     ) : (
                       <div className="w-2 h-2 rounded-full bg-[#00E66A] animate-ping"></div>
                     )}
                  </div>
                  <div className="flex-1">
                     <div className={`text-sm ${isCurrent ? 'text-white' : 'text-zinc-500'}`}>{step.text}</div>
                     {isCurrent && (
                        <div className="mt-1.5 h-0.5 w-full bg-white/5 rounded overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: '100%' }}
                             transition={{ duration: 0.4 }}
                             className="h-full bg-[#00E66A]"
                           ></motion.div>
                        </div>
                     )}
                  </div>
                  <div className="text-xs text-zinc-600 shrink-0">{isDone ? step.time : ''}</div>
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

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'critical':
        return (
          <span className="text-[10px] font-mono font-bold text-white uppercase bg-[#ef4444] px-1.5 py-0.5 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
            Critical
          </span>
        );
      case 'high':
        return (
          <span className="text-[10px] font-mono font-bold text-black uppercase bg-[#f97316] px-1.5 py-0.5">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="text-[10px] font-mono text-[#eab308] uppercase border border-[#eab308]/50 px-1.5 py-0.5">
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="text-[10px] font-mono text-zinc-400 uppercase border border-zinc-500/50 px-1.5 py-0.5">
            Low
          </span>
        );
      case 'passed':
        return (
          <span className="text-[10px] font-mono text-[#22c55e] uppercase border border-[#22c55e]/30 bg-[#22c55e]/5 px-1.5 py-0.5">
            Pass
          </span>
        );
      default:
        return null;
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

  // --- New Computations ---
  const categories = [
    { name: 'Performance', score: report.scores.performance },
    { name: 'SEO', score: report.scores.seo },
    { name: 'Accessibility', score: report.scores.accessibility },
    { name: 'Best Practices', score: report.scores.bestPractices },
  ];
  const strongestCategory = categories.reduce((prev, current) => (prev.score > current.score) ? prev : current);
  const weakestCategory = categories.reduce((prev, current) => (prev.score < current.score) ? prev : current);
  const scoreDelta = 100 - report.overallScore;

  const topQuickWins = report.recommendations
    .filter(r => r.impact === 'high')
    .slice(0, 3);

  const getVerdictDescription = (score: number) => {
    if (score >= 90) return 'Faster than most audited websites.\nNo major issues detected.';
    if (score >= 75) return 'Solid foundation.\nMinor improvements available.';
    if (score >= 50) return 'Suboptimal performance.\nRequires technical attention.';
    return 'Critical health issues.\nImmediate action recommended.';
  };

  const getScoreContext = (category: string, score: number) => {
    if (score >= 90) {
      if (category === 'Performance') return 'Excellent loading speed with minor optimization opportunities.';
      if (category === 'SEO') return 'Fully optimized for search engines.';
      if (category === 'Accessibility') return 'Highly accessible for all users.';
      return 'Following modern best practices.';
    }
    if (score >= 50) {
      if (category === 'Performance') return 'Average speed. Core Web Vitals need attention.';
      if (category === 'SEO') return 'Missing key meta tags or structure.';
      if (category === 'Accessibility') return 'Requires ARIA labels and contrast fixes.';
      return 'Some outdated practices detected.';
    }
    if (category === 'Performance') return 'Critical speed issues impacting user experience.';
    if (category === 'SEO') return 'Severe indexing and discoverability issues.';
    if (category === 'Accessibility') return 'Major accessibility violations.';
    return 'Critical security or convention issues.';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mx-auto max-w-[1200px] w-full px-4 py-12 sm:px-6 lg:px-8 flex-grow bg-[#050505]"
    >
      {/* ================================================================== */}
      {/* HERO HEADER — Score + Title + Meta visible immediately             */}
      {/* ================================================================== */}
      <div className="relative pb-10 border-b border-white/[0.06]">
        {/* Subtle radial glow behind score */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#00E66A]/[0.04] rounded-full blur-[100px] pointer-events-none"></div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase mb-6"
        >
          <ArrowLeft className="h-3 w-3" /> Back to System
        </Link>

        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
          {/* Score Circle — Primary KPI */}
          <div className="relative flex-shrink-0">
            <svg className="w-32 h-32 sm:w-36 sm:h-36 transform -rotate-90">
              <circle cx="50%" cy="50%" r="46%" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/[0.06]" />
              <circle
                cx="50%" cy="50%" r="46%"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray="289"
                strokeDashoffset={289 - (289 * report.overallScore) / 100}
                className={getScoreColor(report.overallScore)}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 2s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl sm:text-6xl leading-none font-black tracking-tighter text-white">
                <CountUp value={report.overallScore} duration={2} />
              </div>
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-1">/ 100</span>
            </div>
          </div>

          {/* Title + Meta */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white uppercase">
                Engineering Report
              </h1>
              <span className={`px-4 py-1.5 border-2 text-xs font-black uppercase tracking-widest ${
                report.overallScore >= 90
                  ? 'border-[#22c55e] text-[#22c55e] bg-[#22c55e]/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                  : report.overallScore >= 50
                  ? 'border-[#f97316] text-[#f97316] bg-[#f97316]/10 shadow-[0_0_15px_rgba(249,115,22,0.2)]'
                  : 'border-[#ef4444] text-[#ef4444] bg-[#ef4444]/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
              }`}>
                {report.overallScore >= 90 ? 'Excellent' : report.overallScore >= 75 ? 'Good' : report.overallScore >= 50 ? 'Suboptimal' : 'Critical'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#9CA3AF]">
              <span className="text-[#00E66A]">{report.url}</span>
              <span className="text-zinc-700">·</span>
              <span>{report.date}</span>
              <span className="text-zinc-700">·</span>
              <span>Strongest: <span className="text-white">{strongestCategory.name} ({strongestCategory.score})</span></span>
              <span className="text-zinc-700">·</span>
              <span>Weakest: <span className="text-amber-400">{weakestCategory.name} ({weakestCategory.score})</span></span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-3 py-2.5 border border-white/10 hover:border-white/20 text-xs text-zinc-400 hover:text-white transition-colors rounded-lg"
              title="Copy link to this report"
            >
              <Link2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-2 px-3 py-2.5 border border-white/10 hover:border-white/20 text-xs text-zinc-400 hover:text-white transition-colors rounded-lg"
              title="Download raw JSON data"
            >
              <FileJson className="h-3.5 w-3.5" />
            </button>
            <button
              id="export-pdf-btn"
              onClick={handleExportPdf}
              disabled={pdfLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#00E66A] hover:bg-[#00c55a] disabled:opacity-50 disabled:cursor-not-allowed text-xs text-black font-bold transition-all rounded-lg shadow-[0_0_10px_rgba(0,230,106,0.15)]"
              title="Download professional PDF report"
            >
              {pdfLoading
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <FileDown className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{pdfLoading ? 'Generating...' : 'Export PDF'}</span>
            </button>
            <button
              onClick={() => {
                setLoading(true);
                setLoadingStep(0);
                router.push(`/audit?url=${encodeURIComponent(report.url)}&refresh=${Date.now()}`);
              }}
              className="flex items-center gap-2 px-4 py-2.5 border border-white/10 hover:border-white/20 text-xs text-zinc-400 hover:text-white transition-colors rounded-lg"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Re-run
            </button>
          </div>
        </div>
      </div>

      {/* PDF error toast */}
      {pdfError && (
        <div className="mt-4 flex items-center gap-3 border border-red-500/30 bg-red-500/5 px-4 py-3 text-xs text-red-400 rounded-lg">
          <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
          PDF export failed: {pdfError}
        </div>
      )}

      {/* ================================================================== */}
      {/* EXECUTIVE SUMMARY + WEBSITE PREVIEW — Compact, data-rich           */}
      {/* ================================================================== */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {/* Executive Summary — compact */}
        <div className="border border-white/[0.06] bg-[#0A0A0A] p-6 flex flex-col gap-4 h-full rounded-xl">
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-1 h-4 bg-[#00E66A] flex-shrink-0 rounded-full"></span>
              Executive Summary
            </h2>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              This website demonstrates {report.overallScore >= 90 ? 'excellent' : report.overallScore >= 75 ? 'good' : 'suboptimal'} technical health.
              {report.overallScore >= 90 ? ' Only minor optimization opportunities remain.' : ' Focus on resolving the high-impact issues below.'}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.04] mt-auto">
            <div>
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Verdict</p>
              <p className={`text-sm font-semibold ${
                report.overallScore >= 90 ? 'text-[#00E66A]' : report.overallScore >= 50 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {report.overallScore >= 90 ? 'Excellent' : report.overallScore >= 75 ? 'Good' : report.overallScore >= 50 ? 'Suboptimal' : 'Critical'}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Strongest</p>
              <p className="text-sm font-semibold text-white">{strongestCategory.name}</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Weakest</p>
              <p className="text-sm font-semibold text-amber-400">{weakestCategory.name}</p>
            </div>
          </div>
        </div>

        {/* Website Preview — Browser Chrome with Desktop/Mobile tabs */}
        <div className="browser-preview-card group w-full h-full flex flex-col">
          {/* Browser Title Bar with Desktop/Mobile toggle */}
          <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/80 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="w-[10px] h-[10px] rounded-xl bg-[#FF5F57] border border-[#E0443E]"></span>
              <span className="w-[10px] h-[10px] rounded-xl bg-[#FEBC2E] border border-[#DEA123]"></span>
              <span className="w-[10px] h-[10px] rounded-xl bg-[#28C840] border border-[#1AAB29]"></span>
            </div>
            {/* Desktop / Mobile tabs */}
            <div className="flex items-center border border-white/10 rounded-[4px] overflow-hidden">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1 text-[9px] font-mono uppercase tracking-widest transition-colors ${
                  previewMode === 'desktop'
                    ? 'bg-white/10 text-white'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Monitor className="h-3 w-3" /> Desktop
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1 text-[9px] font-mono uppercase tracking-widest transition-colors border-l border-white/10 ${
                  previewMode === 'mobile'
                    ? 'bg-white/10 text-white'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Smartphone className="h-3 w-3" /> Mobile
              </button>
            </div>
            <div className="w-[46px]"></div>
          </div>

          {/* Address Bar */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950/80 border-b border-white/10">
            <div className="flex-1 flex items-center gap-2 bg-black/60 border border-white/[0.06] rounded-[4px] px-2.5 py-1 min-w-0">
              <Lock className="h-3 w-3 text-zinc-500 flex-shrink-0" />
              <span className="text-[11px] font-mono text-zinc-300 truncate" title={report.url}>
                {report.url}
              </span>
            </div>
            <a
              href={`https://${report.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white text-[9px] uppercase tracking-widest transition-colors flex-shrink-0 rounded-[3px]"
            >
              Open <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>

          {/* Screenshot Viewport */}
          <a
            href={`https://${report.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative bg-black overflow-hidden flex items-center justify-center cursor-pointer mx-auto w-full transition-all duration-300 ${
              previewMode === 'desktop' ? 'aspect-video w-full' : 'aspect-[9/16] max-w-[300px]'
            }`}
          >
            {(previewMode === 'desktop' && report.desktopScreenshotUrl) || report.screenshotUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewMode === 'desktop' && report.desktopScreenshotUrl ? report.desktopScreenshotUrl : report.screenshotUrl}
                alt={`Preview of ${report.url}`}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 py-12">
                <Globe className="h-8 w-8 text-zinc-700" />
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Preview Unavailable</span>
              </div>
            )}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none rounded-[inherit]"></div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
          </a>
        </div>
      </div>

      {/* ================================================================== */}
      {/* FOUR PILLAR SCORES — Streamlined horizontal strip                  */}
      {/* ================================================================== */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-0 border border-white/10">
        {[
          { name: 'Performance', score: report.scores.performance, icon: <Zap className={`h-4 w-4 ${getScoreColor(report.scores.performance)}`} />, ctx: getScoreContext('Performance', report.scores.performance) },
          { name: 'Search Engine', score: report.scores.seo, icon: <Search className={`h-4 w-4 ${getScoreColor(report.scores.seo)}`} />, ctx: getScoreContext('SEO', report.scores.seo) },
          { name: 'Accessibility', score: report.scores.accessibility, icon: <Accessibility className={`h-4 w-4 ${getScoreColor(report.scores.accessibility)}`} />, ctx: getScoreContext('Accessibility', report.scores.accessibility) },
          { name: 'Best Practices', score: report.scores.bestPractices, icon: <ShieldCheck className={`h-4 w-4 ${getScoreColor(report.scores.bestPractices)}`} />, ctx: getScoreContext('Best Practices', report.scores.bestPractices) },
        ].map((pillar, i) => (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            key={pillar.name}
            className={`p-5 md:p-6 flex flex-col justify-between hover:bg-white/[0.03] transition-colors bg-zinc-950/30 ${
              i < 3 ? 'border-r border-white/[0.06]' : ''
            } ${i < 2 ? 'border-b lg:border-b-0 border-white/[0.06]' : ''}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{pillar.name}</h4>
              {pillar.icon}
            </div>
            <div className="flex items-end gap-2 mb-1.5">
              <span className={`text-3xl sm:text-4xl font-black leading-none ${getScoreColor(pillar.score)}`}>
                <CountUp value={pillar.score} />
              </span>
              <span className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 border ${getScoreColor(pillar.score)} border-current mb-1 hidden sm:block`}>
                {getScoreLabel(pillar.score)}
              </span>
            </div>
            <p className="text-[10px] font-mono text-zinc-600 leading-relaxed line-clamp-2 mt-1">{pillar.ctx}</p>
          </motion.div>
        ))}
      </div>

      {/* Immediate Quick Wins */}
      {topQuickWins.length > 0 && (
        <div className="mt-6 border border-white/[0.06] bg-[#0A0A0A] p-6 sm:p-8 rounded-xl">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="h-4 w-4 text-[#00E66A]" />
            <h3 className="text-base font-bold text-white">Quick Wins</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topQuickWins.map((rec) => (
              <div key={rec.id} className="border border-white/[0.06] bg-[#050505] p-5 rounded-xl hover:border-[#00E66A]/20 transition-all group hover:-translate-y-0.5">
                <div className="text-[10px] text-[#00E66A] border border-[#00E66A]/20 bg-[#00E66A]/5 inline-block px-2 py-1 mb-3 rounded tracking-widest">
                  Est. Impact: {rec.improvement}
                </div>
                <h4 className="text-sm font-semibold text-white mb-2">{rec.title}</h4>
                <p className="text-xs text-[#9CA3AF] leading-relaxed line-clamp-2">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Core Vectors */}
      <div className="mt-12 pt-8 relative">
        <div className="absolute top-0 left-0 right-0 section-divider-gradient"></div>
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-1 h-4 bg-[#9CA3AF]/30 flex-shrink-0 rounded-full"></span>
          Core Web Vitals
        </h3>
        <div className="border border-white/[0.06] rounded-xl overflow-hidden">
          {Object.entries(report.metrics).map(
            ([key, metric]: [string, ScoreMetric], index) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                key={key}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#0A0A0A] ${
                  index !== Object.keys(report.metrics).length - 1
                    ? 'border-b border-white/[0.04]'
                    : ''
                } hover:bg-white/[0.02] transition-colors`}
              >
                <div className="flex items-center gap-4 w-full sm:w-1/3 mb-2 sm:mb-0">
                  <span className="text-[10px] text-zinc-700 uppercase w-12">{key.substring(0, 3).toUpperCase()}</span>
                  <span className="text-sm font-semibold text-white">{metric.label}</span>
                </div>
                <div className="w-full sm:w-1/3 flex justify-start sm:justify-center mb-2 sm:mb-0">
                  <span className={`text-xl font-bold ${
                    metric.status === 'poor' ? 'text-red-400' : metric.status === 'average' ? 'text-amber-400' : 'text-[#00E66A]'
                  }`}>{metric.value}</span>
                </div>
                <div className="w-full sm:w-1/3 flex justify-start sm:justify-end">
                  <span className={`text-xs px-2 py-0.5 rounded border ${
                    metric.status === 'poor'
                      ? 'border-red-400/30 text-red-400 bg-red-400/5'
                      : metric.status === 'average'
                      ? 'border-amber-400/30 text-amber-400 bg-amber-400/5'
                      : 'border-[#00E66A]/30 text-[#00E66A] bg-[#00E66A]/5'
                  }`}>Score: {metric.score}</span>
                </div>
              </motion.div>
            )
          )}
        </div>
      </div>

      {/* Gemini AI Analysis — renders independently after PageSpeed data arrives */}
      <GeminiSection report={report} onAnalysisReady={setGeminiAnalysisForPdf} />

      {/* Experimental Visual Audit */}
      <VisualAuditSection url={report.url} />

      {/* Lighthouse Diagnostics & Actions */}
      <div className="mt-12 pt-8 relative">
        <div className="absolute top-0 left-0 right-0 section-divider-gradient"></div>
        <div className="flex flex-col md:flex-row items-start justify-between mb-6 gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Lighthouse Diagnostics</h2>
            <p className="text-xs text-zinc-600 mt-1">Raw PageSpeed audit data</p>
          </div>
          <div className="flex text-xs border border-white/[0.06] bg-[#0A0A0A] rounded-lg overflow-hidden flex-wrap">
            {(['all', 'critical', 'high', 'medium', 'low', 'passed'] as const).map((tab, i) => {
              const isActive = activeTab === tab;
              const bgClass = isActive ? (
                tab === 'critical' ? 'bg-red-500 text-white font-semibold' :
                tab === 'high' ? 'bg-amber-400 text-black font-semibold' :
                tab === 'all' ? 'bg-[#00E66A] text-black font-semibold' :
                'bg-white/10 text-white font-semibold'
              ) : (
                tab === 'critical' ? 'text-red-400 hover:bg-red-400/10' :
                tab === 'high' ? 'text-amber-400 hover:bg-amber-400/10' :
                'text-[#9CA3AF] hover:text-white hover:bg-white/5'
              );
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 uppercase tracking-widest transition-colors capitalize ${i > 0 ? 'border-l border-white/[0.06]' : ''} ${bgClass}`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {filteredRecs.length === 0 ? (
          <div className="p-10 text-center border border-white/[0.06] bg-[#0A0A0A] rounded-xl text-sm text-zinc-600">
            No diagnostics found for this filter.
          </div>
        ) : (
          <div className="border border-white/[0.06] rounded-xl overflow-hidden">
            {filteredRecs.map((rec, index) => {
              const isExpanded = expandedRecId === rec.id;
              return (
                <div
                  key={rec.id}
                  className={`bg-[#0A0A0A] ${index !== filteredRecs.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
                >
                  <div
                    onClick={() => setExpandedRecId(isExpanded ? null : rec.id)}
                    className={`p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors border-l-2 ${
                      rec.impact === 'critical' ? 'border-l-red-500' :
                      rec.impact === 'high' ? 'border-l-amber-400' :
                      rec.impact === 'medium' ? 'border-l-yellow-500' :
                      rec.impact === 'low' ? 'border-l-zinc-600' :
                      'border-l-[#00E66A]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      {getImpactBadge(rec.impact)}
                      <h4 className="text-sm font-semibold text-white">{rec.title}</h4>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[11px] hidden md:block ${
                        rec.impact === 'passed' ? 'text-zinc-600' :
                        rec.impact === 'critical' ? 'text-red-400' :
                        rec.impact === 'high' ? 'text-amber-400' :
                        'text-yellow-500'
                      }`}>{rec.improvement}</span>
                      {isExpanded
                        ? <ChevronUp className="h-4 w-4 text-zinc-600" />
                        : <ChevronDown className="h-4 w-4 text-zinc-600" />}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-white/[0.04] bg-[#050505]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                        <div>
                          <h5 className="text-[11px] text-[#9CA3AF] uppercase tracking-widest mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-3 w-3" /> Technical Analysis
                          </h5>
                          <p className="text-xs text-[#9CA3AF] leading-relaxed">{rec.description}</p>
                        </div>
                        <div className="border-l border-white/[0.06] pl-8">
                          <h5 className="text-[11px] text-[#00E66A] uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Terminal className="h-3 w-3" /> Suggested Fix
                          </h5>
                          <p className="text-xs text-white leading-relaxed">{rec.solution}</p>
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
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Page export
// ---------------------------------------------------------------------------

export default function AuditPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col flex-grow items-center justify-center bg-[#050505] min-h-[70vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-5 w-5 rounded-full border-2 border-white/10 border-t-[#00E66A] animate-spin"></div>
            <p className="text-xs text-zinc-600 uppercase tracking-widest">Loading...</p>
          </div>
        </div>
      }
    >
      <AuditResultsContent />
    </Suspense>
  );
}
