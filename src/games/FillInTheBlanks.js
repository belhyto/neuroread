import React, { useState, useEffect } from "react";
import "./FillInTheBlanks.css";

const difficultyLevels = {
  easy: [
    { sentence: "The sun ____ in the east.", options: ["rises", "sleeps", "falls"], correct: "rises" },
    { sentence: "She ____ a delicious cake.", options: ["baked", "ran", "jumped"], correct: "baked" },
    { sentence: "The cat ____ on the mat.", options: ["sat", "ran", "jumped"], correct: "sat" },
    { sentence: "The boy ____ his homework.", options: ["did", "ate", "slept"], correct: "did" },
    { sentence: "Birds ____ in the sky.", options: ["fly", "jump", "crawl"], correct: "fly" },
    { sentence: "The dog ____ at the mailman.", options: ["barked", "sang", "slept"], correct: "barked" },
    { sentence: "Water ____ at 100 degrees Celsius.", options: ["boils", "freezes", "burns"], correct: "boils" },
    { sentence: "Fish ____ in water.", options: ["swim", "fly", "climb"], correct: "swim" },
    { sentence: "The baby ____ when she is hungry.", options: ["cries", "laughs", "dances"], correct: "cries" },
    { sentence: "We ____ our hands before eating.", options: ["wash", "paint", "jump"], correct: "wash" },
  ],
  medium: [
    { sentence: "The scientist ____ an experiment in the lab.", options: ["conducted", "danced", "wrote"], correct: "conducted" },
    { sentence: "He ____ to the store to buy groceries.", options: ["walked", "painted", "sang"], correct: "walked" },
    { sentence: "The musician ____ a beautiful melody.", options: ["composed", "cooked", "measured"], correct: "composed" },
    { sentence: "The teacher ____ the students before the test.", options: ["prepared", "forgot", "jumped"], correct: "prepared" },
    { sentence: "The artist ____ a masterpiece.", options: ["painted", "sang", "ate"], correct: "painted" },
    { sentence: "The storm ____ heavy rain.", options: ["brought", "ate", "slept"], correct: "brought" },
    { sentence: "The police officer ____ the thief.", options: ["caught", "danced", "sang"], correct: "caught" },
    { sentence: "The student ____ his notes before the exam.", options: ["reviewed", "ignored", "ran"], correct: "reviewed" },
    { sentence: "The farmer ____ the crops.", options: ["harvested", "burned", "drove"], correct: "harvested" },
    { sentence: "The chef ____ a delicious meal.", options: ["cooked", "wrote", "jumped"], correct: "cooked" },
  ],
  hard: [
    { sentence: "The architect carefully ____ the blueprint for the building.", options: ["drafted", "cooked", "measured"], correct: "drafted" },
    { sentence: "The government ____ new policies to address climate change.", options: ["implemented", "ignored", "laughed"], correct: "implemented" },
    { sentence: "The scientist ____ a groundbreaking discovery.", options: ["made", "forgot", "slept"], correct: "made" },
    { sentence: "The lawyer ____ a compelling argument in court.", options: ["presented", "sang", "jumped"], correct: "presented" },
    { sentence: "The company ____ new strategies to improve efficiency.", options: ["developed", "ignored", "slept"], correct: "developed" },
    { sentence: "The author ____ a best-selling novel.", options: ["wrote", "painted", "jumped"], correct: "wrote" },
    { sentence: "The engineer ____ a new software solution.", options: ["designed", "forgot", "danced"], correct: "designed" },
    { sentence: "The investor ____ in promising startups.", options: ["invested", "ignored", "ran"], correct: "invested" },
    { sentence: "The researcher ____ data for the study.", options: ["collected", "ate", "jumped"], correct: "collected" },
    { sentence: "The professor ____ a complex topic clearly.", options: ["explained", "ignored", "slept"], correct: "explained" },
  ],
};

function FillInTheBlanks({ goToWelcomeScreen }) {
  const [gameStarted, setGameStarted] = useState(true); // Directly start the game
  const [gameEnded, setGameEnded] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [difficulty, setDifficulty] = useState("easy");

  useEffect(() => {
    const shuffledQuestions = [...difficultyLevels[difficulty]].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffledQuestions.map(q => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5)
    })));
    setCurrentQuestionIndex(0);
    setScore(0);
    setFeedback("");
    setGameEnded(false);
    setElapsedTime(0);
    const timer = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [difficulty]);

  useEffect(() => {
    if (gameEnded) {
      setGameStarted(false);
    }
  }, [gameEnded]);

  const handleAnswer = (answer) => {
    if (answer === questions[currentQuestionIndex].correct && !correctAnswer) {
      setCorrectAnswer(true);
      setFeedback("✅ Correct!");
      setScore((prevScore) => prevScore + 1);
    } else {
      setFeedback("❌ Try Again!");
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setFeedback("");
      setCorrectAnswer(false);
    } else {
      setGameEnded(true);
    }
  };

  const restartGame = () => {
    setGameStarted(false);
    setGameEnded(false);
    setElapsedTime(0);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const speakSentence = () => {
    const fullSentence = questions[currentQuestionIndex].sentence.replace("____", questions[currentQuestionIndex].correct);
    const utterance = new SpeechSynthesisUtterance(fullSentence);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="fill-in-the-blanks">
      {gameEnded ? (
        <div className="end-screen">
          <h1>Game Over</h1>
          <p>Final Score: {score}/10</p>
          <p>Time: {formatTime(elapsedTime)}</p>
          <button onClick={restartGame}>Play Again</button>
        </div>
      ) : (
        <div className="game-container">
          <h2>{questions[currentQuestionIndex]?.sentence}</h2>
          <p>Score: {score}/{questions.length}</p>
          <p>Time: {formatTime(elapsedTime)}</p>
          <div className="options">
            {questions[currentQuestionIndex]?.options.map((option, index) => (
              <button key={index} onClick={() => handleAnswer(option)}>{option}</button>
            ))}
          </div>
          {feedback && <p className="feedback">{feedback}</p>}
          {correctAnswer && <button onClick={speakSentence}>🔊 Hear Sentence</button>}
          {correctAnswer && <button onClick={nextQuestion}>Next</button>}
        </div>
      )}
    </div>
  );
}

export default FillInTheBlanks;