// import dotenv from "dotenv";
// import express from "express";
// import cors from "cors";
// import {GoogleGenerativeAI} from "@google/generative-ai";
// import {DifficultyLevel} from "./enums/generate-quiz";
// import quizResponseSchema from "./schema";
// import getPrompt from "./gemini";
// import quizCollection, { QuizResponseDocument } from "./entity/quizResponseSchema";
// import {ObjectId} from "mongodb"; // Import the db connection here

// dotenv.config();

// const app = express();
// app.use(express.json());

// const corsOptions = {
//   origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
//     allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
//     optionsSuccessStatus: 200, // For legacy browser support
// };

// app.use(cors(corsOptions));



// if (!process.env.API_KEY) {
//     console.error("API_KEY is missing. Please set it in your .env file.");
//     process.exit(1);
// }

// // Initialize Google Generative AI
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// app.get("/", async(req, res) => {
//     try {
//         res.status(200).json("Hello World!");
//     }catch (err) {
//         console.error("Error generating quiz:", err);
//         res.status(500).json({
//             error: "An internal error occurred while generating the quiz. Please try again later.",
//         });
//     }
// })

// // @ts-ignore
// app.post("/generate-quiz", async (req, res) => {
//     console.log('Received generate-quiz request');
//     console.log('Request body:', req.body);
//     async function parseQuiz(quizText: string) {
//         if (!quizText) {
//             throw new Error(`Invalid quiz text received for parsing: ${quizText}`);
//         }
//         try {
//             const parsedQuiz: QuizResponseDocument = {quiz: JSON.parse(quizText)};
//             const savedQuiz = await saveQuiz(parsedQuiz);

//             return {
//                 _id: savedQuiz._id, // Fetch `_id` from the saved document
//                 quiz: parsedQuiz.quiz.map(({answer, answerExplanation, ...rest}: any) => rest) // Exclude sensitive fields
//             };
//         } catch (parseError) {
//             console.error(`Error parsing question block: ${parseError}`);
//             return [];
//         }
//     }

//     async function saveQuiz(quizData: QuizResponseDocument): Promise<any> {
//         try {
//             const result = await quizCollection.insertOne(quizData);
//             return { ...quizData, _id: result.insertedId }; // Add the generated `_id` to the returned object
//         } catch (error) {
//             console.error("Error saving quiz:", error);
//             throw error;
//         }
//     }


//     const {topics, difficulty, numQuestions} = req.body;

//     // Validate input
//     if (!Array.isArray(topics) || !difficulty || !numQuestions) {
//         return res.status(400).json({error: "Invalid input."});
//     }

//     try {
//         // Create generative model and generate content
//         const topicString = topics.join(", ");
//         const difficultyLevel = DifficultyLevel[difficulty]
//         const model = genAI.getGenerativeModel({
//             model: "gemini-1.5-flash-8b", generationConfig: {
//                 responseMimeType: "application/json",
//                 responseSchema: quizResponseSchema,
//                 temperature: 0.1,
//             }
//         });
//         const result = await model.generateContent(getPrompt(topicString, numQuestions, difficultyLevel));
//         const quizContent = result.response.text();
//         res.status(200).json(await parseQuiz(quizContent));
//     } catch (error) {
//         console.error("Error generating quiz:", error);
//         res.status(500).json({
//             error: "An internal error occurred while generating the quiz. Please try again later.",
//         });
//     }
// });

// app.get("/quizzes/:id", async (req, res) => {
//     const { id } = req.params;

//     // Debugging: Log the received ID
//     console.log("Received ID:", id);

//     async function getQuizById(id: string): Promise<QuizResponseDocument | null> {
//         try {
//             // Validate the ID format
//             if (!ObjectId.isValid(id)) {
//                 console.error("Invalid ID format:", id);
//                 throw new Error("Invalid ID format");
//             }

//             const quiz = await quizCollection.findOne({ _id: new ObjectId(id) });
//             if (!quiz) {
//                 console.error("Quiz not found for ID:", id);
//                 return null;
//             }

//             return quiz;
//         } catch (error) {
//             console.error("Error retrieving quiz by ID:", error);
//             throw error;
//         }
//     }

//     try {
//         const quiz = await getQuizById(id);
//         if (!quiz) {
//             res.status(404).json({ error: "Quiz not found" });
//             return;
//         }

//         res.status(200).json(quiz);
//     } catch (error: any) {
//         console.error("Error fetching quiz by ID:", error.message);
//         res.status(500).json({ error: "Failed to retrieve quiz" });
//     }
// });

// // Server configuration
// const PORT = process.env.PORT || 8080;

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// module.exports = app;
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DifficultyLevel } from "./enums/generate-quiz";
import quizResponseSchema from "./schema";
import getPrompt from "./gemini";
import quizCollection, { QuizResponseDocument } from "./entity/quizResponseSchema";
import { ObjectId } from "mongodb"; // Import the db connection here
import { verifyFirebaseToken } from "./firebaseAuthMiddleware";

import { Request } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken;
    }
  }
}
dotenv.config();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));

if (!process.env.API_KEY) {
  console.error("API_KEY is missing. Please set it in your .env file.");
  process.exit(1);
}

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Root endpoint
app.get("/", async (req, res) => {
  try {
    res.status(200).json("Hello World!");
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "An internal error occurred." });
  }
});

// Function to save quiz details with request metadata
//@ts-ignore
async function saveQuiz(
    quizData: QuizResponseDocument,
    requestDetails: { topics: string[]; difficulty: string; numQuestions: number; userId: string }
  ): Promise<any> {
    try {
      const quizDocument = {
        ...quizData,
        topics: requestDetails.topics,
        difficulty: requestDetails.difficulty,
        numQuestions: requestDetails.numQuestions,
        userId: requestDetails.userId, // Save the Firebase UID
        createdAt: new Date(),
      };
  
      const result = await quizCollection.insertOne(quizDocument);
      return { ...quizDocument, _id: result.insertedId };
    } catch (error) {
      console.error("Error saving quiz:", error);
      throw error;
    }
  }
