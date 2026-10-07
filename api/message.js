// GET /api/message?id=XXX&token=XXX
// Ek message padho (full body)

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { id } = req.query;
  const token = req.query.token || (req.headers.authorization || "").replace("Bearer ", "");

  if (!id || !token) {
    return res.status(400).json({ status: false, error: "id & token required" });
  }

  try {
    const r = await fetch(`https://api.mail.tm/messages/${id}`, {
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

    const m = await r.json();

    return res.status(200).json({
      status: true,
      id: m.id,
      from: m.from,
      to: m.to,
      cc: m.cc,
      bcc: m.bcc,
      subject: m.subject,
      intro: m.intro,
      text: m.text,
      html: m.html,
      seen: m.seen,
      hasAttachments: m.hasAttachments,
      attachments: m.attachments,
      size: m.size,
      createdAt: m.createdAt,
      developer: "Genius Hacker Aditya"
    });
  } catch (e) {
    return res.status(500).json({ status: false, error: e.message });
  }
}
