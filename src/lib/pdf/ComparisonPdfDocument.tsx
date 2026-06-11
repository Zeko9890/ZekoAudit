/**
 * ComparisonPdfDocument.tsx
 * Multi-page comparison PDF using @react-pdf/renderer.
 * Server-side only — rendered via /api/pdf route handler.
 */
import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from '@react-pdf/renderer';
import type { AuditReport, GeminiComparison } from '@/types/audit';

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------
const C = {
  black: '#000000',
  white: '#FFFFFF',
  orange: '#FF5500',
  darkBg: '#0D0D0D',
  lightGray: '#F5F5F5',
  border: '#E4E4E7',
  gray: '#A1A1AA',
  midGray: '#71717A',
  darkGray: '#3F3F46',
  green: '#22c55e',
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const s = StyleSheet.create({
  coverPage: { backgroundColor: C.black, fontFamily: 'Helvetica' },
  contentPage: {
    backgroundColor: C.white,
    fontFamily: 'Helvetica',
    paddingTop: 48,
    paddingBottom: 60,
    paddingHorizontal: 48,
  },
  coverInner: { flex: 1, padding: 48, justifyContent: 'space-between' },
  coverBrand: {
    fontSize: 9, color: C.orange, letterSpacing: 4,
    fontFamily: 'Helvetica-Bold', marginBottom: 4,
  },
  coverDivider: { width: 32, height: 2, backgroundColor: C.orange, marginBottom: 40 },
  coverHeading: {
    fontSize: 40, color: C.white, fontFamily: 'Helvetica-Bold',
    letterSpacing: -1, lineHeight: 1.1, marginBottom: 6,
  },
  coverSubHeading: {
    fontSize: 11, color: C.gray, letterSpacing: 3,
    fontFamily: 'Helvetica', marginBottom: 48,
  },
  coverUrl: { fontSize: 11, color: C.orange, fontFamily: 'Helvetica', marginBottom: 2 },
  coverDate: { fontSize: 9, color: C.midGray, fontFamily: 'Helvetica' },
  coverFooterLine: { height: 1, backgroundColor: '#333333', marginBottom: 12 },
  coverFooterText: { fontSize: 8, color: '#555555', fontFamily: 'Helvetica' },

  sectionRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 20,
    paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  sectionAccent: { width: 3, height: 14, backgroundColor: C.orange, marginRight: 8 },
  sectionTitle: {
    fontSize: 9, fontFamily: 'Helvetica-Bold', letterSpacing: 3, color: C.darkGray,
  },

  vsBlock: {
    backgroundColor: C.black, padding: 12, alignItems: 'center',
    justifyContent: 'center', width: 40,
  },
  vsText: { fontSize: 10, color: C.orange, fontFamily: 'Helvetica-Bold' },

  scoreBox: {
    flex: 1, padding: 16, borderWidth: 1, borderColor: C.border, alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 7, color: C.gray, fontFamily: 'Helvetica-Bold',
    letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase',
  },
  scoreNumber: { fontSize: 48, fontFamily: 'Helvetica-Bold', lineHeight: 1 },
  winnerBadge: {
    marginTop: 8, borderWidth: 1, borderColor: C.orange,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  winnerText: {
    fontSize: 6, color: C.orange, fontFamily: 'Helvetica-Bold', letterSpacing: 1,
  },

  catRow: {
    flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.border,
  },
  catCell: {
    flex: 1, padding: 12, alignItems: 'center',
  },
  catLabel: {
    fontSize: 7, color: C.gray, fontFamily: 'Helvetica-Bold',
    letterSpacing: 2, marginBottom: 6, textTransform: 'uppercase',
  },
  catScore: { fontSize: 28, fontFamily: 'Helvetica-Bold', lineHeight: 1 },
  catDelta: { fontSize: 8, color: C.orange, fontFamily: 'Helvetica-Bold', marginTop: 4 },

  metricsHeader: {
    flexDirection: 'row', backgroundColor: C.black, paddingVertical: 8, paddingHorizontal: 10,
  },
  metricsHeaderCell: {
    fontSize: 7, color: C.white, fontFamily: 'Helvetica-Bold', letterSpacing: 1,
  },
  metricsRow: {
    flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 10,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  metricsCell: { fontSize: 9, color: C.darkGray, fontFamily: 'Helvetica' },
  metricsBold: { fontFamily: 'Helvetica-Bold' },

  summaryBox: {
    borderWidth: 1, borderColor: C.border, backgroundColor: C.lightGray,
    padding: 16, marginBottom: 16,
  },
  summaryText: { fontSize: 11, color: C.darkGray, lineHeight: 1.65, fontFamily: 'Helvetica' },

  listItem: { flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' },
  listBullet: {
    width: 6, height: 6, backgroundColor: C.orange,
    marginRight: 10, marginTop: 3, flexShrink: 0,
  },
  listText: {
    fontSize: 10, color: C.darkGray, fontFamily: 'Helvetica', lineHeight: 1.55, flex: 1,
  },
  subLabel: {
    fontSize: 7, color: C.orange, fontFamily: 'Helvetica-Bold',
    letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10, marginTop: 16,
  },

  footer: {
    position: 'absolute', bottom: 24, left: 48, right: 48,
    flexDirection: 'row', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: C.border, paddingTop: 8,
  },
  footerLeft: { fontSize: 7, color: C.gray, fontFamily: 'Helvetica' },
  footerRight: { fontSize: 7, color: C.orange, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function SectionHeading({ title }: { title: string }) {
  return (
    <View style={s.sectionRow}>
      <View style={s.sectionAccent} />
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  );
}

function PageFooter({ page }: { page: number }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerLeft}>ZEKOAUDIT COMPARISON — Page {page}</Text>
      <Text style={s.footerRight}>ZEKOAUDIT.COM</Text>
    </View>
  );
}

function ScoreColor(score: number): string {
  if (score >= 90) return C.black;
  if (score >= 50) return '#D4760C';
  return C.orange;
}

function determineWinner(a: number, b: number): 'a' | 'b' | 'tie' {
  if (Math.abs(a - b) <= 2) return 'tie';
  return a > b ? 'a' : 'b';
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

function CoverPage({ a, b }: { a: AuditReport; b: AuditReport }) {
  return (
    <Page size="A4" style={s.coverPage}>
      <View style={s.coverInner}>
        <View>
          <Text style={s.coverBrand}>ZEKOAUDIT</Text>
          <View style={s.coverDivider} />
          <Text style={s.coverHeading}>WEBSITE{'\n'}COMPARISON{'\n'}REPORT</Text>
          <Text style={s.coverSubHeading}>SIDE-BY-SIDE ANALYSIS</Text>
        </View>

        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 8, color: C.midGray, fontFamily: 'Helvetica-Bold', letterSpacing: 2, marginBottom: 4 }}>SITE A</Text>
              <Text style={{ fontSize: 14, color: C.white, fontFamily: 'Helvetica-Bold' }}>{a.url}</Text>
              <Text style={{ fontSize: 52, color: C.white, fontFamily: 'Helvetica-Bold', lineHeight: 1, marginTop: 8 }}>{a.overallScore}</Text>
            </View>
            <View style={{ width: 40, alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: C.orange, fontFamily: 'Helvetica-Bold' }}>VS</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 8, color: C.midGray, fontFamily: 'Helvetica-Bold', letterSpacing: 2, marginBottom: 4 }}>SITE B</Text>
              <Text style={{ fontSize: 14, color: C.white, fontFamily: 'Helvetica-Bold' }}>{b.url}</Text>
              <Text style={{ fontSize: 52, color: C.white, fontFamily: 'Helvetica-Bold', lineHeight: 1, marginTop: 8 }}>{b.overallScore}</Text>
            </View>
          </View>
        </View>

        <View>
          <Text style={s.coverDate}>Generated: {a.date}</Text>
          <View style={{ ...s.coverFooterLine, marginTop: 12 }} />
          <Text style={s.coverFooterText}>
            Powered by Google PageSpeed Insights + Gemini AI · ZekoAudit
          </Text>
        </View>
      </View>
    </Page>
  );
}

function ScoresPage({ a, b }: { a: AuditReport; b: AuditReport }) {
  const categories: { label: string; key: keyof AuditReport['scores'] }[] = [
    { label: 'Performance', key: 'performance' },
    { label: 'SEO', key: 'seo' },
    { label: 'Accessibility', key: 'accessibility' },
    { label: 'Best Practices', key: 'bestPractices' },
  ];

  const overallWinner = determineWinner(a.overallScore, b.overallScore);

  return (
    <Page size="A4" style={s.contentPage}>
      <SectionHeading title="SCORE COMPARISON" />

      {/* Overall face-off */}
      <View style={{ flexDirection: 'row', marginBottom: 24, borderWidth: 1, borderColor: C.border }}>
        <View style={[s.scoreBox, { borderRightWidth: 0 }]}>
          <Text style={s.scoreLabel}>{a.url}</Text>
          <Text style={[s.scoreNumber, { color: ScoreColor(a.overallScore) }]}>{a.overallScore}</Text>
          {overallWinner === 'a' && (
            <View style={s.winnerBadge}><Text style={s.winnerText}>WINNER</Text></View>
          )}
        </View>
        <View style={s.vsBlock}>
          <Text style={s.vsText}>VS</Text>
        </View>
        <View style={[s.scoreBox, { borderLeftWidth: 0 }]}>
          <Text style={s.scoreLabel}>{b.url}</Text>
          <Text style={[s.scoreNumber, { color: ScoreColor(b.overallScore) }]}>{b.overallScore}</Text>
          {overallWinner === 'b' && (
            <View style={s.winnerBadge}><Text style={s.winnerText}>WINNER</Text></View>
          )}
        </View>
      </View>

      {/* Category breakdown */}
      <View style={{ borderWidth: 1, borderColor: C.border }}>
        {/* Header */}
        <View style={[s.catRow, { backgroundColor: C.black }]}>
          <View style={[s.catCell, { borderRightWidth: 1, borderRightColor: '#333' }]}>
            <Text style={{ fontSize: 7, color: C.white, fontFamily: 'Helvetica-Bold', letterSpacing: 2 }}>CATEGORY</Text>
          </View>
          <View style={[s.catCell, { borderRightWidth: 1, borderRightColor: '#333' }]}>
            <Text style={{ fontSize: 7, color: C.white, fontFamily: 'Helvetica-Bold', letterSpacing: 2 }}>SITE A</Text>
          </View>
          <View style={[s.catCell, { borderRightWidth: 1, borderRightColor: '#333' }]}>
            <Text style={{ fontSize: 7, color: C.white, fontFamily: 'Helvetica-Bold', letterSpacing: 2 }}>SITE B</Text>
          </View>
          <View style={s.catCell}>
            <Text style={{ fontSize: 7, color: C.white, fontFamily: 'Helvetica-Bold', letterSpacing: 2 }}>WINNER</Text>
          </View>
        </View>

        {categories.map((cat, i) => {
          const sa = a.scores[cat.key];
          const sb = b.scores[cat.key];
          const w = determineWinner(sa, sb);
          return (
            <View key={cat.key} style={[s.catRow, i % 2 === 1 ? { backgroundColor: C.lightGray } : {}]}>
              <View style={[s.catCell, { borderRightWidth: 1, borderRightColor: C.border, alignItems: 'flex-start' }]}>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.darkGray }}>{cat.label}</Text>
              </View>
              <View style={[s.catCell, { borderRightWidth: 1, borderRightColor: C.border }]}>
                <Text style={[s.catScore, { color: ScoreColor(sa), fontSize: 20 }]}>{sa}</Text>
              </View>
              <View style={[s.catCell, { borderRightWidth: 1, borderRightColor: C.border }]}>
                <Text style={[s.catScore, { color: ScoreColor(sb), fontSize: 20 }]}>{sb}</Text>
              </View>
              <View style={s.catCell}>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: w === 'tie' ? C.midGray : C.orange }}>
                  {w === 'tie' ? 'TIE' : w === 'a' ? 'SITE A' : 'SITE B'}
                </Text>
                {w !== 'tie' && (
                  <Text style={{ fontSize: 7, color: C.midGray, marginTop: 2 }}>
                    +{Math.abs(sa - sb)} pts
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      <PageFooter page={2} />
    </Page>
  );
}

function VitalsPage({ a, b }: { a: AuditReport; b: AuditReport }) {
  const metricKeys: (keyof AuditReport['metrics'])[] = ['fcp', 'lcp', 'cls', 'tbt', 'speedIndex'];
  const colWidths = ['30%', '20%', '20%', '20%', '10%'];

  return (
    <Page size="A4" style={s.contentPage}>
      <SectionHeading title="CORE WEB VITALS COMPARISON" />

      <View style={{ borderWidth: 1, borderColor: C.border }}>
        <View style={s.metricsHeader}>
          {['Metric', 'Site A', 'Site B', 'Better', '∆'].map((h, i) => (
            <Text key={h} style={[s.metricsHeaderCell, { width: colWidths[i] }]}>{h}</Text>
          ))}
        </View>

        {metricKeys.map((key, i) => {
          const ma = a.metrics[key];
          const mb = b.metrics[key];
          const w = determineWinner(ma.score, mb.score);
          return (
            <View key={key} style={[s.metricsRow, i % 2 === 1 ? { backgroundColor: C.lightGray } : {}]}>
              <Text style={[s.metricsCell, s.metricsBold, { width: colWidths[0] }]}>{ma.label}</Text>
              <Text style={[s.metricsCell, { width: colWidths[1], color: w === 'a' ? C.orange : C.darkGray }]}>{ma.value}</Text>
              <Text style={[s.metricsCell, { width: colWidths[2], color: w === 'b' ? C.orange : C.darkGray }]}>{mb.value}</Text>
              <Text style={[s.metricsCell, s.metricsBold, { width: colWidths[3], color: w === 'tie' ? C.midGray : C.orange }]}>
                {w === 'tie' ? 'TIE' : w === 'a' ? 'SITE A' : 'SITE B'}
              </Text>
              <Text style={[s.metricsCell, { width: colWidths[4] }]}>
                {Math.abs(ma.score - mb.score)}
              </Text>
            </View>
          );
        })}
      </View>

      <PageFooter page={3} />
    </Page>
  );
}

function AiPage({ a, b, comparison }: { a: AuditReport; b: AuditReport; comparison: GeminiComparison }) {
  return (
    <Page size="A4" style={s.contentPage}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: C.border }}>
        <View style={s.sectionAccent} />
        <Text style={s.sectionTitle}>AI COMPARISON</Text>
        <View style={{ marginLeft: 10, borderWidth: 1, borderColor: C.orange, paddingHorizontal: 6, paddingVertical: 2 }}>
          <Text style={{ fontSize: 6, color: C.orange, fontFamily: 'Helvetica-Bold', letterSpacing: 1 }}>GEMINI 2.5 FLASH</Text>
        </View>
      </View>

      <Text style={s.subLabel}>EXECUTIVE SUMMARY</Text>
      <View style={s.summaryBox}>
        <Text style={s.summaryText}>{comparison.executiveSummary}</Text>
      </View>

      {/* Two-column strengths */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
        <View style={{ flex: 1, borderWidth: 1, borderColor: C.border, padding: 12 }}>
          <Text style={[s.subLabel, { marginTop: 0 }]}>{a.url} STRENGTHS</Text>
          {comparison.siteAStrengths.map((s2, i) => (
            <View key={i} style={s.listItem}>
              <View style={s.listBullet} />
              <Text style={s.listText}>{s2}</Text>
            </View>
          ))}
        </View>
        <View style={{ flex: 1, borderWidth: 1, borderColor: C.border, padding: 12 }}>
          <Text style={[s.subLabel, { marginTop: 0 }]}>{b.url} STRENGTHS</Text>
          {comparison.siteBStrengths.map((s2, i) => (
            <View key={i} style={s.listItem}>
              <View style={s.listBullet} />
              <Text style={s.listText}>{s2}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={s.subLabel}>KEY DIFFERENCES</Text>
      {comparison.keyDifferences.map((diff, i) => (
        <View key={i} style={s.listItem}>
          <Text style={{ fontSize: 9, color: C.orange, fontFamily: 'Helvetica-Bold', marginRight: 10, width: 14 }}>{i + 1}.</Text>
          <Text style={s.listText}>{diff}</Text>
        </View>
      ))}

      <Text style={s.subLabel}>RECOMMENDATIONS</Text>
      {comparison.recommendations.map((rec, i) => (
        <View key={i} style={s.listItem}>
          <View style={s.listBullet} />
          <Text style={s.listText}>{rec}</Text>
        </View>
      ))}

      <View style={{ marginTop: 24, padding: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.lightGray }}>
        <Text style={{ fontSize: 7, color: C.midGray, fontFamily: 'Helvetica', lineHeight: 1.6 }}>
          This comparison was generated using Google PageSpeed Insights (Lighthouse) data and Gemini AI analysis.
          Scores reflect mobile audits performed on {a.date}. Results may vary based on server load and page dynamism.
        </Text>
      </View>

      <PageFooter page={4} />
    </Page>
  );
}

// ---------------------------------------------------------------------------
// Root document
// ---------------------------------------------------------------------------

export interface ComparisonPdfProps {
  reportA: AuditReport;
  reportB: AuditReport;
  comparison?: GeminiComparison | null;
}

export function ComparisonPdfDocument({ reportA, reportB, comparison }: ComparisonPdfProps) {
  return (
    <Document
      title={`ZekoAudit Comparison — ${reportA.url} vs ${reportB.url}`}
      author="ZekoAudit"
      subject="Website Comparison Report"
      creator="ZekoAudit"
      producer="@react-pdf/renderer"
    >
      <CoverPage a={reportA} b={reportB} />
      <ScoresPage a={reportA} b={reportB} />
      <VitalsPage a={reportA} b={reportB} />
      {comparison && <AiPage a={reportA} b={reportB} comparison={comparison} />}
    </Document>
  );
}
