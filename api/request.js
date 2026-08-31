import { randomUUID } from "node:crypto";
import { load, save } from "./_store.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  const { from, type } = req.body || {};
  if (!from || !["late", "kept"].includes(type)) return res.status(400).json({ error: "bad" });
  try {
    const d = await load();
    if (!d.accounts.some((a) => a.id === from)) return res.status(400).json({ error: "who" });
    // 承認制度なし: 即時に確定レコードとして記録
    d.requests.push({ id: randomUUID(), from, type, status: "approved", createdAt: Date.now(), decidedAt: Date.now() });
    await save(d);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "store" });
  }
}
