// POST /api/create
// Temp email generator using alternative reliable API

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ status: false, error: "POST only" });
  }

  try {
    // Generate random credentials
    const username = "jamal" + Math.random().toString(36).substring(2, 8);
    const domain = "1secmail.com";
    const address = `${username}@${domain}`;

    return res.status(201).json({
      status: true,
      email: address,
      password: "N/A",
      id: username,
      token: username,
      createdAt: new Date().toISOString(),
      developer: "Genius Hacker Jamal"
    });
  } catch (e) {
    return res.status(500).json({ status: false, error: e.message });
  }
}
