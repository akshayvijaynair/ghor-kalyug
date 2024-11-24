import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Quiz from '../models/Quiz';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateQuiz = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    const prompt = `
      Generate 5 multiple choice questions based on the following content.
      Format each question as a JSON object with the following structure:
      {
        "question": "The question text",
        "options": ["option1", "option2", "option3", "option4"],
        "correctAnswer": "The correct option",
        "explanation": "Explanation of why this is the correct answer"
      }
      Return an array of these question objects.
      
      Content: ${content}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const questions = JSON.parse(text);

    const quiz = new Quiz({
      content,
      questions
    });

    await quiz.save();

    res.status(201).json(quiz);
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
};

