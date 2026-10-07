// POST /api/create
// Body (optional): {"domain": "example.com", "password": "xyz", "username": "abc"}
// Temp email banao

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ status: false, error: "POST only" });
  }

  // Anti-Bot Headers (Taki mail.tm server block na kare)
  const commonHeaders = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://mail.tm/"
  };

  try {
    const body = req.body || {};
    let domain = body.domain;
    let password = body.password;
    let username = body.username;

    // Domain fetch agar nahi diya
    if (!domain) {
      const domRes = await fetch("https://api.mail.tm/domains", { headers: commonHeaders });
      if (!domRes.ok) throw new Error("Failed to fetch domains - Vercel blocked by mail.tm");
      const domData = await domRes.json();
      const domains = domData["hydra:member"] || [];
      if (!domains.length) throw new Error("No domains available");
      domain = domains[0].domain;
    }

    // Random username agar nahi diya
    if (!username) {
      username = Math.random().toString(36).substring(2, 12);
    }

    // Random password agar nahi diya
    if (!password) {
      password = Math.random().toString(36).substring(2, 14);
    }

    const address = `${username}@${domain}`;

    // Account create
    const r = await fetch("https://api.mail.tm/accounts", {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify({ address, password })
    });

    if (r.status !== 201) {
      const errText = await r.text();
      return res.status(r.status).json({
        status: false,
        error: "Failed to create account",
        detail: errText.slice(0, 300)
      });
    }

    const data = await r.json();

    // Auto token
    let token = null;
    const tokenRes = await fetch("https://api.mail.tm/token", {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify({ address, password })
    });

    if (tokenRes.ok) {
      const tokenData = await tokenRes.json();
      token = tokenData.token;
    }

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
