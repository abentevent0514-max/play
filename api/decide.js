import { load, save } from "./_store.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  const { id, approved, by } = req.body || {};
  if (!id || !by) return res.status(400).json({ error: "bad" });
  try {
    const d = await load();
    const r = d.requests.find((r) => r.id === id && r.status === "pending");
    if (!r) return res.status(404).json({ error: "notfound" });
    r.status = approved ? "approved" : "rejected";
    r.decidedBy = by;
    r.decidedAt = Date.now();
    await save(d);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "store" });
  }
}
