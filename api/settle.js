import { load, save } from "./_store.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  const { owner, side, lv, label } = req.body || {};
  if (!owner || !["devil", "saint"].includes(side) || !label) return res.status(400).json({ error: "bad" });
  try {
    const d = await load();
    d.settled = d.settled || [];
    d.resets = d.resets || [];
    // 精算 = 報酬の受け取り記録 + 双方の強さリセット
    d.settled.push({ at: Date.now(), owner, side, lv: lv | 0, label: String(label).slice(0, 40) });
    d.resets.push(Date.now());
    await save(d);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "store" });
  }
}
