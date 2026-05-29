import { NextResponse } from "next/server";

/** Lightweight endpoint for uptime monitors (UptimeRobot, etc.) */
export async function GET() {
  return NextResponse.json(
    { ok: true, service: "career-simulator", ts: Date.now() },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}
