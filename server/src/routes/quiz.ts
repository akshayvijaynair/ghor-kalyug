import express from 'express';
import { generateQuiz, getQuizzes } from '../controllers/quizController';

const router = express.Router();

router.post('/generate', generateQuiz);
router.get('/', getQuizzes);

export default router;

