import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface IQuiz extends Document {
  content: string;
  questions: IQuestion[];
  createdAt: Date;
}

const QuizSchema = new Schema({
  content: { type: String, required: true },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    explanation: { type: String, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IQuiz>('Quiz', QuizSchema);

