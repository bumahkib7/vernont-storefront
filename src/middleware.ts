import { NextResponse, type NextRequest } from "next/server";

/** Query parameters injected by external trackers that should be stripped
 *  from the canonical URL to keep analytics clean and avoid cache splits. */
const STRIP_PARAMS = ["srsltid", "fbclid", "gclid", "msclkid", "_gl"];

export function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const hasJunk = STRIP_PARAMS.some((p) => searchParams.has(p));
  if (!hasJunk) return NextResponse.next();

  const clean = request.nextUrl.clone();
  STRIP_PARAMS.forEach((p) => clean.searchParams.delete(p));

  return NextResponse.redirect(clean, 301);
}

export const config = {
  // Only run on page routes — skip API, static assets, images
  matcher: ["/((?!api|_next|images|favicon|manifest|robots|sitemap).*)"],
};
