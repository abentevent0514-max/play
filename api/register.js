import { load, save } from "./_store.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  const name = String((req.body && req.body.name) || "").trim().slice(0, 16);
  if (!name) return res.status(400).json({ error: "name" });
  try {
    const d = await load();
    const found = d.accounts.find((a) => a.name === name);
    if (found) return res.status(200).json({ account: found });
    if (d.accounts.length >= 2) return res.status(409).json({ error: "full" });
    const acc = { id: "a" + (d.accounts.length + 1), name, createdAt: Date.now() };
    d.accounts.push(acc);
    await save(d);
    res.status(200).json({ account: acc });
  } catch (e) {
    res.status(500).json({ error: "store" });
  }
}
