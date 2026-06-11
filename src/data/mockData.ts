/**
 * @deprecated
 * All types have been moved to `@/types/audit`.
 * Mock audit data is no longer used by the app — real data is fetched
 * from the Google PageSpeed Insights API via /api/audit.
 *
 * This file is kept only to avoid breaking any stale imports during
 * the transition. It will be removed in a future cleanup.
 */

// Re-export types from the canonical location
export type { ScoreMetric, Recommendation, AuditReport } from '@/types/audit';
