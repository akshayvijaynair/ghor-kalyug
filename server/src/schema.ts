import { SchemaType } from "@google/generative-ai";

const quizResponseSchema = {
    description: "List of quiz questions",
    type: SchemaType.ARRAY,
    items: {
        type: SchemaType.OBJECT,
        properties: {
            questionId: {
                type: SchemaType.STRING,
                description: "Question ID for quiz",
                nullable: false,
            },
            question: {
                type: SchemaType.STRING,
                description: "Question for quiz",
                nullable: false,
            },
            options: {
                type: SchemaType.ARRAY,
                items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        key: {
                            type: SchemaType.STRING,
                            description: "Unique identifier for the option",
                            nullable: false,
                        },
                        value: {
                            type: SchemaType.STRING,
                            description: "Option text for the question",
                            nullable: false,
                        },
                    },
                    required: ["key", "value"],
                    description: "Option for the question"
                },
                description: "Options for quiz",
                nullable: false,
                maxItems: 4,
            },
            answer: {
                type: SchemaType.STRING,
                description: "Key of the correct option",
                nullable: false,
            }
        },
        required: ["question", "options", "answer"], // Added 'answer' to required fields
    },
};

export default quizResponseSchema;