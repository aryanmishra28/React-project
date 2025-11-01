const fetch = require('node-fetch');

// Analyze resume using OpenAI ✅ CORRECT APPROACH
const analyzeResume = async (req, res) => {
  try {
    // 1. Receive resume data from the frontend.
    const { resumeText } = req.body;

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Resume text is required.'
      });
    }

    // 2. Create a detailed prompt asking for structured JSON response
    const prompt = `Analyze the following resume and provide detailed feedback.
Return your response as a JSON object with this exact structure:
{
  "score": <number from 1-100>,
  "strengths": [
    {"title": "<strength title>", "description": "<detailed description>"}
  ],
  "weaknesses": [
    {"title": "<weakness title>", "description": "<detailed description>"}
  ],
  "suggestions": "<overall improvement suggestions>"
}

Analyze the following resume:
${resumeText.substring(0, 4000)}`; // Limit to avoid token limits

    // 3. Call OpenAI API with response_format to ensure JSON output
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
          content: prompt
        }],
        response_format: { type: 'json_object' } // Ensures JSON output
      })
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json();
      console.error('OpenAI API Error:', errorData);
      return res.status(aiResponse.status).json({ 
        success: false, 
        message: 'Failed to get AI analysis. Please check your API key.' 
      });
    }

    const data = await aiResponse.json();

    // 4. Extract and parse the AI-generated feedback (should be JSON)
    const feedbackContent = data.choices[0].message.content;
    
    let analysisResult;
    try {
      analysisResult = JSON.parse(feedbackContent);
    } catch (parseError) {
      // Fallback: If JSON parsing fails, return raw feedback
      console.warn('Failed to parse JSON, returning raw feedback');
      return res.json({ 
        success: true, 
        feedback: feedbackContent,
        raw: true // Flag to indicate unstructured response
      });
    }

    // 5. Validate and structure the response
    const structuredFeedback = {
      score: analysisResult.score || 50,
      strengths: analysisResult.strengths || [],
      weaknesses: analysisResult.weaknesses || [],
      suggestions: analysisResult.suggestions || 'No specific suggestions provided.'
    };

    // 6. Send structured feedback back to the frontend
    res.json({ success: true, feedback: structuredFeedback });

  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to analyze resume. Please try again later.' 
    });
  }
};

module.exports = {
  analyzeResume
};