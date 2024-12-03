const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Configure environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Check for API key
if (!process.env.API_KEY) {
  console.error("API_KEY is missing. Please set it in your .env file.");
  process.exit(1);
}

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Type definitions using JSDoc comments
/**
 * @typedef {Object} QuizQuestion
 * @property {string} questionId
 * @property {string} questionText
 * @property {string[]} options
 */

// Route to generate a quiz
app.post("/generate-quiz", async (req, res) => {
  const { topic } = req.body;

  // Validate input
  if (!topic || typeof topic !== "string") {
    return res.status(400).json({ error: "Topic is required and must be a string." });
  }

  try {
    // Create generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate quiz content
    const result = await model.generateContent(`
      Topic: ${topic}
      Generate 20 multiple-choice questions based on the topic above.
      Each question must have exactly 4 options.
      Do not include the correct answer in the output.
      Format each question with the question text first, followed by options on new lines.
      Ensure each question is clearly separated and follows this format:
      Question text?
      A. Option 1
      B. Option 2
      C. Option 3
      D. Option 4
    `);
    
    const response = result.response;
    const quizContent = response.text();
    
    // Parse and validate quiz
    const quiz = parseQuiz(quizContent);
    
    res.status(200).json({ quiz });
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({
      error: "An internal error occurred while generating the quiz. Please try again later.",
    });
  }
});

/**
 * Parse quiz content into structured questions
 * @param {string} quizText 
 * @returns {QuizQuestion[]}
 */
function parseQuiz(quizText) {
  if (!quizText || typeof quizText !== "string") {
    throw new Error(`Invalid quiz text received for parsing: ${quizText}`);
  }

  // Split questions, filtering out empty entries
  const questionBlocks = quizText.split(/\n\n+/).filter(block => block.trim());

  return questionBlocks.map((block, index) => {
    // Split block into lines
    const lines = block.split('\n').filter(line => line.trim());
    
    // First line is the question
    const questionText = lines[0].trim();
    
    // Next 4 lines are options (A, B, C, D)
    const options = lines.slice(1, 5).map(option => 
      option.replace(/^[A-D]\.\s*/, '').trim()
    );

    // Validate we have exactly 4 options
    if (options.length !== 4) {
      console.warn(`Question ${index + 1} does not have exactly 4 options`);
    }

    return {
      questionId: `q${index + 1}`,
      questionText,
      options
    };
  });
}

// Server configuration
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;