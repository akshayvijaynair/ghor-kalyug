import {QuizRequest, QuizResponse} from '../types/quiz.tsx';


export const getQuizAnswers = async (request: QuizRequest): Promise<QuizResponse> => {
    const domain = import.meta.env.VITE_API_DOMAIN;
    console.log(domain);
    const endpoint = `${domain}/quiz`;

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