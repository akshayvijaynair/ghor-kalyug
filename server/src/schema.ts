export enum SchemaType {
    STRING = "string",
    NUMBER = "number",
    INTEGER = "integer",
    BOOLEAN = "boolean",
    ARRAY = "array",
    OBJECT = "object",
}

const quizResponseSchema = {
    description: "List of quiz questions with explanations",
    type: SchemaType.ARRAY,
    items: {
        type: SchemaType.OBJECT,
        properties: {
            questionId: {
                type: SchemaType.STRING,
                description: "Unique identifier for the question",
                nullable: false,
            },
            question: {
                type: SchemaType.STRING,
                description: "Question text for the quiz",
                nullable: false,
            },
            options: {
                type: SchemaType.ARRAY,
                items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        key: {
                            type: SchemaType.NUMBER,
                            description: "Unique identifier for the option. value will be integer values between 0 to 3",
                            nullable: false,
                        },
                        value: {
                            type: SchemaType.STRING,
                            description: "Option text for the question",
                            nullable: false,
                        }
                    },
                    required: ["key", "value"],
                    description: "Option for the question"
                },
                description: "Options for the question",
                nullable: false,
                maxItems: 4,
            },
            answer: {
                type: SchemaType.STRING,
                description: "Key of the correct option",
                nullable: false,
            },
            answerExplanation: {
                type: SchemaType.STRING,
                description: "Explanation for the correct answer",
                nullable: false,
            }
        },
        required: ["questionId", "question", "options", "answer", "answerExplanation"],
    },
};

export default quizResponseSchema;