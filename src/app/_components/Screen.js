import React from "react";
import Home from "./Home";
import Quiz from "./Quiz";
import Result from "./Result";

export default function Screen({
  screen,
  onStart,
  onFinish,
  results,
  onRestart,
}) {
  switch (screen) {
    case "home":
      return <Home handleStart={onStart} />;
    case "quiz":
      return <Quiz onFinish={onFinish} />;
    case "result":
      return <Result results={results} onRestart={onRestart} />;
    default:
      return null;
  }
}
