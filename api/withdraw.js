import { load, save } from "./_store.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  const { id } = req.body || {};
  if (!id) return res.status(400).json({ error: "bad" });
  try {
    const d = await load();
    const before = d.requests.length;
    d.requests = d.requests.filter((r) => !(r.id === id && r.status === "pending"));
    if (d.requests.length !== before) await save(d);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "store" });
  }
}
