import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [topic, setTopic] = useState("");

  const [difficulty, setDifficulty] =
    useState("easy");

  const [questions, setQuestions] =
    useState([]);

  const [currentQuestion,
    setCurrentQuestion] =
    useState(0);

  const [selectedAnswers,
    setSelectedAnswers] =
    useState({});

  const [score, setScore] =
    useState(0);

  const [showResult,
    setShowResult] =
    useState(false);

  const [loading,
    setLoading] =
    useState(false);

  const [timeLeft,
    setTimeLeft] =
    useState(3600);

  const [showReview,
    setShowReview] =
    useState(false);

  const [openExplanation,
    setOpenExplanation] =
    useState(null);

  useEffect(() => {

    if (
      questions.length > 0 &&
      !showResult
    ) {

      const timer =
        setInterval(() => {

          setTimeLeft((prev) => {

            if (prev <= 1) {

              clearInterval(timer);

              finishQuiz();

              return 0;
            }

            return prev - 1;
          });

        }, 1000);

      return () =>
        clearInterval(timer);
    }

  }, [questions, showResult]);

  const generateQuiz =
    async () => {

      if (!topic.trim()) {

        alert(
          "Please enter topic"
        );

        return;
      }

      try {

        setLoading(true);

        const response =
          await axios.post(
            "http://localhost:5000/api/quiz",
            {
              topic,
              difficulty,
            }
          );

        setQuestions(
          response.data
        );

        setCurrentQuestion(0);

        setSelectedAnswers({});

        setShowResult(false);

        setScore(0);

        setTimeLeft(3600);

        setShowReview(false);

      } catch (error) {

        console.log(error);

        alert(
          "Failed to generate quiz"
        );

      } finally {

        setLoading(false);
      }
    };

  const handleOptionClick =
    (option) => {

      setSelectedAnswers({

        ...selectedAnswers,

        [currentQuestion]:
          option,
      });
    };

  const previousQuestion = () => {

    if (currentQuestion > 0) {

      setCurrentQuestion(
        currentQuestion - 1
      );
    }
  };

  const nextQuestion = () => {

    if (
      !selectedAnswers[
        currentQuestion
      ]
    ) {

      return;
    }

    if (
      currentQuestion <
      questions.length - 1
    ) {

      setCurrentQuestion(
        currentQuestion + 1
      );

    } else {

      finishQuiz();
    }
  };

  const finishQuiz = () => {

    let finalScore = 0;

    questions.forEach(
      (question, index) => {

        if (
          selectedAnswers[index] ===
          question.answer
        ) {

          finalScore++;
        }
      }
    );

    setScore(finalScore);

    setShowResult(true);
  };

  const formatTime = (
    seconds
  ) => {

    const mins =
      Math.floor(seconds / 60);

    const secs =
      seconds % 60;

    return `${mins}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (

    <div className="app">

      {!questions.length &&
        !showResult && (

        <div className="home-container">

          <div className="home-card">

            <h1 className="main-title">
              AI Quiz Generator
            </h1>

            <p className="subtitle">
              Generate smart quizzes instantly using AI 🚀
            </p>

            <input
              type="text"
              placeholder="Enter Quiz Topic"
              value={topic}
              onChange={(e) =>
                setTopic(
                  e.target.value
                )
              }
            />

            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(
                  e.target.value
                )
              }
            >

              <option value="easy">
                Easy
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="hard">
                Hard
              </option>

            </select>

            <button
              className="generate-btn"
              onClick={generateQuiz}
              disabled={loading}
            >

              {loading
                ? "Generating Questions..."
                : "Generate Quiz"}

            </button>

          </div>

        </div>
      )}

      {!showResult &&
        questions.length > 0 && (

        <div className="quiz-box">

          <div className="top-bar">

            <button

              className="quit-top-btn"

              onClick={() => {

                const confirmQuit =
                  window.confirm(
                    "Are you sure you want to quit?"
                  );

                if (confirmQuit) {

                  window.location.reload();
                }
              }}
            >
              Quit Quiz
            </button>

            <h3>
              Question{" "}
              {currentQuestion + 1}
              /{questions.length}
            </h3>

            <h3>
              ⏳{" "}
              {formatTime(
                timeLeft
              )}
            </h3>

          </div>

          <h2 className="question">

            {
              questions[
                currentQuestion
              ].question
            }

          </h2>

          <div className="options">

            {questions[
              currentQuestion
            ].options.map(
              (
                option,
                index
              ) => (

                <button
                  key={index}

                  className={
                    selectedAnswers[
                      currentQuestion
                    ] === option
                      ? "selected"
                      : ""
                  }

                  onClick={() =>
                    handleOptionClick(
                      option
                    )
                  }
                >

                  {option}

                </button>
              )
            )}

          </div>

          <div className="button-group">

            <button
              className="prev-btn"
              onClick={previousQuestion}
              disabled={
                currentQuestion === 0
              }
            >
              Previous
            </button>

            <button
              className="next-btn"
              onClick={nextQuestion}

              disabled={
                !selectedAnswers[
                  currentQuestion
                ]
              }
            >

              {currentQuestion ===
              questions.length - 1
                ? "Finish Quiz"
                : "Next Question"}

            </button>

          </div>

        </div>
      )}

      {showResult && (

        <div className="result-box">

          <h2>
            Quiz Completed 🎉
          </h2>

          <h3 className="score-text">
            Your Score: {score}/
            {questions.length}
          </h3>

          <div className="result-buttons">

            <button

              className="home-btn"

              onClick={() =>
                window.location.reload()
              }
            >
              Go To Home
            </button>

            <button

              className="review-btn"

              onClick={() =>
                setShowReview(
                  !showReview
                )
              }
            >

              {showReview
                ? "Hide Review"
                : "Review Answers"}

            </button>

          </div>

          {showReview && (

            <div>

              {questions.map(
                (
                  question,
                  index
                ) => (

                  <div
                    key={index}
                    className="review-card"
                  >

                    <h4>
                      Q{index + 1}.{" "}
                      {
                        question.question
                      }
                    </h4>

                    <p
                      style={{
                        color:
                          selectedAnswers[
                            index
                          ] ===
                          question.answer
                            ? "#4ade80"
                            : "#f87171",
                      }}
                    >

                      <strong>
                        Your Answer:
                      </strong>{" "}

                      {selectedAnswers[
                        index
                      ] ||
                        "Not Answered"}

                    </p>

                    {selectedAnswers[
                      index
                    ] !==
                      question.answer && (

                      <p
                        style={{
                          color:
                            "#4ade80",
                        }}
                      >

                        <strong>
                          Correct Answer:
                        </strong>{" "}

                        {
                          question.answer
                        }

                      </p>
                    )}

                    <button

                      className="explanation-btn"

                      onClick={() =>
                        setOpenExplanation(

                          openExplanation ===
                            index
                            ? null
                            : index
                        )
                      }
                    >

                      {openExplanation ===
                      index
                        ? "Hide Explanation"
                        : "Show Explanation"}

                    </button>

                    {openExplanation ===
                      index && (

                      <div className="explanation-box">

                        <strong>
                          Explanation:
                        </strong>

                        <p>
                          {
                            question.explanation
                          }
                        </p>

                      </div>
                    )}

                  </div>
                )
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default App;