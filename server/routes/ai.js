const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an AI that summarizes Excel data." },
          { role: "user", content: `Summarize this data: ${text}` }
        ]
      })
    });

    const body = await response.json();
    res.json({ summary: body.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI summarization failed" });
  }
});

module.exports = router;
