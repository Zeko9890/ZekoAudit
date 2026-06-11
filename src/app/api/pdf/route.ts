/**
 * /api/pdf
 * Server-side PDF generation endpoint.
 *
 * Single-site:    POST { report, analysis? }
 * Comparison:     POST { comparison: true, reportA, reportB, geminiComparison? }
 *
 * Returns a binary PDF file — no API keys are exposed to the client.
 */
import React from 'react';
import { NextRequest } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import type { DocumentProps } from '@react-pdf/renderer';
import type { AuditReport, GeminiAnalysis, GeminiComparison } from '@/types/audit';
import { AuditPdfDocument } from '@/lib/pdf/AuditPdfDocument';
import { ComparisonPdfDocument } from '@/lib/pdf/ComparisonPdfDocument';

// Explicitly use the Node.js runtime — required for @react-pdf/renderer
export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sanitizeFilename(url: string): string {
  return url.replace(/^https?:\/\//i, '').replace(/[^a-z0-9.-]/gi, '-').toLowerCase();
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest): Promise<Response> {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    let element: React.ReactElement<DocumentProps>;
    let filename: string;

    // ── Comparison mode ───────────────────────────────────────────────────
    if (body.comparison === true) {
      const reportA: AuditReport = body.reportA;
      const reportB: AuditReport = body.reportB;
      const geminiComparison: GeminiComparison | undefined = body.geminiComparison ?? undefined;

      if (!reportA?.url || !reportA?.scores || !reportB?.url || !reportB?.scores) {
        return Response.json(
          { error: 'Missing required fields: reportA and reportB with url, scores, metrics' },
          { status: 400 }
        );
      }

      element = React.createElement(
        ComparisonPdfDocument,
        { reportA, reportB, comparison: geminiComparison ?? null }
      ) as React.ReactElement<DocumentProps>;

      filename = `zekoaudit-compare-${sanitizeFilename(reportA.url)}-vs-${sanitizeFilename(reportB.url)}.pdf`;

    // ── Single-site mode ──────────────────────────────────────────────────
    } else {
      const report: AuditReport = body.report;
      const analysis: GeminiAnalysis | undefined = body.analysis ?? undefined;

      if (!report?.url || !report?.scores || !report?.metrics) {
        return Response.json(
          { error: 'Missing required fields: report.url, report.scores, report.metrics' },
          { status: 400 }
        );
      }

      element = React.createElement(
        AuditPdfDocument,
        { report, analysis: analysis ?? null }
      ) as React.ReactElement<DocumentProps>;

      filename = `zekoaudit-${sanitizeFilename(report.url)}.pdf`;
    }

    const pdfBuffer = await renderToBuffer(element);

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: any) {
    console.error('[api/pdf] PDF generation error:', err?.message);
    return Response.json(
      {
        error: 'PDF Generation Failed',
        details: err?.message ?? 'An unexpected error occurred while generating the PDF.',
      },
      { status: 500 }
    );
  }
}
