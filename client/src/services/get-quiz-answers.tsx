import {QuizResponse} from '../types/quiz.tsx';


export const submitQuizAndGetAnswers = async (): Promise<QuizResponse> => {
    const domain = import.meta.env.VITE_API_DOMAIN;
    console.log(domain);
    const endpoint = `${domain}/quizzes/`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
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