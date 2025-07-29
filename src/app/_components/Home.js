import React from "react";

export default function Home({ handleStart }) {
  return (
    <div>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-cyan-50 mb-6">
          Welcome to the Quiz
        </h1>
        <p className="text-xl text-gray-300 mb-4">
          Click the button below to start the quiz.
        </p>
        <button
          onClick={handleStart}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors cursor-pointer"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}
