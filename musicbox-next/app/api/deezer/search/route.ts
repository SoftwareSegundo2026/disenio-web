import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  const limit = request.nextUrl.searchParams.get("limit") || "5";

  if (!q) {
    return NextResponse.json({ error: "Missing query param 'q'" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.deezer.com/search/track?q=${encodeURIComponent(q)}&limit=${limit}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Deezer API error" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
