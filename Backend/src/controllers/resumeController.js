const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const analyzeResume = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Resume text is required.'
      });
    }

    const prompt = `Analyze the following resume and provide detailed feedback.
Return your response as a JSON object with this structure:
{
  "score": <number from 1-100>,
  "strengths": [{"title": "...", "description": "..."}],
  "weaknesses": [{"title": "...", "description": "..."}],
  "suggestions": "<string>"
}

Resume:
${resumeText.substring(0, 4000)}`;

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    if (!aiResponse.ok) {
      const errData = await aiResponse.json();
      console.error("OpenAI API Error:", errData);
      return res.status(aiResponse.status).json({
        success: false,
        message: "Failed to get AI analysis. Check API key."
      });
    }

    const data = await aiResponse.json();

    const content = data.choices[0].message.content;

    let json;
    try {
      json = JSON.parse(content);
    } catch (err) {
      console.warn("AI response is not JSON. Returning raw text.");
      return res.json({
        success: true,
        feedback: content,
        raw: true
      });
    }

    res.json({
      success: true,
      feedback: {
        score: json.score || 50,
        strengths: json.strengths || [],
        weaknesses: json.weaknesses || [],
        suggestions: json.suggestions || ""
      }
    });

  } catch (error) {
    console.error("Error analyzing resume:", error);
    res.status(500).json({
      success: false,
      message: "Failed to analyze resume."
    });
  }
};

module.exports = { analyzeResume };
