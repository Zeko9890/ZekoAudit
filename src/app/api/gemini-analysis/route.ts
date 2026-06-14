import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import type { AuditReport, GeminiAnalysis } from '@/types/audit';

// ---------------------------------------------------------------------------
// Prompt engineering
// ---------------------------------------------------------------------------

function buildPrompt(report: AuditReport): string {
  const { url, scores, metrics, recommendations, overallScore } = report;

  const issueList = recommendations
    .filter((r) => r.impact !== 'passed')
    .slice(0, 10)
    .map(
      (r, i) =>
        `  ${i + 1}. [${r.impact.toUpperCase()}] ${r.title} (${r.category})\n     ${r.description}`
    )
    .join('\n');

  const metricsList = Object.values(metrics)
    .map((m) => `  - ${m.label}: ${m.value} (score: ${m.score}/100, status: ${m.status})`)
    .join('\n');

  return `You are a senior web performance engineer writing a professional audit report for a client.

Analyze the following Google Lighthouse audit data for "${url}" and produce a structured JSON report.

## Audit Scores (0–100)
- Performance:    ${scores.performance}
- Accessibility:  ${scores.accessibility}
- SEO:            ${scores.seo}
- Best Practices: ${scores.bestPractices}
- Overall:        ${overallScore}

## Core Web Vitals & Metrics
${metricsList}

## Detected Issues (from Lighthouse)
${issueList || '  No significant issues detected.'}

## Your Task

Return a single JSON object (no markdown, no code fences, no extra text) with EXACTLY this structure:

{
  "executiveSummary": "<1–2 sentence executive summary for a non-technical stakeholder>",
  "verdict": "<one of: Excellent | Good | Fair | Poor>",
  "topIssues": [
    {
      "title": "<concise issue title>",
      "description": "<technical explanation in 1–2 sentences>",
      "fix": "<specific actionable fix in 1–2 sentences>",
      "priority": "<one of: critical | high | medium | low>",
      "category": "<one of: performance | seo | accessibility | bestPractices>",
      "estimatedImpact": "<e.g. '-1.2s LCP' or '+8 SEO score' or 'WCAG AA compliance'>"
    }
  ],
  "quickWins": [
    "<actionable quick-win string 1>",
    "<actionable quick-win string 2>",
    "<actionable quick-win string 3>"
  ],
  "strategicRecommendations": [
    "<long-term strategic recommendation 1>",
    "<long-term strategic recommendation 2>"
  ],
  "generatedAt": "<ISO 8601 timestamp>"
}

Rules:
- topIssues: Include 3–6 items, sorted from highest to lowest priority.
- quickWins: Include exactly 3 items — things achievable in under 1 hour of developer time.
- strategicRecommendations: Include exactly 2 items — architectural or process improvements.
- verdict must reflect the overall score: 90+ = Excellent, 75–89 = Good, 50–74 = Fair, <50 = Poor.
- Do NOT include any text outside the JSON object. Do NOT use markdown code fences.
- generatedAt must be the current UTC time in ISO 8601 format.`;
}

// ---------------------------------------------------------------------------
// JSON extraction — strips any markdown fences Gemini might add
// ---------------------------------------------------------------------------

function extractJson(raw: string): string {
  // Remove triple-backtick code fences (```json ... ``` or ``` ... ```)
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();

  // Otherwise find the first { ... } block
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    return raw.slice(start, end + 1).trim();
  }

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

  let report: AuditReport;
  try {
    report = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!report?.url || !report?.scores) {
    return NextResponse.json(
      { error: 'Missing required audit data (url, scores)' },
      { status: 400 }
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildPrompt(report);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        // Request JSON output explicitly
        responseMimeType: 'application/json',
        temperature: 0.3, // Low temperature for consistent, structured output
        maxOutputTokens: 8192,
      },
    });

    const rawText = response.text ?? '';
    const jsonString = extractJson(rawText);

    let analysis: GeminiAnalysis;
    try {
      analysis = JSON.parse(jsonString);
    } catch {
      console.error('[gemini-analysis] Failed to parse JSON:', jsonString.slice(0, 500));
      return NextResponse.json(
        {
          error: 'Analysis Parse Error',
          details: 'Gemini returned a response that could not be parsed as JSON.',
        },
        { status: 502 }
      );
    }

    // Ensure generatedAt is set even if model omits it
    if (!analysis.generatedAt) {
      analysis.generatedAt = new Date().toISOString();
    }

    return NextResponse.json(analysis, {
      headers: {
        // Cache Gemini analysis for 10 minutes — it's deterministic for the same scores
        'Cache-Control': 'private, max-age=600',
      },
    });
  } catch (err: unknown) {
    const errorObj = err as { status?: number; message?: string };
    console.error('[gemini-analysis] Gemini API error:', errorObj?.message);

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
