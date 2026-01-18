import postgres from "postgres";

const connectionString =
  process.env.Hamburg_FS_POSTGRES_URL ||
  process.env.Hamburg_FS_POSTGRES_URL_NON_POOLING ||
  process.env.Hamburg_FS_POSTGRES_PRISMA_URL;

if (!connectionString) {
  throw new Error(
    "Missing DB connection string. Expected Hamburg_FS_POSTGRES_URL (recommended)."
  );
}

declare global {
  // eslint-disable-next-line no-var
  var __sql: ReturnType<typeof postgres> | undefined;
}

export const sql =
  global.__sql ??
  postgres(connectionString, {
    ssl: "require",
    max: 1,
  });

if (process.env.NODE_ENV !== "production") global.__sql = sql;
