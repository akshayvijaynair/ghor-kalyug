import { Request, Response, NextFunction } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Quiz from '../models/Quiz';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const prompt = `
      Generate 5 multiple-choice questions based on the following content.
      Provide a JSON array with each question having these keys:
      - question (string)
      - options (array of 4 strings)
      - correctAnswer (string matching one of the options)
      - explanation (string explaining the correct answer)

      Content: ${content}
    `;
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean and parse the response
    const cleanedText = text.replace(/```json|```/g, '').trim();
    let questions;

    try {
      questions = JSON.parse(cleanedText);
      
      // Validate the structure
      if (!Array.isArray(questions) || questions.length !== 5) {
        throw new Error('Invalid quiz format');
      }

      // Additional validation for each question
      questions.forEach(q => {
        if (!q.question || !q.options || !q.correctAnswer || !q.explanation) {
          throw new Error('Incomplete question structure');
        }
      });
    } catch (parseError) {
      console.error('Failed to parse quiz:', parseError);
      return res.status(500).json({ 
        error: 'Failed to generate valid quiz', 
        details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
      });
    }

    const quiz = new Quiz({
      content,
      questions
    });

    await quiz.save();
    return res.status(201).json(quiz);
  } catch (error) {
    console.error('Error generating quiz:', error);
    return res.status(500).json({ 
      error: 'Failed to generate quiz', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getQuizzes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    return res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
};