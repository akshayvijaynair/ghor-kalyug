
export default function getPrompt (
    topicString: string,
    numQuestions: number,
    difficultyLevel: string
): string {
    return `Topic: ${topicString}
Generate ${numQuestions} questions with exactly 4 options based on the topics above at a difficulty level of ${difficultyLevel}.
Each question MUST have 1 one answer.
Each question MUST have following format:
    Question ID: Question text?
        1
        2
        3
        4
        Answer
`
};