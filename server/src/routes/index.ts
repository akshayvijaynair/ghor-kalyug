import express from 'express';
import { generateQuiz } from '../controllers/quizController';

const router = express.Router();

router.post('/quiz/generate', generateQuiz);

export default router;

