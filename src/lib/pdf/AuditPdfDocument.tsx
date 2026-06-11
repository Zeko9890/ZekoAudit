/**
 * AuditPdfDocument.tsx
 * @react-pdf/renderer document component for ZekoAudit reports.
 * Runs server-side only via /api/pdf route handler.
 */
import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from '@react-pdf/renderer';
import type { AuditReport, GeminiAnalysis, GeminiIssue } from '@/types/audit';

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------
const C = {
  black:     '#000000',
  white:     '#FFFFFF',
  orange:    '#FF5500',
  darkBg:    '#0D0D0D',
  nearBlack: '#141414',
  lightGray: '#F5F5F5',
  border:    '#E4E4E7',
  gray:      '#A1A1AA',
  midGray:   '#71717A',
  darkGray:  '#3F3F46',
  poorRed:   '#FF5500', // orange = poor in our palette
  avgAmber:  '#D4760C',
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const s = StyleSheet.create({
  // ── Pages ─────────────────────────────────────────────────────────────────
  coverPage: {
    backgroundColor: C.black,
    fontFamily: 'Helvetica',
  },
  contentPage: {
    backgroundColor: C.white,
    fontFamily: 'Helvetica',
    paddingTop: 48,
    paddingBottom: 60,
    paddingHorizontal: 48,
  },

  // ── Cover ─────────────────────────────────────────────────────────────────
  coverInner: {
    flex: 1,
    padding: 48,
    justifyContent: 'space-between',
  },
  coverBrand: {
    fontSize: 9,
    color: C.orange,
    letterSpacing: 4,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  coverDivider: {
    width: 32,
    height: 2,
    backgroundColor: C.orange,
    marginBottom: 40,
  },
  coverHeading: {
    fontSize: 44,
    color: C.white,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -1,
    lineHeight: 1.1,
    marginBottom: 6,
  },
  coverSubHeading: {
    fontSize: 11,
    color: C.gray,
    letterSpacing: 3,
    fontFamily: 'Helvetica',
    marginBottom: 48,
  },
  coverScoreBlock: {
    marginBottom: 32,
  },
  coverScoreLabel: {
    fontSize: 9,
    color: C.midGray,
    letterSpacing: 3,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  coverScoreNumber: {
    fontSize: 100,
    color: C.white,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -5,
    lineHeight: 1,
  },
  coverScoreOutOf: {
    fontSize: 24,
    color: C.midGray,
    fontFamily: 'Helvetica',
    letterSpacing: -1,
  },
  coverVerdictBadge: {
    borderWidth: 1,
    borderColor: C.white,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  coverVerdictText: {
    color: C.white,
    fontSize: 8,
    letterSpacing: 2,
    fontFamily: 'Helvetica-Bold',
  },
  coverMeta: {
    marginBottom: 24,
  },
  coverUrl: {
    fontSize: 12,
    color: C.orange,
    fontFamily: 'Helvetica',
    marginBottom: 4,
  },
  coverDate: {
    fontSize: 9,
    color: C.midGray,
    fontFamily: 'Helvetica',
  },
  coverFooterLine: {
    height: 1,
    backgroundColor: '#333333',
    marginBottom: 12,
  },
  coverFooterText: {
    fontSize: 8,
    color: '#555555',
    fontFamily: 'Helvetica',
  },

  // ── Section heading ───────────────────────────────────────────────────────
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  sectionAccent: {
    width: 3,
    height: 14,
    backgroundColor: C.orange,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 3,
    color: C.darkGray,
  },

  // ── Score Cards ───────────────────────────────────────────────────────────
  scoreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 28,
  },
  scoreCard: {
    width: '50%',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  scoreCardLabel: {
    fontSize: 7,
    color: C.gray,
    letterSpacing: 2,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  scoreCardNumber: {
    fontSize: 38,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1,
    marginBottom: 10,
  },
  progressTrack: {
    height: 2,
    backgroundColor: C.border,
    width: '100%',
  },
  progressFill: {
    height: 2,
    backgroundColor: C.orange,
  },

  // ── Metrics table ─────────────────────────────────────────────────────────
  tableContainer: {
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 0,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: C.black,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  tableHeaderCell: {
    fontSize: 7,
    color: C.white,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  tableRowAlt: {
    backgroundColor: C.lightGray,
  },
  tableCell: {
    fontSize: 9,
    color: C.darkGray,
    fontFamily: 'Helvetica',
  },
  tableCellBold: {
    fontFamily: 'Helvetica-Bold',
  },
  statusBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // ── Executive Summary ─────────────────────────────────────────────────────
  summaryBox: {
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.lightGray,
    padding: 16,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 11,
    color: C.darkGray,
    lineHeight: 1.65,
    fontFamily: 'Helvetica',
  },

  // ── Issue list ────────────────────────────────────────────────────────────
  issueItem: {
    borderLeftWidth: 2,
    borderLeftColor: C.orange,
    paddingLeft: 12,
    marginBottom: 14,
  },
  issuePriorityBadge: {
    borderWidth: 1,
    paddingHorizontal: 4,
    paddingVertical: 1,
    alignSelf: 'flex-start',
    marginBottom: 3,
  },
  issuePriorityText: {
    fontSize: 6,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  issueTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: C.black,
    marginBottom: 3,
  },
  issueDesc: {
    fontSize: 8,
    color: C.midGray,
    lineHeight: 1.5,
    fontFamily: 'Helvetica',
    marginBottom: 3,
  },
  issueFix: {
    fontSize: 8,
    color: C.orange,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
  issueImpact: {
    fontSize: 7,
    color: C.darkGray,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    marginTop: 3,
  },

  // ── Lists (Quick Wins / Strategic) ────────────────────────────────────────
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  listBullet: {
    width: 6,
    height: 6,
    backgroundColor: C.orange,
    marginRight: 10,
    marginTop: 3,
    flexShrink: 0,
  },
  listText: {
    fontSize: 10,
    color: C.darkGray,
    fontFamily: 'Helvetica',
    lineHeight: 1.55,
    flex: 1,
  },
  listNumber: {
    fontSize: 9,
    color: C.orange,
    fontFamily: 'Helvetica-Bold',
    marginRight: 10,
    marginTop: 1,
    flexShrink: 0,
    width: 14,
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 8,
  },
  footerLeft: {
    fontSize: 7,
    color: C.gray,
    fontFamily: 'Helvetica',
  },
  footerRight: {
    fontSize: 7,
    color: C.orange,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
  },

  // ── Misc ──────────────────────────────────────────────────────────────────
  spacer16: { marginBottom: 16 },
  spacer24: { marginBottom: 24 },
  spacerTop12: { marginTop: 12 },
  twoCol: { flexDirection: 'row', gap: 16 },
  col: { flex: 1 },
  subSectionLabel: {
    fontSize: 7,
    color: C.orange,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 16,
  },
});

// ---------------------------------------------------------------------------
// Helper sub-components
// ---------------------------------------------------------------------------

function SectionHeading({ title }: { title: string }) {
  return (
    <View style={s.sectionRow}>
      <View style={s.sectionAccent} />
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  );
}

function PageFooter({ url, page }: { url: string; page: number }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerLeft}>
        ZEKOAUDIT — {url} — Page {page}
      </Text>
      <Text style={s.footerRight}>ZEKOAUDIT.COM</Text>
    </View>
  );
}

function ScoreColor(score: number): string {
  if (score >= 90) return C.black;
  if (score >= 50) return C.avgAmber;
  return C.poorRed;
}

function StatusStyle(status: 'good' | 'average' | 'poor'): {
  borderColor: string;
  color: string;
} {
  switch (status) {
    case 'good':    return { borderColor: '#22c55e', color: '#15803d' };
    case 'average': return { borderColor: C.avgAmber, color: C.avgAmber };
    case 'poor':    return { borderColor: C.poorRed, color: C.poorRed };
  }
}

function PriorityStyle(priority: GeminiIssue['priority']): {
  borderColor: string;
  color: string;
} {
  switch (priority) {
    case 'critical': return { borderColor: C.poorRed, color: C.poorRed };
    case 'high':     return { borderColor: '#f97316', color: '#f97316' };
    case 'medium':   return { borderColor: C.midGray, color: C.midGray };
    case 'low':      return { borderColor: C.border, color: C.gray };
  }
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

function CoverPage({
  report,
  analysis,
}: {
  report: AuditReport;
  analysis?: GeminiAnalysis | null;
}) {
  const verdict =
    analysis?.verdict ||
    (report.overallScore >= 90
      ? 'Excellent'
      : report.overallScore >= 75
      ? 'Good'
      : report.overallScore >= 50
      ? 'Fair'
      : 'Poor');

  return (
    <Page size="A4" style={s.coverPage}>
      <View style={s.coverInner}>
        {/* Top branding */}
        <View>
          <Text style={s.coverBrand}>ZEKOAUDIT</Text>
          <View style={s.coverDivider} />
          <Text style={s.coverHeading}>PERFORMANCE{'\n'}AUDIT REPORT</Text>
          <Text style={s.coverSubHeading}>ENGINEERING GRADE ANALYSIS</Text>
        </View>

        {/* Score centrepiece */}
        <View style={s.coverScoreBlock}>
          <Text style={s.coverScoreLabel}>OVERALL MASTER GRADE</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <Text style={s.coverScoreNumber}>{report.overallScore}</Text>
            <Text style={{ ...s.coverScoreOutOf, marginBottom: 12, marginLeft: 4 }}>
              /100
            </Text>
          </View>
          <View style={s.coverVerdictBadge}>
            <Text style={s.coverVerdictText}>{verdict.toUpperCase()}</Text>
          </View>
        </View>

        {/* URL & date */}
        <View style={s.coverMeta}>
          <Text style={s.coverUrl}>{report.url}</Text>
          <Text style={s.coverDate}>Generated: {report.date}</Text>
        </View>

        {/* Footer */}
        <View>
          <View style={s.coverFooterLine} />
          <Text style={s.coverFooterText}>
            Powered by Google PageSpeed Insights + Gemini AI · ZekoAudit
          </Text>
        </View>
      </View>
    </Page>
  );
}

function ScoresPage({ report }: { report: AuditReport }) {
  const categories = [
    { label: 'Performance', score: report.scores.performance },
    { label: 'SEO',         score: report.scores.seo },
    { label: 'Accessibility', score: report.scores.accessibility },
    { label: 'Best Practices', score: report.scores.bestPractices },
  ];

  return (
    <Page size="A4" style={s.contentPage}>
      <SectionHeading title="CATEGORY SCORES" />

      {/* Overall */}
      <View
        style={{
          backgroundColor: C.black,
          padding: 20,
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 20,
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Text style={{ fontSize: 7, color: C.midGray, fontFamily: 'Helvetica-Bold', letterSpacing: 2 }}>
            OVERALL MASTER GRADE
          </Text>
          <Text style={{ fontSize: 11, color: C.white, fontFamily: 'Helvetica', letterSpacing: 2, marginTop: 4 }}>
            {report.url}
          </Text>
        </View>
        <Text style={{ fontSize: 52, color: C.white, fontFamily: 'Helvetica-Bold', letterSpacing: -2, lineHeight: 1 }}>
          {report.overallScore}
        </Text>
      </View>

      {/* 2×2 score grid */}
      <View style={s.scoreGrid}>
        {categories.map((cat, i) => (
          <View
            key={cat.label}
            style={[
              s.scoreCard,
              // Adjust borders so they don't double-up
              {
                borderRightWidth: i % 2 === 0 ? 0 : 1,
                borderBottomWidth: i < 2 ? 0 : 1,
                marginTop: i < 2 ? 0 : 0,
              },
            ]}
          >
            <Text style={s.scoreCardLabel}>{cat.label}</Text>
            <Text style={[s.scoreCardNumber, { color: ScoreColor(cat.score) }]}>
              {cat.score}
            </Text>
            <View style={s.progressTrack}>
              <View style={[s.progressFill, { width: `${cat.score}%` }]} />
            </View>
          </View>
        ))}
      </View>

      {/* Score legend */}
      <View
        style={{
          flexDirection: 'row',
          gap: 20,
          padding: 12,
          borderWidth: 1,
          borderColor: C.border,
          backgroundColor: C.lightGray,
        }}
      >
        {[
          { label: 'Excellent', range: '90–100', color: C.black },
          { label: 'Good',      range: '75–89',  color: C.avgAmber },
          { label: 'Fair',      range: '50–74',  color: C.poorRed },
          { label: 'Poor',      range: '0–49',   color: C.poorRed },
        ].map((leg) => (
          <View key={leg.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ width: 8, height: 8, backgroundColor: leg.color }} />
            <Text style={{ fontSize: 7, color: C.midGray, fontFamily: 'Helvetica' }}>
              {leg.label} ({leg.range})
            </Text>
          </View>
        ))}
      </View>

      <PageFooter url={report.url} page={2} />
    </Page>
  );
}

function VitalsPage({ report }: { report: AuditReport }) {
  const metrics = [
    report.metrics.fcp,
    report.metrics.lcp,
    report.metrics.cls,
    report.metrics.tbt,
    report.metrics.speedIndex,
  ];

  const colWidths = ['42%', '18%', '14%', '14%', '12%'];

  return (
    <Page size="A4" style={s.contentPage}>
      <SectionHeading title="CORE WEB VITALS" />

      <View style={s.tableContainer}>
        {/* Header */}
        <View style={s.tableHeader}>
          {['Metric', 'Measured Value', 'Score', 'Status', 'Rating'].map((h, i) => (
            <Text key={h} style={[s.tableHeaderCell, { width: colWidths[i] }]}>
              {h}
            </Text>
          ))}
        </View>

        {/* Rows */}
        {metrics.map((m, i) => {
          const ss = StatusStyle(m.status);
          return (
            <View key={m.label} style={[s.tableRow, i % 2 === 1 ? s.tableRowAlt : {}]}>
              <Text style={[s.tableCell, s.tableCellBold, { width: colWidths[0] }]}>
                {m.label}
              </Text>
              <Text style={[s.tableCell, { width: colWidths[1], color: m.status === 'poor' ? C.poorRed : C.darkGray }]}>
                {m.value}
              </Text>
              <Text style={[s.tableCell, { width: colWidths[2] }]}>{m.score}</Text>
              <View style={{ width: colWidths[3] }}>
                <View style={[s.statusBadge, { borderColor: ss.borderColor }]}>
                  <Text style={[s.statusText, { color: ss.color }]}>
                    {m.status}
                  </Text>
                </View>
              </View>
              <View style={{ width: colWidths[4] }}>
                <View
                  style={{
                    height: 3,
                    backgroundColor: C.border,
                    width: '80%',
                  }}
                >
                  <View
                    style={{
                      height: 3,
                      backgroundColor: ss.borderColor,
                      width: `${m.score}%`,
                    }}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Definitions */}
      <View style={s.spacer24} />
      <SectionHeading title="METRIC DEFINITIONS" />
      <View style={{ gap: 8 }}>
        {metrics.map((m) => (
          <View key={m.label} style={{ flexDirection: 'row', gap: 8, marginBottom: 4 }}>
            <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.darkGray, width: 160, flexShrink: 0 }}>
              {m.label}
            </Text>
            <Text style={{ fontSize: 8, color: C.midGray, fontFamily: 'Helvetica', flex: 1, lineHeight: 1.5 }}>
              {m.description || 'No description available.'}
            </Text>
          </View>
        ))}
      </View>

      <PageFooter url={report.url} page={3} />
    </Page>
  );
}

function AiAnalysisPage({ report, analysis }: { report: AuditReport; analysis: GeminiAnalysis }) {
  return (
    <Page size="A4" style={s.contentPage}>
      {/* Header with Gemini badge */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: C.border }}>
        <View style={s.sectionAccent} />
        <Text style={s.sectionTitle}>AI ANALYSIS</Text>
        <View style={{ marginLeft: 10, borderWidth: 1, borderColor: C.orange, paddingHorizontal: 6, paddingVertical: 2 }}>
          <Text style={{ fontSize: 6, color: C.orange, fontFamily: 'Helvetica-Bold', letterSpacing: 1 }}>
            GEMINI 2.5 FLASH
          </Text>
        </View>
      </View>

      {/* Executive Summary */}
      <Text style={s.subSectionLabel}>EXECUTIVE SUMMARY</Text>
      <View style={s.summaryBox}>
        <Text style={s.summaryText}>{analysis.executiveSummary}</Text>
      </View>

      {/* Top Issues */}
      <Text style={s.subSectionLabel}>PRIORITIZED ISSUES</Text>
      {analysis.topIssues.slice(0, 5).map((issue, i) => {
        const ps = PriorityStyle(issue.priority);
        return (
          <View key={i} style={s.issueItem}>
            <View style={[s.issuePriorityBadge, { borderColor: ps.borderColor }]}>
              <Text style={[s.issuePriorityText, { color: ps.color }]}>
                {issue.priority}
              </Text>
            </View>
            <Text style={s.issueTitle}>{issue.title}</Text>
            <Text style={s.issueDesc}>{issue.description}</Text>
            <Text style={s.issueFix}>Fix: {issue.fix}</Text>
            <Text style={s.issueImpact}>Expected: {issue.estimatedImpact}</Text>
          </View>
        );
      })}

      <PageFooter url={report.url} page={4} />
    </Page>
  );
}

function RecommendationsPage({ report, analysis }: { report: AuditReport; analysis: GeminiAnalysis }) {
  return (
    <Page size="A4" style={s.contentPage}>
      <SectionHeading title="RECOMMENDATIONS" />

      {/* Quick Wins */}
      <Text style={s.subSectionLabel}>QUICK WINS / UNDER 1 HOUR</Text>
      {analysis.quickWins.map((win, i) => (
        <View key={i} style={s.listItem}>
          <View style={s.listBullet} />
          <Text style={s.listText}>{win}</Text>
        </View>
      ))}

      {/* Strategic Recommendations */}
      <Text style={s.subSectionLabel}>STRATEGIC RECOMMENDATIONS</Text>
      {analysis.strategicRecommendations.map((rec, i) => (
        <View key={i} style={s.listItem}>
          <Text style={s.listNumber}>{i + 1}.</Text>
          <Text style={s.listText}>{rec}</Text>
        </View>
      ))}

      {/* Summary table */}
      <View style={{ marginTop: 32 }}>
        <SectionHeading title="SCORE SUMMARY" />
        <View style={{ borderWidth: 1, borderColor: C.border }}>
          {[
            { label: 'Performance',    score: report.scores.performance },
            { label: 'SEO',            score: report.scores.seo },
            { label: 'Accessibility',  score: report.scores.accessibility },
            { label: 'Best Practices', score: report.scores.bestPractices },
            { label: 'OVERALL',        score: report.overallScore, bold: true },
          ].map((row, i) => (
            <View
              key={row.label}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 12,
                paddingVertical: 9,
                backgroundColor: row.bold ? C.black : i % 2 === 0 ? C.white : C.lightGray,
                borderTopWidth: i > 0 ? 1 : 0,
                borderTopColor: C.border,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: row.bold ? 'Helvetica-Bold' : 'Helvetica',
                  color: row.bold ? C.white : C.darkGray,
                  letterSpacing: row.bold ? 1 : 0,
                }}
              >
                {row.bold ? row.label.toUpperCase() : row.label}
              </Text>
              <Text
                style={{
                  fontSize: row.bold ? 14 : 11,
                  fontFamily: 'Helvetica-Bold',
                  color: row.bold ? C.white : ScoreColor(row.score),
                }}
              >
                {row.score}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Disclaimer */}
      <View style={{ marginTop: 24, padding: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.lightGray }}>
        <Text style={{ fontSize: 7, color: C.midGray, fontFamily: 'Helvetica', lineHeight: 1.6 }}>
          This report was generated using Google PageSpeed Insights (Lighthouse) data and Gemini AI analysis.
          Scores reflect a mobile audit performed on {report.date}. Results may vary based on server load, geographic
          location, and page dynamism. This report is intended for engineering and product teams.
          ZekoAudit is an independent tool and is not affiliated with Google.
        </Text>
      </View>

      <PageFooter url={report.url} page={5} />
    </Page>
  );
}

// ---------------------------------------------------------------------------
// Root document
// ---------------------------------------------------------------------------

export interface AuditPdfProps {
  report: AuditReport;
  analysis?: GeminiAnalysis | null;
}

export function AuditPdfDocument({ report, analysis }: AuditPdfProps) {
  return (
    <Document
      title={`ZekoAudit Report — ${report.url}`}
      author="ZekoAudit"
      subject="Website Performance Audit Report"
      creator="ZekoAudit"
      producer="@react-pdf/renderer"
      keywords="performance, seo, accessibility, audit, lighthouse"
    >
      <CoverPage report={report} analysis={analysis} />
      <ScoresPage report={report} />
      <VitalsPage report={report} />
      {analysis && <AiAnalysisPage report={report} analysis={analysis} />}
      {analysis && <RecommendationsPage report={report} analysis={analysis} />}
    </Document>
  );
}
