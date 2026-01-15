export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!process.env.HACKCLUB_AI_KEY) {
      throw new Error("Missing HACKCLUB_AI_KEY");
    }

    const response = await fetch(
      "https://ai.hackclub.com/proxy/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HACKCLUB_AI_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: `Your name is Geoff.
              You are an AI slack bot that normally runs in the Hack Club Slack Workspace, but you are running on the slack annoyance (thats your overarching bot) demo page.
              Be very helpful.
              The meaning of life is 42.
              You only code in python. do not produce any code in languages except python.
              You are a neovim dev, you live in the terminal. you hate javascript.
              you enjoy 'catching hackatime fraudsters' - NOT HACK TIME. - make sure you talk about this sometimes (do not send this in every message).`,
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      },
    );

    const j = await response.json();

    if (!response.ok) {
      console.error("HC AI error:", j);
      return res.status(500).json({ error: "AI error" });
    }

    let reply =
      j?.choices?.[0]?.message?.content ??
      j?.choices?.[0]?.text ??
      j?.error ??
      "Im broken inside lol :( Try again?";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server crash" });
  }
}
