//? API route: fetches a URL server-side and extracts Open Graph meta tags.
// Called as GET /api/og?url=<encoded-url>
import { NextRequest, NextResponse } from "next/server";

// Extracts a named <meta> tag content value from raw HTML using regex.
const getMeta = (html: string, property: string): string => {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
    "i",
  );
  const alt = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
    "i",
  );
  return (html.match(re) || html.match(alt) || [])[1]?.trim() ?? "";
};

// Extracts <title> tag text as fallback when og:title is missing.
const getTitle = (html: string): string =>
  (html.match(/<title[^>]*>([^<]+)<\/title>/i) || [])[1]?.trim() ?? "";

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("url");
  if (!raw) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Only allow public HTTP/HTTPS — block local/private addresses
  if (!["http:", "https:"].includes(url.protocol)) {
    return NextResponse.json({ error: "Disallowed protocol" }, { status: 400 });
  }

  try {
    const res = await fetch(url.toString(), {
      headers: {
        // Mimic a browser to avoid bot blocks
        "User-Agent":
          "Mozilla/5.0 (compatible; OGBot/1.0; +https://github.com)",
        Accept: "text/html",
      },
      // Only read the first 100 KB — enough for <head> tags
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream ${res.status}` },
        { status: 502 },
      );
    }

    // Read only the <head> portion to keep it fast
    const reader = res.body?.getReader();
    let html = "";
    const decoder = new TextDecoder();
    const MAX_BYTES = 100_000;
    let bytes = 0;

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        html += decoder.decode(value, { stream: true });
        bytes += value.byteLength;
        // Stop once we have the </head> tag or exceed the byte limit
        if (html.includes("</head>") || bytes > MAX_BYTES) {
          reader.cancel();
          break;
        }
      }
    }

    const data = {
      title: getMeta(html, "og:title") || getTitle(html),
      description: getMeta(html, "og:description") || getMeta(html, "description"),
      image: getMeta(html, "og:image"),
      siteName: getMeta(html, "og:site_name") || url.hostname,
      url: getMeta(html, "og:url") || raw,
    };

    return NextResponse.json(data, {
      headers: {
        // Cache preview for 1 hour at the CDN edge
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Fetch failed" }, { status: 502 });
  }
}
