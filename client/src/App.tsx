import React from 'react';
import QuizGenerator from './components/QuizGenerator';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow mb-8">
        <div className="max-w-4xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            AI Quiz Generator
          </h1>
        </div>
      </header>
      <main>
        <QuizGenerator />
      </main>
    </div>
  );
}

export default App;

