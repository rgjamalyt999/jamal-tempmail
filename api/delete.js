// DELETE /api/delete?id=XXX&token=XXX
// Account delete karo

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "DELETE") {
    return res.status(405).json({ status: false, error: "DELETE only" });
  }

  const { id } = req.query;
  const token = req.query.token || (req.headers.authorization || "").replace("Bearer ", "");

  if (!id || !token) {
    return res.status(400).json({ status: false, error: "id & token required" });
  }

  try {
    const r = await fetch(`https://api.mail.tm/accounts/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (r.status === 204) {
      return res.status(200).json({
        status: true,
        message: "Account deleted",
        developer: "Genius Hacker Aditya"
      });
    }

    return res.status(r.status).json({
      status: false,
      error: `Delete failed HTTP ${r.status}`
    });
  } catch (e) {
    return res.status(500).json({ status: false, error: e.message });
  }
}
