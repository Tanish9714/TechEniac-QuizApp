"use client";
import { generateQuestions } from "@/utils/generateQuestions";
import React, { useEffect, useState } from "react";

export default function Quiz({ onFinish }) {
  const [usedQuestions] = useState(new Set());
  const [questions, setQuestions] = useState(generateQuestions(usedQuestions));
  const [results, setResults] = useState([]);
  const [timer, setTimer] = useState(30);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [timerRef, setTimerRef] = useState(null);

  useEffect(() => {
    const time = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    setTimerRef(time);
    return () => clearInterval(time);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (timer === 0) {
      handleAns(null);
    }
  }, [timer]);

  function handleAns(choice) {
    if (timerRef) {
      clearInterval(timerRef);
    }

    const result = choice === questions.answer ? "correct" : "incorrect";

    const record = {
      question: questions.question,
      selected: choice,
      correct: questions.answer,
      result: choice === null ? "timeout" : result,
    };

    setResults((prev) => [...prev, record]);

    if (currentQuestionIndex < 10) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuestions(generateQuestions(usedQuestions));
      setTimer(30);
    } else {
      onFinish([...results, record]);
    }
  }

  const [num1, operator, num2] = questions.question.split(" ");

  return (
    <div className="p-6 rounded-lg shadow-lg w-full max-w-md border border-cyan-50">
      <div className="flex justify-between text-right text-sm mb-2 text-cyan-50">
        <h1 className="text-3xl font-bold text-cyan-50">
          Q-{currentQuestionIndex}
        </h1>
        <p className="text-cyan-50">Time Left: {timer}s</p>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center text-xl font-bold mb-6 mt-5 border p-3 border-gray-50">
        <div className="text-cyan-50">{num1}</div>
        <div className="text-cyan-50">{operator}</div>
        <div className="text-cyan-50">{num2}</div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {questions.choices.map((choice, idx) => (
          <button
            key={idx}
            className="bg-gray-200 hover:bg-green-300 p-4 rounded cursor-pointer transition-colors"
            onClick={() => handleAns(choice)}
          >
            {choice}
          </button>
        ))}
      </div>
      <div>
        <button
          onClick={() => handleAns(null)}
          className="bg-red-400 text-white hover:bg-red-600 w-full mt-4 p-4 rounded cursor-pointer transition-colors"
        >
          I Give Up
        </button>
      </div>
    </div>
  );
}
