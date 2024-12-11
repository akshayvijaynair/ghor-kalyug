import { QuizRequest, QuizResponse } from '../types/generate-quiz.tsx';


export const generateQuiz = async (request: QuizRequest): Promise<QuizResponse> => {
    const domain = import.meta.env.VITE_API_DOMAIN;
    const endpoint = domain+'/generate-quiz';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch quiz data. Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching quiz:', error);
        throw error; // Allow the caller to handle the error
    }
};