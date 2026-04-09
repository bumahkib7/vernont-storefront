import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || "";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (REVALIDATE_SECRET && authHeader !== `Bearer ${REVALIDATE_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const tag = body.tag || "products";

    revalidateTag(tag);

    return NextResponse.json({ revalidated: true, tag });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
