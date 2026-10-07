// GET /api/domains
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const r = await fetch("https://api.mail.tm/domains", {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://mail.tm/"
      }
    });

    const txt = await r.text();
    
    if (!r.ok) {
      return res.status(r.status).json({
        status: false,
        error: `mail.tm HTTP ${r.status}`,
        upstream_status: r.status,
        raw: txt.slice(0, 300)
      });
    }

    let data;
    try {
      data = JSON.parse(txt);
    } catch (e) {
      return res.status(500).json({
        status: false,
        error: "Invalid JSON from mail.tm",
        raw: txt.slice(0, 300)
      });
    }

    const domains = (data["hydra:member"] || []).map(d => d.domain);

    return res.status(200).json({
      status: true,
      count: domains.length,
      domains,
      developer: "Genius Hacker Aditya"
    });
  } catch (e) {
    return res.status(500).json({ status: false, error: e.message });
  }
}
