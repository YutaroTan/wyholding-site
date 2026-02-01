import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";

export async function GET() {
  try {
    const sql = getDb();

    const rows = await sql`
      select
        artikel,
        de_text,
        zh_text,
        en_text,
        unit,
        price
      from catalog_items
      order by artikel asc
      limit 50
    `;

    return NextResponse.json({ ok: true, rows });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? String(err), rows: [] },
      { status: 500 }
    );
  }
}
