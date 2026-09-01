import { load, save } from "./_store.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  const { key } = req.body || {};
  if (!key || typeof key !== "string") return res.status(400).json({ error: "bad" });
  try {
    const d = await load();
    d.usedTickets = d.usedTickets || [];
    if (!d.usedTickets.includes(key)) {
      d.usedTickets.push(key);
      await save(d);
    }
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "store" });
  }
}
