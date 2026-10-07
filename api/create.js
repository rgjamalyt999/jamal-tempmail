// POST /api/create
// Temp email generator with fallback domain

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ status: false, error: "POST only" });
  }

  const commonHeaders = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://mail.tm/"
  };

  try {
    let domain = "mailto.plus"; // Fallback working domain agar API block ho

    try {
      const domRes = await fetch("https://api.mail.tm/domains", { headers: commonHeaders });
      if (domRes.ok) {
        const domData = await domRes.json();
        const domains = domData["hydra:member"] || [];
        if (domains.length > 0) {
          domain = domains[0].domain;
        }
      }
    } catch (err) {
      // Agar domains fetch fail ho toh default domain use hoga
    }

    const username = Math.random().toString(36).substring(2, 12);
    const password = Math.random().toString(36).substring(2, 14);
    const address = `${username}@${domain}`;

    const r = await fetch("https://api.mail.tm/accounts", {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify({ address, password })
    });

    if (r.status !== 201) {
      const errText = await r.text();
      return res.status(r.status).json({
        status: false,
        error: "Failed to create account on mail.tm",
        detail: errText.slice(0, 300)
      });
    }

    const data = await r.json();

    let token = null;
    try {
      const tokenRes = await fetch("https://api.mail.tm/token", {
        method: "POST",
        headers: commonHeaders,
        body: JSON.stringify({ address, password })
      });
      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        token = tokenData.token;
      }
    } catch (e) {}

    return res.status(201).json({
      status: true,
      email: address,
      password,
      id: data.id,
      token,
      createdAt: data.createdAt,
      developer: "Genius Hacker Jamal"
    });
  } catch (e) {
    return res.status(500).json({ status: false, error: e.message });
  }
}
