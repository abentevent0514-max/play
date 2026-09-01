// 共有ストア: Upstash Redis (Vercel Marketplace) の REST API を素の fetch で叩く。
// 環境変数が無い場合はインスタンス内メモリにフォールバック（非永続・動作確認用）。
const KEY = "guilty:data";
const URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

globalThis.__guiltyMem = globalThis.__guiltyMem || null;

async function redis(cmd) {
  const res = await fetch(URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
  });
  if (!res.ok) throw new Error("kv " + res.status);
  return (await res.json()).result;
}

export function emptyState() {
  return { accounts: [], requests: [], usedTickets: [] };
}

export async function load() {
  if (!URL) return globalThis.__guiltyMem || emptyState();
  const raw = await redis(["GET", KEY]);
  return raw ? JSON.parse(raw) : emptyState();
}

export async function save(d) {
  if (!URL) { globalThis.__guiltyMem = d; return; }
  await redis(["SET", KEY, JSON.stringify(d)]);
}
