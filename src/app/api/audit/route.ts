import { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Solution descriptions mapped from Lighthouse audit IDs
// ---------------------------------------------------------------------------
function getRecommendationSolution(auditId: string, defaultDescription: string): string {
  const solutionMap: Record<string, string> = {
    'render-blocking-resources': 'Inline critical CSS, defer non-critical JS scripts, and remove unused styles.',
    'unused-javascript': 'Code-split your bundles, use dynamic imports, and lazy-load components not needed on initial load.',
    'unused-css-rules': 'Remove unused classes from stylesheets and defer CSS not used for above-the-fold content.',
    'uses-responsive-images': 'Use srcset attributes, picture tags, or the Next.js Image component to serve appropriately sized images.',
    'modern-image-formats': 'Convert images to WebP or AVIF format to reduce file sizes without quality loss.',
    'meta-description': 'Add a descriptive <meta name="description" content="..."> tag to your HTML head.',
    'image-alt': 'Add descriptive alt attributes to all content-bearing images, or alt="" for decorative ones.',
    'link-text': 'Replace generic link text like "click here" with specific descriptive labels describing the destination.',
    'document-title': 'Add a descriptive <title> tag within the <head> block of your document.',
    'color-contrast': 'Increase contrast between background and foreground to meet WCAG AA requirements (min 4.5:1).',
    'is-on-https': 'Configure permanent 301 redirects to forward all HTTP traffic to HTTPS and use TLS 1.3.',
    'deprecations': 'Update deprecated library calls and legacy APIs to modern standards for security and stability.',
    'uses-text-compression': 'Enable gzip or Brotli compression on your server to reduce transfer sizes.',
    'uses-long-cache-ttl': 'Set long cache-control max-age headers (>1yr) on static assets and fingerprint their filenames.',
    'efficient-animated-content': 'Use video formats (MPEG4/WebM) instead of GIF for animated content.',
    'total-byte-weight': 'Reduce total page weight by compressing assets, removing unused scripts, and lazy-loading images.',
  };

  return solutionMap[auditId] || defaultDescription.replace(/\[Learn more\]\(.*?\)\.?/g, '').trim();
}

// ---------------------------------------------------------------------------
// URL validation — accepts plain hostnames (stripe.com) and full URLs
// ---------------------------------------------------------------------------
function normalizeAndValidateUrl(raw: string): { url: string; error: string | null } {
  let targetUrl = raw.trim();

  // Strip any surrounding quotes
  targetUrl = targetUrl.replace(/^["']|["']$/g, '');

  // Prepend https:// if no protocol given
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = 'https://' + targetUrl;
  }

  try {
    const parsed = new URL(targetUrl);

    // Must have a valid TLD (at least one dot in hostname, not localhost)
    const hostname = parsed.hostname;
    if (!hostname || hostname === 'localhost' || !hostname.includes('.')) {
      return { url: '', error: 'Please provide a publicly accessible URL (e.g., stripe.com).' };
    }

    // Reject IP addresses
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
      return { url: '', error: 'IP address URLs are not supported. Please provide a domain name.' };
    }

    return { url: targetUrl, error: null };
  } catch {
    return { url: '', error: 'Invalid URL format. Please provide a valid address (e.g., https://example.com).' };
  }
}

// ---------------------------------------------------------------------------
// Map raw PageSpeed / Lighthouse JSON → our AuditReport shape
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapLighthouseResponse(targetUrl: string, data: any) {
  const getCategoryScore = (catId: string): number => {
    const cat = data.lighthouseResult?.categories?.[catId];
    if (!cat || cat.score === null || cat.score === undefined) return 0;
    return Math.round(cat.score * 100);
  };

  const performance = getCategoryScore('performance');
  const accessibility = getCategoryScore('accessibility');
  const bestPractices = getCategoryScore('best-practices');
  const seo = getCategoryScore('seo');
  const overallScore = Math.round((performance + accessibility + bestPractices + seo) / 4);

  const getMetric = (auditId: string, label: string) => {
    const audit = data.lighthouseResult?.audits?.[auditId];
    const rawScore = audit?.score;
    const score = rawScore !== null && rawScore !== undefined ? Math.round(rawScore * 100) : 0;
    const value = audit?.displayValue || 'N/A';
    const status: 'good' | 'average' | 'poor' = score >= 90 ? 'good' : score >= 50 ? 'average' : 'poor';
    const description = audit?.description
      ? audit.description.replace(/\[Learn more\]\(.*?\)\.?/g, '').trim()
      : '';
    return { label, value, score, status, description };
  };

  const metrics = {
    fcp: getMetric('first-contentful-paint', 'First Contentful Paint'),
    lcp: getMetric('largest-contentful-paint', 'Largest Contentful Paint'),
    cls: getMetric('cumulative-layout-shift', 'Cumulative Layout Shift'),
    tbt: getMetric('total-blocking-time', 'Total Blocking Time'),
    speedIndex: getMetric('speed-index', 'Speed Index'),
  };

  // Audit items we want to surface as recommendations
  const auditsToMap = [
    { id: 'render-blocking-resources', category: 'performance', defaultTitle: 'Eliminate render-blocking resources' },
    { id: 'unused-javascript', category: 'performance', defaultTitle: 'Reduce unused JavaScript' },
    { id: 'unused-css-rules', category: 'performance', defaultTitle: 'Remove unused CSS' },
    { id: 'uses-responsive-images', category: 'performance', defaultTitle: 'Properly size images' },
    { id: 'modern-image-formats', category: 'performance', defaultTitle: 'Serve images in modern formats' },
    { id: 'uses-text-compression', category: 'performance', defaultTitle: 'Enable text compression' },
    { id: 'uses-long-cache-ttl', category: 'performance', defaultTitle: 'Serve static assets with long cache TTL' },
    { id: 'efficient-animated-content', category: 'performance', defaultTitle: 'Use efficient animated content formats' },
    { id: 'total-byte-weight', category: 'performance', defaultTitle: 'Avoid enormous network payloads' },
    { id: 'meta-description', category: 'seo', defaultTitle: 'Document has no meta description' },
    { id: 'image-alt', category: 'seo', defaultTitle: 'Image elements missing [alt] attributes' },
    { id: 'link-text', category: 'seo', defaultTitle: 'Links have non-descriptive text' },
    { id: 'document-title', category: 'seo', defaultTitle: 'Document missing <title> element' },
    { id: 'color-contrast', category: 'accessibility', defaultTitle: 'Text has insufficient contrast ratio' },
    { id: 'is-on-https', category: 'best-practices', defaultTitle: 'Does not use HTTPS' },
    { id: 'deprecations', category: 'best-practices', defaultTitle: 'Uses deprecated APIs' },
  ];

  const recommendations: { id: string; title: string; description: string; impact: string; category: string; solution: string; improvement: string }[] = [];
  const auditItems = data.lighthouseResult?.audits || {};

  auditsToMap.forEach((item) => {
    const audit = auditItems[item.id];
    if (!audit || audit.score === null || audit.score === undefined) return;

    const score = audit.score as number;
    const impact: 'high' | 'medium' | 'passed' = score >= 0.9 ? 'passed' : score < 0.5 ? 'high' : 'medium';

    let improvement = 'Passed';
    if (impact !== 'passed') {
      improvement =
        audit.displayValue ||
        (audit.numericValue ? `${Math.round(audit.numericValue)}ms` : 'Requires action');
    }

    const cleanDescription = audit.description
      ? audit.description.replace(/\[Learn more\]\(.*?\)\.?/g, '').trim()
      : '';

    // Convert 'best-practices' → 'bestPractices' to match the frontend camelCase key
    const categoryKey =
      item.category === 'best-practices' ? 'bestPractices' : item.category;

    recommendations.push({
      id: item.id,
      title: audit.title || item.defaultTitle,
      description: cleanDescription || 'No description provided.',
      impact,
      category: categoryKey,
      solution: getRecommendationSolution(item.id, cleanDescription),
      improvement,
    });
  });

  // Extract a clean site name from the URL
  let siteName = 'Website';
  try {
    const urlObj = new URL(targetUrl);
    const hostParts = urlObj.hostname.replace(/^www\./, '').split('.');
    if (hostParts.length > 0) {
      siteName = hostParts[0].charAt(0).toUpperCase() + hostParts[0].slice(1);
    }
  } catch {
    // ignore
  }

  // Sort: high → medium → passed
  recommendations.sort((a, b) => {
    const ranks: Record<string, number> = { high: 0, medium: 1, passed: 2 };
    return ranks[a.impact] - ranks[b.impact];
  });

  // Extract screenshot
  let screenshotUrl = undefined;
  const finalScreenshot = data.lighthouseResult?.audits?.['final-screenshot']?.details?.data;
  if (finalScreenshot) {
    screenshotUrl = finalScreenshot;
    console.log(`[audit] Successfully extracted final-screenshot data (${screenshotUrl.substring(0, 30)}...)`);
  } else {
    console.log(`[audit] WARNING: No final-screenshot data found in lighthouseResult.audits['final-screenshot'].`);
  }

  return {
    url: targetUrl.replace(/^https?:\/\/(www\.)?/, ''),
    name: siteName,
    overallScore,
    date: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    scores: { performance, seo, accessibility, bestPractices },
    metrics,
    recommendations,
    screenshotUrl,
  };
}

// ---------------------------------------------------------------------------
// Core handler
// ---------------------------------------------------------------------------
async function handleAudit(url: string | null): Promise<NextResponse> {
  if (!url) {
    return NextResponse.json({ error: 'Missing target website URL' }, { status: 400 });
  }

  const { url: targetUrl, error: urlError } = normalizeAndValidateUrl(url);
  if (urlError) {
    return NextResponse.json({ error: urlError }, { status: 400 });
  }

  const apiKey = process.env.PAGESPEED_API_KEY;
  if (!apiKey) {
    console.warn('[audit] PAGESPEED_API_KEY is not set — requests will be rate-limited.');
  }

  const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
  const categoriesParam = categories.map((c) => `category=${c}`).join('&');
  const apiEndpoint =
    `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed` +
    `?url=${encodeURIComponent(targetUrl)}` +
    `&${categoriesParam}` +
    `&strategy=mobile` +
    (apiKey ? `&key=${apiKey}` : '');

  const desktopEndpoint =
    `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed` +
    `?url=${encodeURIComponent(targetUrl)}` +
    `&category=performance` +
    `&strategy=desktop` +
    (apiKey ? `&key=${apiKey}` : '');

  // 40-second timeout — PageSpeed can be slow
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 40_000);

  try {
    const [mobileResult, desktopResult] = await Promise.allSettled([
      fetch(apiEndpoint, {
        signal: controller.signal,
        cache: 'no-store',
      }),
      fetch(desktopEndpoint, {
        signal: controller.signal,
        cache: 'no-store',
      })
    ]);

    clearTimeout(timeoutId);

    if (mobileResult.status === 'rejected') {
      throw mobileResult.reason;
    }

    const response = mobileResult.value;

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Google PageSpeed API returned status ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch {
        // ignore JSON parse error — use raw text
      }

      const status = response.status === 429 ? 429 : 502;
      return NextResponse.json(
        {
          error: response.status === 429 ? 'Rate Limit Exceeded' : 'PageSpeed API Error',
          details: errorMessage,
        },
        { status }
      );
    }

    const data = await response.json();

    if (!data.lighthouseResult) {
      return NextResponse.json(
        {
          error: 'Analysis Failed',
          details: 'The PageSpeed API ran but did not return Lighthouse results.',
        },
        { status: 502 }
      );
    }

    const report = mapLighthouseResponse(targetUrl, data);

    // Try to extract desktop screenshot
    if (desktopResult.status === 'fulfilled' && desktopResult.value.ok) {
      try {
        const desktopData = await desktopResult.value.json();
        const desktopScreenshot = desktopData.lighthouseResult?.audits?.['final-screenshot']?.details?.data;
        if (desktopScreenshot) {
          report.desktopScreenshotUrl = desktopScreenshot;
          console.log(`[audit] Successfully extracted desktop screenshot.`);
        }
      } catch {
        // Ignore JSON error for secondary request
      }
    }

    return NextResponse.json(report, {
      headers: {
        // Tell browsers / CDNs not to cache audit responses
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    const err = error as { name?: string; message?: string };
    if (err.name === 'AbortError') {
      return NextResponse.json(
        {
          error: 'Analysis Timeout',
          details:
            'The website audit took longer than 40 seconds. Please try again or use a faster connection.',
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        error: 'Network Error',
        details: err.message || 'Could not reach the PageSpeed API service.',
      },
      { status: 502 }
    );
  }
}

// ---------------------------------------------------------------------------
// Route exports
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  return handleAudit(searchParams.get('url'));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return handleAudit(body?.url ?? null);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 });
  }
}
