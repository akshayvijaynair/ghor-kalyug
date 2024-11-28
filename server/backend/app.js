require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());
app.use(cors());

if (!process.env.API_KEY) {
  console.error("API_KEY is missing. Please set it in your .env file.");
  process.exit(1);
}

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Temporary storage for quizzes
let storedQuiz = [];

// Route to generate quiz
app.post("/generate", async (req, res) => {
  const { topic, courseMaterial } = req.body;

  if (!topic || !courseMaterial) {
    return res.status(400).json({ error: "Topic and course material are required." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Construct prompt
    const prompt = `
      Topic: ${topic}
      Course Material: ${courseMaterial}

      Create a quiz based on the topic and course material above. Include 5 multiple-choice questions. 
      Each question must have 4 options, with the correct answer clearly indicated.
    `;

    console.log("Sending prompt to Gemini API:", prompt);

    // Call the API
    const result = await model.generateContent({
      prompt,
      temperature: 0.7,
      maxTokens: 4024,
    });

    // Debug the response
    console.log("Gemini API response:", result);

    // Validate response
    if (!result || !result.response || !result.response.text) {
      console.error("Invalid response from Gemini API:", result);
      return res.status(500).json({ error: "Failed to generate quiz. Invalid API response." });
    }

    // Parse the response
    const quizContent = result.response.text;
    console.log("Raw quiz content:", quizContent);

    // Parse and format the quiz
    const formattedQuiz = parseQuiz(quizContent);
    storedQuiz = formattedQuiz; // Store the quiz temporarily

    res.status(200).json({ quiz: formattedQuiz });
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ error: "Failed to generate quiz. Please try again." });
  }
});

// Route to submit answers and calculate score
app.post("/submit", (req, res) => {
  const { answers } = req.body;

  if (!storedQuiz.length || !answers || answers.length !== storedQuiz.length) {
    return res.status(400).json({ error: "Invalid answers or quiz not available." });
  }

  let score = 0;

  const gradedQuiz = storedQuiz.map((question, index) => {
    const isCorrect = question.correct === answers[index];
    if (isCorrect) score += 1;

    return {
      ...question,
      studentAnswer: answers[index],
      isCorrect,
    };
  });

  res.status(200).json({ score, gradedQuiz });
});

// Function to parse and format the quiz
function parseQuiz(quizText) {
  const questions = quizText.split("\n\n").filter((q) => q.trim());
  return questions.map((q, index) => {
    const [question, ...options] = q.split("\n");
    const correctOption = options.find((option) => option.startsWith("*")); // Correct answers marked with '*'
    return {
      id: index + 1,
      question: question.trim(),
      options: options.map((o) => o.replace("*", "").trim()),
      correct: correctOption?.replace("*", "").trim(),
    };
  });
}

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
