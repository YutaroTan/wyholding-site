"use client";

import { useEffect, useState } from "react";

type Item = {
  artikel: string;
  de_text: string | null;
  zh_text: string | null;
  en_text: string | null;
  unit: string | null;
  price: number | null;
};

export default function CatalogPage() {
  const [rows, setRows] = useState<Item[]>([]);
  const [q, setQ] = useState("");
  const [lang, setLang] = useState<"de" | "en" | "zh">("de");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadInitial() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/items");
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed");
      setRows(data.rows);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  async function search() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/items/search?q=${encodeURIComponent(q)}&lang=${lang}`
      );
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed");
      setRows(Array.isArray(data.rows) ? data.rows : []);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInitial();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Catalog</h1>

      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <select value={lang} onChange={(e) => setLang(e.target.value as any)}>
          <option value="de">DE</option>
          <option value="en">EN</option>
          <option value="zh">ZH</option>
        </select>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search..."
          style={{ flex: 1 }}
        />

        <button onClick={search} disabled={loading}>
          Search
        </button>

        <button onClick={loadInitial} disabled={loading}>
          Reset
        </button>
      </div>

      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {loading && <p>Loading...</p>}

      <table border={1} cellPadding={8} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Artikel</th>
            <th>DE</th>
            <th>ZH</th>
            <th>EN</th>
            <th>Unit</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {(rows ?? []).map((r, i) => (
            <tr key={i}>
              <td>{r.artikel}</td>
              <td>{r.de_text}</td>
              <td>{r.zh_text}</td>
              <td>{r.en_text}</td>
              <td>{r.unit}</td>
              <td>{r.price ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}