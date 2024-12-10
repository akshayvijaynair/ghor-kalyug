
export default function getPrompt (
    topicString: string,
    numQuestions: number,
    difficultyLevel: string
): string {
    return `Topic: ${topicString}
Generate ${numQuestions} multiple-choice questions based on the topics above at a difficulty level of ${difficultyLevel}.
Each question must have exactly 4 options.
Format each question with the question text first, followed by options on new lines.
Ensure each question is clearly separated and follows this format:

Question text?
Option 1
Option 2
Option 3
Option 4
Answer
`
};