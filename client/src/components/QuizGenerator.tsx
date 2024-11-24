import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface Quiz {
  _id: string;
  content: string;
  questions: Question[];
}

export default function QuizGenerator() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/quiz/generate', {
        content
      });
      setQuiz(response.data);
    } catch (err) {
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">AI Quiz Generator</h2>
      <form onSubmit={handleSubmit} className="mb-12">
        <div className="mb-6">
          <label 
            htmlFor="content" 
            className="block text-lg font-medium mb-2 text-gray-700"
          >
            Enter your content:
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            placeholder="Paste your content here..."
            required
          />
        </div>
        <motion.button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'Generating...' : 'Generate Quiz'}
        </motion.button>
      </form>

      {error && (
        <motion.div 
          className="text-red-500 mb-6 p-4 bg-red-100 rounded-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      {quiz && (
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Generated Quiz</h3>
          {quiz.questions.map((question, index) => (
            <motion.div 
              key={index} 
              className="bg-gray-50 p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                {index + 1}. {question.question}
              </h4>
              <div className="space-y-3 mb-4">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`p-3 rounded-md ${
                      option === question.correctAnswer
                        ? 'bg-green-100 border-green-500 text-green-800'
                        : 'bg-white border-gray-200'
                    } border transition-colors`}
                  >
                    {option}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-indigo-50 rounded-md">
                <strong className="text-indigo-700">Explanation:</strong> 
                <p className="text-gray-700 mt-1">{question.explanation}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

