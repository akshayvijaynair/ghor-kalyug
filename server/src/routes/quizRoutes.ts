import express, { Request, Response, NextFunction } from 'express';
import { generateQuiz, getQuizzes } from '../controllers/quizController';

const router = express.Router();

// Middleware to wrap async route handlers
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.post('/generate', asyncHandler(generateQuiz));
router.get('/', asyncHandler(getQuizzes));

export default router;