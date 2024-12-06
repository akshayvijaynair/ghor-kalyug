import express, { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.API_KEY || "");

interface QuizRequestBody {
  topics: string[];
  difficulty: number;
  numQuestions: number;
}

/**
 * POST /quizzes
 * Generate quiz questions using Gemini API
 */
// @ts-ignore
router.post("/", async (req: Request<{}, {}, QuizRequestBody>, res: Response) => {
  const { topics, difficulty, numQuestions } = req.body;

  // Validate input
  if (!Array.isArray(topics) || !difficulty || !numQuestions) {
    return res.status(400).json({ error: "Invalid input." });
  }

  try {
    const topicString = topics.join(", ");
    const prompt = `
      Topic: ${topicString}
      Difficulty: ${difficulty}
      Generate ${numQuestions} multiple-choice questions.
      Each question should have exactly 4 options and include the correct answer.
      Format:
      Question text?
      A. Option 1
      B. Option 2
      C. Option 3
      D. Option 4
      Answer: Correct answer option
    `;

    // Generate questions using Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const quizContent = result.response.text();

    // Parse generated questions
    const parsedQuestions = parseQuestions(quizContent);

    // Store correct answers separately
    const questionsForStudent = parsedQuestions.map(({ questionId, questionText, options }) => ({
      questionId,
      questionText,
      options,
    }));
    const correctAnswers = parsedQuestions.map(({ questionId, correctAnswer }) => ({
      questionId,
      correctAnswer,
    }));

    // Return the quiz without answers
    res.status(201).json({
      quizId: `quiz_${Date.now()}`,
      questions: questionsForStudent,
      correctAnswers, // Only for internal tracking, should not be sent to students
    });
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ error: "Failed to generate quiz." });
  }
});

/**
 * POST /quizzes/:quizId/answers
 * Submit answers and calculate the score
 */
// @ts-ignore
router.post("/:quizId/answers", async (req: Request, res: Response) => {
  const { quizId } = req.params;
  const { answers, correctAnswers } = req.body;

  if (!answers || !Array.isArray(answers) || !correctAnswers) {
    return res.status(400).json({ error: "Invalid input." });
  }

  // Calculate score and feedback
  const feedback = answers.map((answer) => {
    const correct = correctAnswers.find((c) => c.questionId === answer.questionId);
    return {
      questionId: answer.questionId,
      isCorrect: correct?.correctAnswer === answer.selectedOption,
      explanation: correct ? `The correct answer is ${correct.correctAnswer}.` : "No explanation available.",
    };
  });

  const score = feedback.filter((f) => f.isCorrect).length;

  res.status(200).json({
    feedback,
    score,
  });
});

/**
 * Parse quiz content into structured questions
 * @param {string} quizText 
 * @returns {Array}
 */
function parseQuestions(quizText: string) {
  const questionBlocks = quizText.split(/\n\n+/).filter((block) => block.trim());
  return questionBlocks.map((block, index) => {
    const lines = block.split("\n").filter((line) => line.trim());
    const questionText = lines[0].trim();
    const options = lines.slice(1, 5).map((line) => line.replace(/^[A-D]\.\s*/, "").trim());
    const correctAnswerLine = lines.find((line) => line.startsWith("Answer:"));
    const correctAnswer = correctAnswerLine ? correctAnswerLine.replace("Answer:", "").trim() : null;

    return {
      questionId: `q${index + 1}`,
      questionText,
      options,
      correctAnswer,
    };
  });
}

export default router;
