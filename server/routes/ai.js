const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const Analysis = require('../models/Analysis');
const auth = require('../middleware/auth');

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


router.post("/insight", auth, async (req, res) => {
  try {
    const { uploadId, summary, chartType, xAxis, yAxis } = req.body;
    
    const analysis = new Analysis({
      user: req.user.id,
      upload: uploadId,
      summary,
      chartType,
      xAxis,
      yAxis
    });
    
    await analysis.save();
    res.json({ msg: 'Insight saved successfully', insight: analysis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save insight" });
  }
});


router.get("/insights", auth, async (req, res) => {
  try {
    const insights = await Analysis.find({ user: req.user.id })
      .populate('upload', 'filename')
      .sort({ createdAt: -1 });
      
    res.json(insights);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch insights" });
  }
});

module.exports = router;