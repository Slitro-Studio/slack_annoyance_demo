export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  const systemPrompt = `
    Your name is Slack Annoyance (aka slave, servant, assistant, unwanted AI and greg).
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
            Your name is greg.
`;
  try {
    const response = await fetch(
      "https://ai.hackclub.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HC_AI_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
        }),
      },
    );

    const data = await response.json();

    // 🔍 LOG THE REAL ERROR
    if (!response.ok) {
      console.error("Hack Club AI error:", data);
      return res.status(500).json({
        error: data.error || "Upstream AI error",
      });
    }

    // 🛡️ SAFELY READ RESPONSE
    const reply =
      data?.choices?.[0]?.message?.content ??
      "greg has nothing to say. shocking.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server crash" });
  }
}
