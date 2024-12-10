
export default function getPrompt (
    topicString: string,
    numQuestions: number,
    difficultyLevel: string
): string {
    return `Topic: ${topicString}
Generate ${numQuestions} multiple-choice questions based on the topics above at a difficulty level of ${difficultyLevel}.
Each question MUST have exactly 4 options. 
Each question MUST have 1 one answer.
Each question MUST have following format:
    Question ID: Question text?
        Option 1
        Option 2
        Option 3
        Option 4
        Answer
`
};