import db from "../db/connection"; // Replace with the actual path

// Define interfaces for type safety
interface Option {
    key: string;
    value: string;
}

export interface Question {
    questionId: string;
    question: string;
    options: Option[];
    answer: string;
    answerExplanation: string;
}

export interface QuizResponseDocument {
    quiz: Question[];
}

// Access the `quizzes` collection
const quizCollection = db.collection<QuizResponseDocument>("quizzes");
export default quizCollection;