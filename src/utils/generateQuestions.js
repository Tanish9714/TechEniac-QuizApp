const operators = ["+", "-", "*", "/"];

function calculateAnswer(a, b, operator) {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return parseFloat((a / b).toFixed(2));
    default:
      return null;
  }
}

export function generateQuestions(usedQuestions) {
  let a, b, operator, questions, answer;
  const choices = new Set();

  do {
    a = Math.floor(Math.random() * 10);
    b = Math.floor(Math.random() * 9) + 1;
    operator = operators[Math.floor(Math.random() * operators.length)];
    questions = `${a} ${operator} ${b}`;
  } while (usedQuestions.has(questions));
  usedQuestions.add(questions);

  answer = calculateAnswer(a, b, operator);

  choices.add(answer);
  while (choices.size < 4) {
    const randomChoice = parseFloat(
      answer + Math.floor(Math.random() * 21) - 10
    ).toFixed(2);

    choices.add(randomChoice);
  }

  return {
    question: questions,
    answer: answer,
    choices: Array.from(choices).sort(() => Math.random() - 0.5),
  };
}