// async function saveQuiz(
//   quizData: QuizResponseDocument,
//   requestDetails: { topics: string[]; difficulty: string; numQuestions: number }
// ): Promise<any> {
//   try {
//     const quizDocument = {
//       ...quizData,
//       topics: requestDetails.topics, // Save topic names
//       difficulty: requestDetails.difficulty, // Save difficulty
//       numQuestions: requestDetails.numQuestions, // Save number of questions
//       createdAt: new Date(), // Timestamp
//     };

//     //@ts-ignore
//     const result = await quizCollection.insertOne(quizDocument);
//     return { ...quizDocument, _id: result.insertedId };
//   } catch (error) {
//     console.error("Error saving quiz:", error);
//     throw error;
//   }
// }

// Function to parse quiz and save to DB
//@ts-ignore
async function parseQuiz(quizText: string, requestDetails: any) {
  if (!quizText) {
    throw new Error(`Invalid quiz text received for parsing: ${quizText}`);
  }
  try {
    //@ts-ignore
    const parsedQuiz: QuizResponseDocument = { quiz: JSON.parse(quizText) };
    //@ts-ignore
    const savedQuiz = await saveQuiz(parsedQuiz, requestDetails);

    return {
      _id: savedQuiz._id,
      quiz: parsedQuiz.quiz.map(({ answer, answerExplanation, ...rest }: any) => rest),
    };
  } catch (parseError) {
    console.error("Error parsing quiz:", parseError);
    throw parseError;
  }
}

// Endpoint to generate a quiz
//@ts-ignore
// 
app.post("/generate-quiz", verifyFirebaseToken, async (req, res) => {
    console.log("Received generate-quiz request");
  
    const { topics, difficulty, numQuestions } = req.body;
    const userId = req.user?.uid;

if (!userId) {
  return res.status(401).json({ error: "Unauthorized: User ID not found." });
}
  
    // Validate input
    if (!Array.isArray(topics) || !difficulty || !numQuestions) {
      return res.status(400).json({ error: "Invalid input." });
    }
  
    try {
      // Check if a similar quiz already exists for this user
      const query = { topics, difficulty, numQuestions, userId };
  
      const existingQuiz = await quizCollection.findOne(query);
  
      if (existingQuiz) {
        console.log(`Returning existing quiz for user: ${userId}`);
        return res.status(200).json({
          _id: existingQuiz._id,
          quiz: existingQuiz.quiz,
          source: "mongo",
        });
      }
  
      console.log(`Generating new quiz for user: ${userId}`);
      const topicString = topics.join(", ");
      const difficultyLevel = DifficultyLevel[difficulty];
  
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-8b",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: quizResponseSchema,
          temperature: 0.1,
        },
      });
  
      const result = await model.generateContent(getPrompt(topicString, numQuestions, difficultyLevel));
      const quizContent = result.response.text();
  
      // Save the new quiz to MongoDB with the userId
      const savedQuiz = await saveQuiz(
        { quiz: JSON.parse(quizContent) },
        { topics, difficulty, numQuestions, userId }
      );
  
      console.log(`Quiz saved to MongoDB for user: ${userId}`);
      res.status(200).json({ _id: savedQuiz._id, quiz: savedQuiz.quiz, source: "gemini" });
    } catch (error) {
      console.error("Error generating quiz:", error);
      res.status(500).json({ error: "Failed to generate quiz. Please try again later." });
    }
  });
  //@ts-ignore
  app.get("/user-quizzes", verifyFirebaseToken, async (req, res) => {
    const userId = req.user?.uid;
  
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: No user ID found." });
    }
  
    try {
      const quizzes = await quizCollection.find({ userId }).toArray();
      // Return quizzes sorted by createdAt if you want (add .sort({ createdAt: -1 }) before .toArray())
      res.status(200).json({ quizzes });
    } catch (error) {
      console.error("Error fetching user quizzes:", error);
      res.status(500).json({ error: "Failed to fetch user quizzes." });
    }
  });

//Fetch all quizzes for the user, including correct answers and explanations
//@ts-ignore
  app.get("/user-quizzes-full", verifyFirebaseToken, async (req, res) => {
    const userId = req.user?.uid;
  
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: No user ID found." });
    }
  
    try {
      // Fetch all quizzes for the user
      const quizzes = await quizCollection.find({ userId }).sort({ createdAt: -1 }).toArray();
  
      // Return the quizzes as-is, including correct answers and explanations
      res.status(200).json({ quizzes });
    } catch (error) {
      console.error("Error fetching full user quizzes:", error);
      res.status(500).json({ error: "Failed to fetch user quizzes with corrected answers." });
    }
  });


// Endpoint to fetch quiz by ID
//@ts-ignore
app.get("/quizzes/:id", async (req, res) => {
  const { id } = req.params;

  console.log("Fetching quiz with ID:", id);

  //@ts-ignore
  async function getQuizById(id: string): Promise<QuizResponseDocument | null> {
    try {
      if (!ObjectId.isValid(id)) {
        console.error("Invalid ID format:", id);
        throw new Error("Invalid ID format");
      }

      //@ts-ignore
      const quiz = await quizCollection.findOne({ _id: new ObjectId(id) });
      return quiz || null;
    } catch (error) {
      console.error("Error retrieving quiz by ID:", error);
      throw error;
    }
  }

  try {
    const quiz = await getQuizById(id);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.status(200).json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ error: "Failed to retrieve quiz." });
  }
});

// Server configuration
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
