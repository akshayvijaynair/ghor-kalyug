import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import {GoogleGenerativeAI} from "@google/generative-ai";
import {DifficultyLevel} from "./enums/generate-quiz";
import quizResponseSchema from "./schema";
import getPrompt from "./gemini";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

if (!process.env.API_KEY) {
    console.error("API_KEY is missing. Please set it in your .env file.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// @ts-ignore
app.post("/generate-quiz", async (req, res) => {
    const { topics, difficulty, numQuestions } = req.body;

    // Validate input
    if (!Array.isArray(topics) || !difficulty || !numQuestions) {
        return res.status(400).json({ error: "Invalid input." });
    }

    try {
        // Create generative model and generate content
        const topicString = topics.join(", ");
        const difficultyLevel = DifficultyLevel[difficulty]
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b", generationConfig:{
                responseMimeType: "application/json",
                responseSchema: quizResponseSchema,
                temperature: 0.1,
            } });
        const result = await model.generateContent(getPrompt(topicString, numQuestions ,difficultyLevel));

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
function parseQuiz(quizText: string) {
    if (!quizText) {
        throw new Error(`Invalid quiz text received for parsing: ${quizText}`);
    }
    try {
        const parsedQuestions = JSON.parse(quizText);
        if (parsedQuestions.length === 0) {
            throw new Error("No valid questions could be parsed from the quiz content");
        }
        return parsedQuestions;
    }catch (parseError) {
        console.error(`Error parsing question block: ${parseError}`);
        return []
    }
}

// Server configuration
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;