// GET /api/messages?token=XXX
// Inbox list

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();

  const token = req.query.token || (req.headers.authorization || "").replace("Bearer ", "");
  if (!token) {
    return res.status(400).json({
      status: false,
      error: "token required (?token= or Bearer header)"
    });
  }

  try {
    const r = await fetch("https://api.mail.tm/messages", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    });

    if (!r.ok) {
      return res.status(r.status).json({
        status: false,
        error: `mail.tm HTTP ${r.status}`
      });
    }

    const data = await r.json();
    const messages = (data["hydra:member"] || []).map(m => ({
      id: m.id,
      from: m.from,
      to: m.to,
      subject: m.subject,
      intro: m.intro,
      seen: m.seen,
      hasAttachments: m.hasAttachments,
      size: m.size,
      createdAt: m.createdAt
    }));

    return res.status(200).json({
      status: true,
      count: messages.length,
      messages,
      developer: "Genius Hacker Aditya"
    });
  } catch (e) {
    return res.status(500).json({ status: false, error: e.message });
  }
}
