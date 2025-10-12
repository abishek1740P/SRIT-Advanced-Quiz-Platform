const { GoogleGenAI } = require("@google/genai");

// Generate quiz questions using AI
const generateQuestions = async (req, res) => {
  try {
    const { title, description, questionCount = 5 } = req.body;

    // Validate input
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Quiz title is required",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Quiz description is required",
      });
    }

    if (questionCount < 1 || questionCount > 30) {
      return res.status(400).json({
        success: false,
        message: "Question count must be between 1 and 30",
      });
    }

    // Initialize Gemini AI with the correct API key
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
Generate a quiz with exactly ${questionCount} multiple choice questions based on the following topic:


Description: ${description}

Requirements:
- Generate exactly ${questionCount} questions
- Each question should have 4 choices (A, B, C, D)
- Mark the correct answer (0-3 index where 0=first choice, 1=second choice, etc.)
- Each question should be worth 5 points
- Questions should be relevant to the topic
- Choices should be plausible and educational
- Format the response as a valid JSON array only

Return ONLY valid JSON in this exact format:
[
  {
    "questionText": "Question text here?",
    "choices": ["Choice A", "Choice B", "Choice C", "Choice D"],
    "correctAnswer": 0,
    "points": 5
  }
]

Do not include any additional text, explanations, or markdown formatting.
    `;

    console.log(`Generating ${questionCount} AI questions for: "${title}"`);

    // Use the correct model name from the documentation
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Use gemini-2.0-flash instead of gemini-pro
      contents: prompt,
    });

    const responseText = response.text?.trim();

    if (!responseText) {
      throw new Error("AI returned empty response");
    }

    // Extract JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("AI Response (no JSON found):", responseText);
      throw new Error("AI returned invalid response format");
    }

    let generatedQuestions;
    try {
      generatedQuestions = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("AI Response:", responseText);
      throw new Error("Failed to parse AI response as JSON");
    }

    // Validate the generated questions structure
    if (!Array.isArray(generatedQuestions)) {
      throw new Error("AI response is not an array");
    }

    // Validate each question
    const validatedQuestions = generatedQuestions.map((q, index) => {
      if (
        !q.questionText ||
        !Array.isArray(q.choices) ||
        q.choices.length !== 4
      ) {
        throw new Error(`Invalid question structure at index ${index}`);
      }

      // Ensure correctAnswer is within bounds
      const correctAnswer = Math.max(
        0,
        Math.min(3, parseInt(q.correctAnswer) || 0)
      );

      // Ensure all choices are strings
      const choices = q.choices
        .map((choice) => String(choice).trim())
        .filter((choice) => choice);

      if (choices.length !== 4) {
        throw new Error(
          `Question ${index + 1} must have exactly 4 non-empty choices`
        );
      }

      return {
        questionText: String(q.questionText).trim(),
        choices: choices,
        correctAnswer: correctAnswer,
        points: parseInt(q.points) || 5,
      };
    });

    res.json({
      success: true,
      message: `Successfully generated ${validatedQuestions.length} questions`,
      data: {
        questions: validatedQuestions,
        count: validatedQuestions.length,
      },
    });
  } catch (error) {
    console.error("AI Generation Error:", error);

    // Specific error handling
    if (
      error.message.includes("API key") ||
      error.message.includes("GEMINI_API_KEY")
    ) {
      return res.status(500).json({
        success: false,
        message: "AI service configuration error - check GEMINI_API_KEY",
        error: "Invalid API configuration",
      });
    }

    if (
      error.message.includes("quota") ||
      error.message.includes("rate limit")
    ) {
      return res.status(429).json({
        success: false,
        message: "AI service quota exceeded. Please try again later.",
        error: error.message,
      });
    }

    if (
      error.message.includes("model") ||
      error.message.includes("not found")
    ) {
      return res.status(500).json({
        success: false,
        message: "AI model configuration error",
        error: "Model not available",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to generate questions with AI",
      error: error.message,
    });
  }
};

// Health check for AI service
const checkAIHealth = async (req, res) => {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Simple test prompt
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Use gemini-2.0-flash
      contents: "Respond with 'OK' if working.",
    });

    res.json({
      success: true,
      message: "AI service is operational",
      data: {
        service: "Google Gemini",
        status: "active",
        response: response.text?.trim(),
      },
    });
  } catch (error) {
    console.error("AI Health Check Error:", error);
    res.status(503).json({
      success: false,
      message: "AI service is unavailable",
      error: error.message,
    });
  }
};

module.exports = {
  generateQuestions,
  checkAIHealth,
};
