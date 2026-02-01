import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";

export async function GET() {
  try {
    const rows = await sql`SELECT now() as db_now`;
    return NextResponse.json({ ok: true, db_now: rows[0].db_now });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
