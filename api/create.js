// POST /api/create
// Original mail.tm temp email generator with optimized headers

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ status: false, error: "POST only" });
  }

  const customHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://mail.tm/"
  };

  try {
    // 1. Fetch available domains from mail.tm
    const domRes = await fetch("https://api.mail.tm/domains", { headers: customHeaders });
    if (!domRes.ok) throw new Error("Failed to fetch domains from mail.tm");
    
    const domData = await domRes.json();
    const domains = domData["hydra:member"] || [];
    if (!domains.length) throw new Error("No domains available");
    const domain = domains[0].domain;

    // 2. Generate random credentials
    const username = "jamal" + Math.random().toString(36).substring(2, 10);
    const password = "Pass" + Math.random().toString(36).substring(2, 10) + "123@";
    const address = `${username}@${domain}`;

    // 3. Create account on mail.tm
    const r = await fetch("https://api.mail.tm/accounts", {
      method: "POST",
      headers: customHeaders,
      body: JSON.stringify({ address, password })
    });

    if (r.status !== 201) {
      const errText = await r.text();
      return res.status(r.status).json({
        status: false,
        error: "Failed to create account",
        detail: errText.slice(0, 
