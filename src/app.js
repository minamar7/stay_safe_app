import React, { useState, useEffect } from "react";
import "./App.css";

// Εδώ μπορείς να φορτώσεις τα ερωτηματολόγια σου
import questionsData from "./questions.json"; 

const languages = ["en", "el", "de", "es", "fr", "hi", "it", "pt"];

function App() {
  const [lang, setLang] = useState("en");
  const [level, setLevel] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    const qs = questionsData[lang]?.levels[level] || [];
    setQuestions(qs);
    setCurrent(0);
    setScore(0);
    setShowScore(false);
  }, [lang, level]);

  const handleAnswer = (index) => {
    if (index === questions[current].a) setScore(score + 1);
    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
    } else {
      setShowScore(true);
    }
  };

  const restart = () => {
    setCurrent(0);
    setScore(0);
    setShowScore(false);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Stay Safe App</h1>
        <div className="controls">
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            {languages.map((l) => (
              <option key={l} value={l}>{l.toUpperCase()}</option>
            ))}
          </select>
          <select value={level} onChange={(e) => setLevel(Number(e.target.value))}>
            {[1,2,3,4,5,6].map((lvl) => (
              <option key={lvl} value={lvl}>Level {lvl}</option>
            ))}
          </select>
        </div>
      </header>

      {questions.length > 0 ? (
        <div className="quiz-container">
          {!showScore ? (
            <>
              <div className="question-section">
                <div className="question-count">
                  <span>Question {current + 1}/{questions.length}</span>
                </div>
                <div className="question-text">{questions[current].q}</div>
              </div>
              <div className="answer-section">
                {questions[current].o.map((option, idx) => (
                  <button key={idx} onClick={() => handleAnswer(idx)}>{option}</button>
                ))}
              </div>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${((current+1)/questions.length)*100}%` }}
                ></div>
              </div>
            </>
          ) : (
            <div className="score-section">
              <h2>Your Score: {score}/{questions.length}</h2>
              <button onClick={restart}>Restart</button>
            </div>
          )}
        </div>
      ) : (
        <div>Loading questions...</div>
      )}
    </div>
  );
}

export default App;