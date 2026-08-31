import { randomUUID } from "node:crypto";
import { load, save } from "./_store.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  const { from, type } = req.body || {};
  if (!from || !["late", "kept"].includes(type)) return res.status(400).json({ error: "bad" });
  try {
    const d = await load();
    if (!d.accounts.some((a) => a.id === from)) return res.status(400).json({ error: "who" });
    // 同種の pending は同時に1件まで
    if (!d.requests.some((r) => r.status === "pending" && r.from === from && r.type === type)) {
      d.requests.push({ id: randomUUID(), from, type, status: "pending", createdAt: Date.now() });
      await save(d);
    }
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "store" });
  }
}
