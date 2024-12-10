import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import {GoogleGenerativeAI} from "@google/generative-ai";
import {DifficultyLevel} from "./enums/generate-quiz";
import quizResponseSchema from "./schema";
import getPrompt from "./gemini";
import {QuizResponse} from "./entity/quizResponseSchema";
import db from "./db/connection.js"; // Import the db connection here

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

if (!process.env.API_KEY) {
    console.error("API_KEY is missing. Please set it in your .env file.");
    process.exit(1);
}

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

mongoose.connect(process.env.MONGODB_URI as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true
} as mongoose.ConnectOptions).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// @ts-ignore
app.post("/generate-quiz", async (req, res) => {
    const {topics, difficulty, numQuestions} = req.body;

    // Validate input
    if (!Array.isArray(topics) || !difficulty || !numQuestions) {
        return res.status(400).json({error: "Invalid input."});
    }

    try {
        // Create generative model and generate content
        const topicString = topics.join(", ");
        const difficultyLevel = DifficultyLevel[difficulty]
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-8b", generationConfig: {
                responseMimeType: "application/json",
                responseSchema: quizResponseSchema,
                temperature: 0.1,
            }
        });
        const result = await model.generateContent(getPrompt(topicString, numQuestions, difficultyLevel));
        const quizContent = result.response.text();
        res.status(200).json(await parseQuiz(quizContent));
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
async function parseQuiz(quizText: string) {
    if (!quizText) {
        throw new Error(`Invalid quiz text received for parsing: ${quizText}`);
    }
    try {
        const parsedQuiz = {quiz: JSON.parse(quizText)};
        const quizResponse = new QuizResponse(parsedQuiz);
        const savedQuiz = await quizResponse.save();

        return {
            _id: savedQuiz._id, // Fetch `_id` from the saved document
            quiz: parsedQuiz.quiz.map(({answer, answerExplanation, ...rest}: any) => rest) // Exclude sensitive fields
        };
    } catch (parseError) {
        console.error(`Error parsing question block: ${parseError}`);
        return [];
    }
}

app.get("/quizzes/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const quiz = await QuizResponse.findById(id);
        if (!quiz) {
            res.status(404).json({ error: 'Quiz not found' });
            return;
        }
        res.status(200).json(quiz);
    } catch (error: any) {
        console.error('Error fetching quiz by ID:', error.message);
        res.status(500).json({ error: 'Failed to retrieve quiz' });
    }
});

// Server configuration
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
