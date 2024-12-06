import { SchemaType } from "@google/generative-ai";

const schema = {
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
        },
        required: ["question", "options"],
    },
};

export default schema;