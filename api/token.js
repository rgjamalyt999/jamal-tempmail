// POST /api/token
// Body: {"address": "...", "password": "..."}
// Auth token lo

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ status: false, error: "POST only" });
  }

  const { address, password } = req.body || {};
  if (!address || !password) {
    return res.status(400).json({
      status: false,
      error: "address & password required"
    });
  }

  try {
    const r = await fetch("https://api.mail.tm/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, password })
    });

    if (!r.ok) {
      return res.status(r.status).json({
        status: false,
        error: "Invalid credentials or rate limited"
      });
    }

    const data = await r.json();
    return res.status(200).json({
      status: true,
      token: data.token,
      id: data.id,
      developer: "Genius Hacker Aditya"
    });
  } catch (e) {
    return res.status(500).json({ status: false, error: e.message });
  }
}
