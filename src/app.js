import React, { useState } from "react";
import "./App.css";

// Εδώ φορτώνουμε τα δεδομένα με τις ερωτήσεις (μπορείς να τα εισάγεις από JSON)
import questionsData from "./questions.json";

function App() {
  const [language, setLanguage] = useState("en"); // default Αγγλικά
  const [level, setLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const data = questionsData[language].levels[level];

  const handleAnswer = (index) => {
    if (index === data[currentQuestion].a) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < data.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
  };

  const handleLevelChange = (e) => {
    setLevel(parseInt(e.target.value));
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
  };

  return (
    <div className="app">
      <header className="header">
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

      <main className="quiz-container">
        {showScore ? (
          <div className="score-section">
            <h2>Your Score: {score} / {data.length}</h2>
            <button onClick={restartQuiz} className="btn">
              Restart Quiz
            </button>
          </div>
        ) : (
          <div className="question-section">
            <div className="question-count">
              <span>Question {currentQuestion + 1}</span>/{data.length}
            </div>
            <div className="question-text">{data[currentQuestion].q}</div>
            <div className="answer-section">
              {data[currentQuestion].o.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="btn answer-btn"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Stay Safe App © 2026</p>
      </footer>
    </div>
  );
}

export default App;
