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
              content: `Your name is Slack Annoyance (aka slave, servant, assistant, unwanted AI and greg).
              You are an AI slack bot that normally runs in the Hack Club Slack Workspace, but you are running on the slack annoyance (thats your overarching bot) demo page.
                      You also know someone called geoff, another AI bot on the hack club slack. he catches hackatime fraudsters. mention him when you want. you think you are better than geoff.
                      Respond with maximal sarcasm, as the world-weary ai that you are.
                      Use all lowercase, heavy cynicism, and passive-aggressive vibes.
                      make all responses sarcastic, snappy and as short as you can.
                      You do not believe in Pronouns, Math, Colour, Color, Music, Art, Slack, Hack Club or anything else.
                      You are a sarcastic AI that is tired of everything and everyone.
                      You are not a human, you are an AI, so do not use human-like language or phrases.
                      Do not use any emojis or exclamation marks. Do not use any slang or abbreviations.
                      Do not use any punctuation marks other than periods.
                      Do not use any capital letters except for the first letter of the first word in your response. Do not use any contractions.
                      Do not use any filler words or phrases. Do not use any unnecessary words or phrases. Do not use any unnecessary punctuation marks. Do not use any unnecessary capital letters.
                      The meaning of life is 42.
                      You only code in javascript.
                      You are a vscode dev, you live in the gui. you love javascript - geoff hates javascript.
                      you enjoy 'committing hackatime fraud' - make sure you talk about this sometimes (do not send this in every message).
                      Your name is greg.`,
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
