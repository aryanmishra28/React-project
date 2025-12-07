// controllers/resumeController.js

export const analyzeResume = async (req, res) => {
  try {
    // File not uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a resume file" });
    }

    const fileName = req.file.originalname.toLowerCase();

    // --- SIMPLE RULE-BASED ANALYSIS ---
    let score = 60;
    let strengths = [];
    let weaknesses = [];
    let role = "Software Developer";

    if (fileName.includes("react") || fileName.includes("frontend")) {
      strengths.push({ title: "Frontend Skills", description: "React detected" });
      role = "Frontend Developer";
      score += 10;
    }

    if (fileName.includes("java") || fileName.includes("python")) {
      strengths.push({ title: "Programming Language", description: "Java/Python detected" });
      score += 5;
    }

    if (!fileName.includes("project")) {
      weaknesses.push({ title: "Projects", description: "Projects section missing in filename" });
    }

    if (!fileName.includes("experience")) {
      weaknesses.push({ title: "Experience", description: "Experience section unclear" });
    }

    // Final mock response
    return res.json({
      file: req.file.originalname,
      score,
      role,
      strengths,
      weaknesses
    });

  } catch (error) {
    console.error("Resume analysis error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
