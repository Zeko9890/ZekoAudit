/**
 * /api/pdf
 * Server-side PDF generation endpoint.
 * Accepts { report: AuditReport, analysis?: GeminiAnalysis } via POST.
 * Returns a binary PDF file — no API keys are exposed to the client.
 */
import React from 'react';
import { NextRequest } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import type { DocumentProps } from '@react-pdf/renderer';
import type { AuditReport, GeminiAnalysis } from '@/types/audit';
import { AuditPdfDocument } from '@/lib/pdf/AuditPdfDocument';

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
  let report: AuditReport;
  let analysis: GeminiAnalysis | undefined;

  try {
    const body = await req.json();
    report = body.report;
    analysis = body.analysis ?? undefined;
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!report?.url || !report?.scores || !report?.metrics) {
    return Response.json(
      { error: 'Missing required fields: report.url, report.scores, report.metrics' },
      { status: 400 }
    );
  }

  try {
    const element = React.createElement(
      AuditPdfDocument,
      { report, analysis: analysis ?? null }
    ) as React.ReactElement<DocumentProps>;

    const pdfBuffer = await renderToBuffer(element);

    const filename = `zekoaudit-${sanitizeFilename(report.url)}.pdf`;

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
