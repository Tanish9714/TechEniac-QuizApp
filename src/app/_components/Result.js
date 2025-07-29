import React from "react";

export default function Result({ results, onRestart }) {
  const totalCorrect = results.filter((res) => res.result === "correct").length;

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-cyan-50 mb-6">Quiz Results</h1>

      {results && results.length > 0 ? (
        <div className="text-xl text-gray-300 mb-6">
          <p>Quiz completed successfully!</p>
          <p>
            Score: {totalCorrect}/{results.length}
          </p>

          <div className="mt-6 space-y-4 text-left">
            {results.map((res, index) => (
              <div
                key={index}
                className={`p-4 rounded border ${
                  res.result === "correct"
                    ? "border-green-400 bg-green-900/20"
                    : "border-red-400 bg-red-900/20"
                }`}
              >
                <p className="font-semibold text-white">
                  Q{index + 1}: {res.question}
                </p>
                <p className="text-gray-300">
                  Your Answer:
                  <span className="font-medium">
                    {res.selected ?? "No Answer"}
                  </span>
                </p>
                <p className="text-gray-300">
                  Correct Answer:
                  <span className="font-medium">{res.correct}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xl text-gray-300 mb-4">No results available</p>
      )}

      <button
        onClick={onRestart}
        className="mt-6 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors cursor-pointer"
      >
        Restart Quiz
      </button>
    </div>
  );
}
