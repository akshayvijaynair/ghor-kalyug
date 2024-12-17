import { QuizRequest, QuizResponse } from '../types/quiz.tsx';


export const generateQuiz = async (request: QuizRequest): Promise<QuizResponse> => {
    const domain = import.meta.env.VITE_API_DOMAIN;

    console.log(domain);
    const endpoint = domain+'/generate-quiz';
    const idToken = localStorage.getItem('idToken'); 

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
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