import { NextResponse } from "next/server";
import { sql } from "../../../../lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const lang = (searchParams.get("lang") || "de") as "de" | "en" | "zh";

    if (!q) return NextResponse.json({ ok: true, rows: [] });

    const col =
      lang === "en" ? "en_text" : lang === "zh" ? "zh_text" : "de_text";

    // IMPORTANT: interpolate safely (do NOT string-concat SQL identifiers)
    const rows =
      col === "en_text"
        ? await sql`SELECT artikel, de_text, zh_text, en_text, unit, price
                    FROM catalog_items WHERE en_text ILIKE ${"%" + q + "%"} LIMIT 50;`
        : col === "zh_text"
        ? await sql`SELECT artikel, de_text, zh_text, en_text, unit, price
                    FROM catalog_items WHERE zh_text ILIKE ${"%" + q + "%"} LIMIT 50;`
        : await sql`SELECT artikel, de_text, zh_text, en_text, unit, price
                    FROM catalog_items WHERE de_text ILIKE ${"%" + q + "%"} LIMIT 50;`;

    return NextResponse.json({ ok: true, rows });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? String(err), rows: [] },
      { status: 500 }
    );
  }
}
