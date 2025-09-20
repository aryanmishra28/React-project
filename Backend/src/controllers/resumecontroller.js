const fetch = require('node-fetch');

// Analyze resume
const analyzeResume = async (req, res) => {
  try {
    // 1. Receive resume data from the frontend.
    const { resumeText } = req.body;

    // 2. Call an AI service (e.g., OpenAI) to get feedback.
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: `Analyze the following resume and provide feedback on its strengths, weaknesses, and suggestions for improvement. Give it a score from 1-100.\n\nResume: ${resumeText}`
        }]
      })
    });

    const data = await aiResponse.json();

    // 3. Extract the AI-generated feedback.
    const feedback = data.choices[0].message.content;

    // 4. Send the feedback back to the frontend.
    res.json({ success: true, feedback });

  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({ success: false, message: 'Failed to analyze resume.' });
  }
};

module.exports = {
  analyzeResume
};