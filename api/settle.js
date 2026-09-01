import { load, save } from "./_store.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  const { owner, side, lv, label, key } = req.body || {};
  if (!owner || !["devil", "saint"].includes(side) || !label) return res.status(400).json({ error: "bad" });
  try {
    const d = await load();
    d.settled = d.settled || [];
    d.resets = d.resets || [];
    // 精算 = 報酬の受け取り記録 + 双方の強さリセット。
    // 境界は現存イベントの最大時刻+1ms — クライアントの時計ずれに影響されない
    const maxEv = (d.requests || []).reduce((m, r) => Math.max(m, r.decidedAt || r.createdAt || 0), 0);
    const boundary = Math.max(Date.now(), maxEv + 1);
    d.settled.push({ at: boundary, owner, side, lv: lv | 0, label: String(label).slice(0, 40), key: String(key || "").slice(0, 80) });
    d.resets.push(boundary);
    await save(d);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "store" });
  }
}
