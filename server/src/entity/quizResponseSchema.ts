import mongoose, { Document, Schema, model } from 'mongoose';
// Define the Option interface
interface Option {
    key: string;
    value: string;
}

// Define the Question interface
interface Question extends Document {
    questionId: string;
    question: string;
    options: Option[];
    answer: string;
    answerExplanation: string;
}

// Define Option Schema
const optionSchema = new Schema<Option>({
    key: { type: String, required: true },
    value: { type: String, required: true }
});


// Define the Quiz Response Model
const questionSchema = new Schema<Question>({
    questionId: { type: String, required: true },
    question: { type: String, required: true },
    options: {
        type: [optionSchema],
        required: true,
        validate: {
            validator: function (val: Option[]): boolean {
                return val.length <= 4;
            },
            message: '{PATH} exceeds the limit of 4 options.'
        }
    },
    answer: { type: String, required: true },
    answerExplanation: { type: String, required: true }
});

// Define the QuizResponse Document
interface QuizResponseDocument extends Document {
    quiz: Question[]; // Array of questions
}

// Define Quiz Response Schema
const quizResponseSchema = new Schema<QuizResponseDocument>({
    quiz: {
        type: [questionSchema], // Array of Question documents
        required: true
    }
});

quizResponseSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id; // Add `id` field as an alias for `_id`
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

export const QuizResponse = model<QuizResponseDocument>('QuizResponse', quizResponseSchema);