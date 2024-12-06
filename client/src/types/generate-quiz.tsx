export interface QuizRequest {
    topics: string[];
    difficulty: number;
    numQuestions: number;
}

export interface QuizResponse {
    quiz: Question[];
}

export interface Question {
    questionId: string;
    question: string;
    options: {key:string, value:string}[];
    answer?: string;
}