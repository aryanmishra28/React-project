// routes/hackathon.js
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.post('/generate-ideas', async (req, res) => {
  try {
    const { interest, category, skillLevel } = req.body;

    const prompt = `Generate 5 unique hackathon ideas for a project in the "${category}" category. The ideas should be related to "${interest}" and be suitable for a "${skillLevel}" skill level. For each idea, provide a short description and a list of key technologies that could be used.`;

    // Call an AI service (e.g., OpenAI) to generate ideas.
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await aiResponse.json();
    const ideas = data.choices[0].message.content;

    res.json({ success: true, ideas });

  } catch (error) {
    console.error('Error generating hackathon ideas:', error);
    res.status(500).json({ success: false, message: 'Failed to generate ideas.' });
  }
});

module.exports = router;