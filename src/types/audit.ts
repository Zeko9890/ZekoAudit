/**
 * Shared type definitions for ZekoAudit reports.
 * These mirror the structure returned by /api/audit (Google PageSpeed Insights)
 * and /api/gemini-analysis (Google Gemini AI).
 */

export interface ScoreMetric {
  value: string;
  score: number;
  status: 'good' | 'average' | 'poor';
  label: string;
  description: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'passed';
  category: 'seo' | 'performance' | 'accessibility' | 'bestPractices';
  solution: string;
  improvement: string;
}

export interface AuditReport {
  url: string;
  name: string;
  overallScore: number;
  date: string;
  scores: {
    seo: number;
    performance: number;
    accessibility: number;
    bestPractices: number;
  };
  metrics: {
    fcp: ScoreMetric;
    lcp: ScoreMetric;
    cls: ScoreMetric;
    tbt: ScoreMetric;
    speedIndex: ScoreMetric;
  };
  recommendations: Recommendation[];
}

// ---------------------------------------------------------------------------
// Gemini AI Analysis Types
// ---------------------------------------------------------------------------

export interface GeminiIssue {
  /** Short title of the issue */
  title: string;
  /** Detailed explanation of the problem */
  description: string;
  /** Concrete fix for the issue */
  fix: string;
  /** Priority level */
  priority: 'critical' | 'high' | 'medium' | 'low';
  /** Affected audit dimension */
  category: 'performance' | 'seo' | 'accessibility' | 'bestPractices';
  /** Expected improvement after fix */
  estimatedImpact: string;
}

export interface GeminiAnalysis {
  /** One-paragraph executive summary of the audit */
  executiveSummary: string;
  /** Overall assessment: Excellent / Good / Fair / Poor */
  verdict: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  /** Top 5–8 prioritized issues to fix */
  topIssues: GeminiIssue[];
  /** Quick-win actions ordered by business impact */
  quickWins: string[];
  /** Long-term strategic recommendations */
  strategicRecommendations: string[];
  /** When this analysis was generated */
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// Website Comparison Types
// ---------------------------------------------------------------------------

export interface CategoryWinner {
  /** Which site won this category: 'a' | 'b' | 'tie' */
  winner: 'a' | 'b' | 'tie';
  /** Score delta (absolute) */
  delta: number;
}

export interface ComparisonResult {
  reportA: AuditReport;
  reportB: AuditReport;
  /** Winner per category */
  winners: {
    overall: CategoryWinner;
    performance: CategoryWinner;
    seo: CategoryWinner;
    accessibility: CategoryWinner;
    bestPractices: CategoryWinner;
  };
  /** When this comparison was generated */
  comparedAt: string;
}

export interface GeminiComparison {
  /** Executive comparison summary (2–3 sentences) */
  executiveSummary: string;
  /** Strengths unique to Site A */
  siteAStrengths: string[];
  /** Strengths unique to Site B */
  siteBStrengths: string[];
  /** Key differences between the two sites */
  keyDifferences: string[];
  /** Actionable recommendations */
  recommendations: string[];
  /** Which site is the overall winner */
  overallWinner: 'a' | 'b' | 'tie';
  /** When this analysis was generated */
  generatedAt: string;
}
