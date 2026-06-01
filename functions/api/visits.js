const COUNTER_NAME = "site_visits";

const json = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

const getDatabase = (env) => env.DB || env.VISITOR_DB;

async function ensureCounter(db) {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS counters (
        name TEXT PRIMARY KEY,
        value INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,
    )
    .run();

  await db
    .prepare(
      `INSERT INTO counters (name, value)
       VALUES (?, 0)
       ON CONFLICT(name) DO NOTHING`,
    )
    .bind(COUNTER_NAME)
    .run();
}

async function readCounter(db) {
  const row = await db
    .prepare("SELECT value FROM counters WHERE name = ?")
    .bind(COUNTER_NAME)
    .first();

  return Number(row?.value || 0);
}

export async function onRequestGet({ env }) {
  const db = getDatabase(env);

  if (!db) {
    return json({ error: "Visitor database binding is not configured." }, 503);
  }

  await ensureCounter(db);

  return json({ visits: await readCounter(db) });
}

export async function onRequestPost({ env }) {
  const db = getDatabase(env);

  if (!db) {
    return json({ error: "Visitor database binding is not configured." }, 503);
  }

  await ensureCounter(db);

  await db
    .prepare(
      `UPDATE counters
       SET value = value + 1,
           updated_at = CURRENT_TIMESTAMP
       WHERE name = ?`,
    )
    .bind(COUNTER_NAME)
    .run();

  return json({ visits: await readCounter(db) });
}
