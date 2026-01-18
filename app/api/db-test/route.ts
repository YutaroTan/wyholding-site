import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const url = process.env.POSTGRES_URL;

    if (!url) {
      return NextResponse.json(
        { ok: false, error: "POSTGRES_URL is missing (check .env.local / Vercel env vars)" },
        { status: 500 }
      );
    }

    const sql = neon(url);

    // simple DB ping that doesn’t require any tables yet
    const rows = await sql`SELECT now() as now;`;

    return NextResponse.json({
      ok: true,
      db_now: rows[0]?.now ?? null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
