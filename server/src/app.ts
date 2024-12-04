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

// Route to generate a quiz
app.post("/generate-quiz", async (req, res) => {
    const { topic } = req.body;

    // Validate input
    if (!topic || typeof topic !== "string") {
        return res.status(400).json({ error: "Topic is required and must be a string." });
    }

    try {
        // Create generative model and generate content
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
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

        const quizContent = result.response.text();
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
 * @param {string} quizText - Raw quiz content
 * @returns {Array} - Parsed questions
 */
function parseQuiz(quizText) {
    if (!quizText || typeof quizText !== "string") {
        throw new Error(`Invalid quiz text received for parsing: ${quizText}`);
    }

    // More robust splitting to handle various potential formatting issues
    const questionBlocks = quizText
        .split(/\n\n+/)  // Split by multiple newlines
        .filter((block) => /^\d*\.*\s*[\w\s]+\?/i.test(block.trim()));  // Ensure block looks like a question

    const parsedQuestions = [];

    questionBlocks.forEach((block, index) => {
        try {
            // Split block into lines, removing any empty lines
            const lines = block.split("\n").filter((line) => line.trim());

            // Extract question (first line)
            const questionText = lines[0].replace(/^\d*\.*\s*/, '').trim();

            // Extract options (next 4 lines)
            const options = lines.slice(1, 5)
                .map((option) => option.replace(/^[A-D]\.\s*/, "").trim())
                .filter(option => option);  // Remove any empty options

            // Validate we have exactly 4 options
            if (options.length !== 4) {
                console.warn(`Question ${index + 1} does not have exactly 4 options`);
                return;  // Skip this question
            }

            parsedQuestions.push({
                questionId: `q${parsedQuestions.length + 1}`,
                questionText,
                options,
            });
        } catch (parseError) {
            console.error(`Error parsing question block: ${block}`, parseError);
        }
    });

    if (parsedQuestions.length === 0) {
        throw new Error("No valid questions could be parsed from the quiz content");
    }

    return parsedQuestions;
}

// Server configuration
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;