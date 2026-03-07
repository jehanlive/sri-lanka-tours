import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Vercel sets x-vercel-ip-country; Cloudflare sets cf-ipcountry.
  // Falls back to "US" in local dev where neither header is present.
  const country =
    req.headers.get("x-vercel-ip-country") ??
    req.headers.get("cf-ipcountry") ??
    "US";

  return NextResponse.json({ country });
}
