import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import type { AuditReport, GeminiComparison } from '@/types/audit';

// ---------------------------------------------------------------------------
// Prompt engineering — comparative analysis
// ---------------------------------------------------------------------------

function buildComparisonPrompt(a: AuditReport, b: AuditReport): string {
  const formatScores = (r: AuditReport) =>
    `  Performance: ${r.scores.performance}  |  SEO: ${r.scores.seo}  |  Accessibility: ${r.scores.accessibility}  |  Best Practices: ${r.scores.bestPractices}  |  Overall: ${r.overallScore}`;

  const formatMetrics = (r: AuditReport) =>
    Object.values(r.metrics)
      .map((m) => `    - ${m.label}: ${m.value} (score: ${m.score}, status: ${m.status})`)
      .join('\n');

  const formatIssues = (r: AuditReport) =>
    r.recommendations
      .filter((rec) => rec.impact !== 'passed')
      .slice(0, 6)
      .map((rec, i) => `    ${i + 1}. [${rec.impact.toUpperCase()}] ${rec.title} (${rec.category})`)
      .join('\n') || '    No significant issues.';

  return `You are a senior web performance consultant comparing two websites for a client.

## Site A: "${a.url}"
### Scores
${formatScores(a)}
### Core Web Vitals
${formatMetrics(a)}
### Top Issues
${formatIssues(a)}

## Site B: "${b.url}"
### Scores
${formatScores(b)}
### Core Web Vitals
${formatMetrics(b)}
### Top Issues
${formatIssues(b)}

## Your Task

Return a single JSON object (no markdown, no code fences) with EXACTLY this structure:

{
  "executiveSummary": "<2–3 sentence executive comparison for a non-technical stakeholder>",
  "siteAStrengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "siteBStrengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "keyDifferences": ["<difference 1>", "<difference 2>", "<difference 3>"],
  "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>"],
  "overallWinner": "<one of: a | b | tie>",
  "generatedAt": "<ISO 8601 timestamp>"
}

Rules:
- siteAStrengths: 3 specific things Site A does better than Site B.
- siteBStrengths: 3 specific things Site B does better than Site A.
- keyDifferences: 3 most impactful technical differences between the sites.
- recommendations: 3 actionable recommendations — who should do what.
- overallWinner: Based on aggregate scores and metric quality. Use "tie" only if scores are within 3 points.
- Be specific and reference actual metrics. Avoid generic statements.
- Do NOT include any text outside the JSON object.`;
}

// ---------------------------------------------------------------------------
// JSON extraction
// ---------------------------------------------------------------------------

function extractJson(raw: string): string {
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) return raw.slice(start, end + 1).trim();
  return raw.trim();
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest): Promise<NextResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Gemini API key not configured', details: 'Set GEMINI_API_KEY in .env.local' },
      { status: 503 }
    );
  }

  let reportA: AuditReport;
  let reportB: AuditReport;
  try {
    const body = await req.json();
    reportA = body.reportA;
    reportB = body.reportB;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!reportA?.url || !reportA?.scores || !reportB?.url || !reportB?.scores) {
    return NextResponse.json(
      { error: 'Missing required fields: reportA and reportB with url and scores' },
      { status: 400 }
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildComparisonPrompt(reportA, reportB);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
        maxOutputTokens: 8192,
      },
    });

    const rawText = response.text ?? '';
    const jsonString = extractJson(rawText);

    let comparison: GeminiComparison;
    try {
      comparison = JSON.parse(jsonString);
    } catch {
      console.error('[gemini-comparison] Failed to parse JSON:', jsonString.slice(0, 500));
      return NextResponse.json(
        { error: 'Parse Error', details: 'Gemini returned unparseable JSON.' },
        { status: 502 }
      );
    }

    if (!comparison.generatedAt) {
      comparison.generatedAt = new Date().toISOString();
    }

    return NextResponse.json(comparison, {
      headers: { 'Cache-Control': 'private, max-age=600' },
    });
  } catch (err: unknown) {
    const errorObj = err as { status?: number; message?: string };
    console.error('[gemini-comparison] API Error:', errorObj?.message);
    const status = errorObj?.status === 429 ? 429 : 502;
    return NextResponse.json(
      {
        error: errorObj?.status === 429 ? 'Rate Limit Exceeded' : 'Gemini API Error',
        details: errorObj?.message ?? 'An unexpected error occurred calling Gemini.',
      },
      { status }
    );
  }
}
