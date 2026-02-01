import { neon } from "@neondatabase/serverless";

const connectionString =
  process.env.POSTGRES_URL || process.env.Hamburg_FS_POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    "Missing DB connection string. Set POSTGRES_URL (recommended) or Hamburg_FS_POSTGRES_URL."
  );
}

export const sql = neon(connectionString);

// lib/db.ts
export function getDb() {
  const url = process.env.POSTGRES_URL;
  if (!url) throw new Error("POSTGRES_URL is missing");
  return neon(url);
}

