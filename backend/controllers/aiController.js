const Groq = require("groq-sdk");

// Initialize Groq with API key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Generate quiz questions using Groq
const generateQuestions = async (req, res) => {
  try {
    const { title, description, questionCount = 5 } = req.body;

    console.log("Received request:", { title, description, questionCount });

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

    // Check if API key exists
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not set in environment variables");
      return res.status(500).json({
        success: false,
        message: "AI service configuration error - GROQ_API_KEY is missing",
      });
    }

    const prompt = `
Generate a quiz with exactly ${questionCount} multiple choice questions based on the following topic:

Title: ${title}
Description: ${description}

Requirements:
- Generate exactly ${questionCount} questions
- Each question should have 4 choices (A, B, C, D)
- Mark the correct answer (0-3 index where 0=first choice, 1=second choice, etc.)
- Each question should be worth 5 points
- Questions should be relevant to the topic
- Choices should be plausible and educational
- Format the response as a valid JSON array only

IMPORTANT: Return ONLY the JSON array, no other text, no markdown formatting, no explanations.

Example format:
[
  {
    "questionText": "What is 2+2?",
    "choices": ["3", "4", "5", "6"],
    "correctAnswer": 1,
    "points": 5
  }
]
    `;

    console.log("Sending request to Groq API...");

    // Make request to Groq API with updated model
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a quiz generator that outputs ONLY valid JSON arrays. Never include explanations, markdown, or any other text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      // Using llama-3.3-70b-versatile (current recommended model)
      model: "llama-3.3-70b-versatile", // Updated from decommissioned mixtral
      temperature: 0.7,
      max_tokens: 4000,
      top_p: 1,
    });

    console.log("Received response from Groq API");

    const responseText = chatCompletion.choices[0]?.message?.content?.trim();

    if (!responseText) {
      throw new Error("AI returned empty response");
    }

    console.log("Raw response:", responseText.substring(0, 200) + "...");

    // Try to parse the entire response as JSON first
    let generatedQuestions;
    try {
      generatedQuestions = JSON.parse(responseText);
    } catch (e) {
      // If that fails, try to extract JSON array
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          generatedQuestions = JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          console.error("JSON Parse Error:", parseError);
          console.error("Attempted to parse:", jsonMatch[0].substring(0, 300));
          throw new Error("Failed to parse AI response as JSON");
        }
      } else {
        console.error("No JSON array found in response:", responseText);
        throw new Error(
          "AI returned invalid response format - no JSON array found",
        );
      }
    }

    // Validate the generated questions structure
    if (!Array.isArray(generatedQuestions)) {
      throw new Error("AI response is not an array");
    }

    if (generatedQuestions.length === 0) {
      throw new Error("AI returned empty questions array");
    }

    // Validate each question
    const validatedQuestions = generatedQuestions.map((q, index) => {
      // Check required fields
      if (!q.questionText) {
        q.questionText = `Question ${index + 1}`;
      }

      if (!Array.isArray(q.choices)) {
        q.choices = ["Option A", "Option B", "Option C", "Option D"];
      }

      // Ensure we have exactly 4 choices
      let choices = [...q.choices];
      if (choices.length < 4) {
        // Pad with default options
        const defaultOptions = ["Option A", "Option B", "Option C", "Option D"];
        while (choices.length < 4) {
          choices.push(defaultOptions[choices.length]);
        }
      }
      if (choices.length > 4) {
        choices = choices.slice(0, 4);
      }

      // Ensure all choices are strings and not empty
      choices = choices.map((choice, i) => {
        const choiceStr = String(choice || "").trim();
        return choiceStr || `Option ${String.fromCharCode(65 + i)}`;
      });

      // Ensure correctAnswer is within bounds
      let correctAnswer = 0;
      if (q.correctAnswer !== undefined && q.correctAnswer !== null) {
        correctAnswer = Math.max(
          0,
          Math.min(3, parseInt(q.correctAnswer) || 0),
        );
      }

      return {
        questionText: String(q.questionText).trim(),
        choices: choices,
        correctAnswer: correctAnswer,
        points: parseInt(q.points) || 5,
      };
    });

    console.log(
      `Successfully validated ${validatedQuestions.length} questions`,
    );

    res.json({
      success: true,
      message: `Successfully generated ${validatedQuestions.length} questions`,
      data: {
        questions: validatedQuestions,
        count: validatedQuestions.length,
      },
    });
  } catch (error) {
    console.error("Groq API Error Details:", {
      message: error.message,
      status: error.status,
      statusCode: error.statusCode,
      stack: error.stack,
    });

    // Specific error handling for Groq
    if (error.status === 401 || error.statusCode === 401) {
      return res.status(500).json({
        success: false,
        message: "Invalid API key. Please check your GROQ_API_KEY",
        error: "Authentication failed",
      });
    }

    if (error.status === 429 || error.statusCode === 429) {
      return res.status(429).json({
        success: false,
        message: "Rate limit exceeded. Please try again later.",
        error: "Too many requests",
      });
    }

    if (error.status === 400 || error.statusCode === 400) {
      return res.status(500).json({
        success: false,
        message: "Invalid request to Groq API",
        error: error.message,
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
    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({
        success: false,
        message: "GROQ_API_KEY is not configured",
      });
    }

    // Simple test prompt to check if API is working
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Say 'OK' if you are working.",
        },
      ],
      model: "llama-3.3-70b-versatile", // Updated model
      temperature: 0,
      max_tokens: 10,
    });

    const response = chatCompletion.choices[0]?.message?.content?.trim();

    res.json({
      success: true,
      message: "AI service is operational",
      data: {
        service: "Groq",
        status: "active",
        model: "llama-3.3-70b-versatile",
        response: response || "OK",
      },
    });
  } catch (error) {
    console.error("Groq Health Check Error:", error);

    res.status(503).json({
      success: false,
      message: "AI service is unavailable",
      error: error.message,
    });
  }
};

// Get available models
const getAvailableModels = async (req, res) => {
  try {
    // Current active Groq models (as of 2024)
    const models = [
      {
        id: "llama-3.3-70b-versatile",
        name: "Llama 3.3 70B",
        context: 8192,
        description: "Latest Llama model, great for complex tasks",
      },
      {
        id: "llama-3.1-8b-instant",
        name: "Llama 3.1 8B",
        context: 8192,
        description: "Fast and efficient, good for simple quizzes",
      },
      {
        id: "gemma2-9b-it",
        name: "Gemma 2 9B",
        context: 8192,
        description: "Google's Gemma 2 model",
      },
      {
        id: "llama3-70b-8192",
        name: "Llama 3 70B",
        context: 8192,
        description: "Powerful, slightly older version",
      },
      {
        id: "llama3-8b-8192",
        name: "Llama 3 8B",
        context: 8192,
        description: "Fast and efficient",
      },
    ];

    res.json({
      success: true,
      data: models,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Test endpoint to verify Groq connection
const testGroqConnection = async (req, res) => {
  try {
    console.log("Testing Groq connection...");
    console.log("API Key exists:", !!process.env.GROQ_API_KEY);

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Say 'Connection successful' if you can hear me.",
        },
      ],
      model: "llama-3.3-70b-versatile",
      max_tokens: 20,
    });

    res.json({
      success: true,
      message: "Groq connection successful",
      response: chatCompletion.choices[0]?.message?.content,
    });
  } catch (error) {
    console.error("Groq test failed:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      status: error.status,
    });
  }
};

module.exports = {
  generateQuestions,
  checkAIHealth,
  getAvailableModels,
  testGroqConnection,
};
