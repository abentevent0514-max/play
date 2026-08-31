import { load } from "./_store.js";

export default async function handler(req, res) {
  try {
    res.status(200).json(await load());
  } catch (e) {
    res.status(500).json({ error: "store" });
  }
}
