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
  topic: string;
  questions: Question[];
}

const QuizForm: React.FC = () => {
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/quiz/generate', {
        content,
        topic,
        numberOfQuestions
      });
      setQuiz(response.data);
    } catch (err) {
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Generate Quiz</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">Topic:</label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            rows={6}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="numberOfQuestions" className="block text-sm font-medium text-gray-700 mb-1">Number of Questions:</label>
          <input
            type="number"
            id="numberOfQuestions"
            value={numberOfQuestions}
            onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            min={1}
            max={10}
            required
          />
        </div>
        <motion.button
          type="submit"
          className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          disabled={loading}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'Generating...' : 'Generate Quiz'}
        </motion.button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {quiz && (
        <motion.div 
          className="mt-12 space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Generated Quiz: {quiz.topic}</h3>
          {quiz.questions.map((question, index) => (
            <motion.div 
              key={index} 
              className="bg-gray-50 p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <p className="font-semibold mb-4 text-lg">{index + 1}. {question.question}</p>
              <ul className="space-y-2 mb-4">
                {question.options.map((option, optionIndex) => (
                  <li 
                    key={optionIndex} 
                    className={`p-3 rounded-md ${
                      option === question.correctAnswer 
                        ? 'bg-green-100 border-green-500 text-green-800' 
                        : 'bg-white border-gray-200'
                    } border`}
                  >
                    {option}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-600"><strong>Explanation:</strong> {question.explanation}</p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default QuizForm;
