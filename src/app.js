import React, { useState, useEffect } from "react";
import "./App.css";

// Εδώ φορτώνεις τα JSON δεδομένα για όλες τις γλώσσες
import questionsData from "./questions.json";

function App() {
  const [language, setLanguage] = useState("en");
  const [level, setLevel] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = questionsData[language].levels[level];

  const handleAnswer = (index) => {
    if (index === questions[currentQuestionIndex].a) {
      setScore(score + 1);
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
  };

  const handleLevelChange = (e) => {
    setLevel(Number(e.target.value));
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Stay Safe Quiz</h1>
        <div className="controls">
          <select value={language} onChange={handleLanguageChange}>
            {Object.keys(questionsData).map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
          <select value={level} onChange={handleLevelChange}>
            {Object.keys(questionsData[language].levels).map((lvl) => (
              <option key={lvl} value={lvl}>
                Level {lvl}
              </option>
            ))}
          </select>
        </div>
      </header>

      {!showResult ? (
        <div className="quiz-card">
          <h2>
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          <p className="question">{questions[currentQuestionIndex].q}</p>
          <div className="options">
            {questions[currentQuestionIndex].o.map((option, idx) => (
              <button
                key={idx}
                className="option-btn"
                onClick={() => handleAnswer(idx)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="result-card">
          <h2>Your Score: {score} / {questions.length}</h2>
          <button className="restart-btn" onClick={handleRestart}>
            Restart
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
