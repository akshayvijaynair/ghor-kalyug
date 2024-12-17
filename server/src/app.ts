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
  requestDetails: { topics: string[]; difficulty: string; numQuestions: number }
): Promise<any> {
  try {
    const quizDocument = {
      ...quizData,
      topics: requestDetails.topics, // Save topic names
      difficulty: requestDetails.difficulty, // Save difficulty
      numQuestions: requestDetails.numQuestions, // Save number of questions
      createdAt: new Date(), // Timestamp
    };

    //@ts-ignore
    const result = await quizCollection.insertOne(quizDocument);
    return { ...quizDocument, _id: result.insertedId };
  } catch (error) {
    console.error("Error saving quiz:", error);
    throw error;
  }
}

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
app.post("/generate-quiz", async (req, res) => {
  console.log("Received generate-quiz request");
  const { topics, difficulty, numQuestions } = req.body;

  // Validate input
  if (!Array.isArray(topics) || !difficulty || !numQuestions) {
    return res.status(400).json({ error: "Invalid input." });
  }

  try {
    const topicString = topics.join(", ");
    //@ts-ignore
    const difficultyLevel = DifficultyLevel[difficulty];
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-8b",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: quizResponseSchema,
        temperature: 0.1,
      },
    });

    // Generate content
    //@ts-ignore
    const result = await model.generateContent(getPrompt(topicString, numQuestions, difficultyLevel));
    const quizContent = result.response.text();

    // Parse and save quiz
    const response = await parseQuiz(quizContent, { topics, difficulty, numQuestions });
    res.status(200).json(response);
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ error: "Failed to generate quiz. Please try again later." });
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
