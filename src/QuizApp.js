import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ShuffleIcon,
  TrashIcon,
  PlusCircleIcon,
} from "lucide-react";
import 'bootstrap/dist/css/bootstrap.min.css';

// Cấu hình Supabase
const supabaseUrl = "https://pkttzivlgieogqzfoeqz.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrdHR6aXZsZ2llb2dxemZvZXF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMzQ2ODcsImV4cCI6MjA0ODcxMDY4N30.usBaRnShx_FqeaoFccbAp9KA4kq7233O5ThXUre-cTQ";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const QuizApp = () => {
  const [activeView, setActiveView] = useState("quiz");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    answers: [
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
    ],
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const { data, error } = await supabase.from("questions").select("*");
    if (data) {
      const shuffledQuestions = data.sort(() => 0.5 - Math.random());
      setQuestions(shuffledQuestions);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setIsCorrect(answer.is_correct);
  };

  const shuffleQuestions = () => {
    const shuffledQuestions = [...questions].sort(() => 0.5 - Math.random());
    setQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const prevQuestion = () => {
    setCurrentQuestionIndex((prev) =>
      prev === 0 ? questions.length - 1 : prev - 1
    );
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const handleAddQuestion = async () => {
    const { data, error } = await supabase
      .from("questions")
      .insert(newQuestion);

    if (data) {
      fetchQuestions();
      // Reset form
      setNewQuestion({
        question_text: "",
        answers: [
          { text: "", is_correct: false },
          { text: "", is_correct: false },
          { text: "", is_correct: false },
          { text: "", is_correct: false },
        ],
      });
    }
  };

  const handleDeleteQuestion = async (id) => {
    const { error } = await supabase.from("questions").delete().eq("id", id);

    if (!error) fetchQuestions();
  };

  const renderQuizView = () => {
    if (questions.length === 0) return <div className="text-center">Loading...</div>;

    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div className="container">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-4">{currentQuestion.question_text}</h5>

            <div className="list-group mb-4">
              {currentQuestion.answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(answer)}
                  className={`list-group-item list-group-item-action ${
                    selectedAnswer === answer
                      ? answer.is_correct
                        ? "list-group-item-success"
                        : "list-group-item-danger"
                      : ""
                  }`}
                >
                  {answer.text}
                </button>
              ))}
            </div>

            {selectedAnswer && (
              <div
                className={`alert ${
                  isCorrect ? "alert-success" : "alert-danger"
                } text-center`}
                role="alert"
              >
                {isCorrect ? "Chính xác!" : "Sai rồi!"}
              </div>
            )}

            <div className="d-flex justify-content-between">
              <button 
                onClick={prevQuestion} 
                className="btn btn-outline-secondary"
              >
                <ArrowLeftIcon size={20} />
              </button>

              <button 
                onClick={shuffleQuestions} 
                className="btn btn-outline-primary"
              >
                <ShuffleIcon size={20} />
              </button>

              <button 
                onClick={nextQuestion} 
                className="btn btn-outline-secondary"
              >
                <ArrowRightIcon size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderManagementView = () => {
    return (
      <div className="container">
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-4">Thêm Câu Hỏi Mới</h5>
            <input
              placeholder="Nhập câu hỏi"
              value={newQuestion.question_text}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  question_text: e.target.value,
                })
              }
              className="form-control mb-3"
            />

            {newQuestion.answers.map((answer, index) => (
              <div key={index} className="input-group mb-2">
                <input
                  placeholder={`Đáp án ${index + 1}`}
                  value={answer.text}
                  onChange={(e) => {
                    const newAnswers = [...newQuestion.answers];
                    newAnswers[index].text = e.target.value;
                    setNewQuestion({ ...newQuestion, answers: newAnswers });
                  }}
                  className="form-control"
                />
                <div className="input-group-text">
                  <input
                    type="checkbox"
                    checked={answer.is_correct}
                    onChange={() => {
                      const newAnswers = newQuestion.answers.map((a, i) => ({
                        ...a,
                        is_correct: i === index,
                      }));
                      setNewQuestion({ ...newQuestion, answers: newAnswers });
                    }}
                  />
                </div>
              </div>
            ))}

            <button
              onClick={handleAddQuestion}
              className="btn btn-primary mt-2"
            >
              <PlusCircleIcon size={20} className="me-2" /> Thêm Câu Hỏi
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h5 className="card-title mb-4">Danh Sách Câu Hỏi</h5>
            {questions.map((question) => (
              <div
                key={question.id}
                className="card mb-3"
              >
                <div className="card-body d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {question.question_text}
                    </h6>
                    {question.answers.map((answer, idx) => (
                      <p
                        key={idx}
                        className={`card-text ${
                          answer.is_correct ? "text-success" : ""
                        }`}
                      >
                        {answer.text}
                      </p>
                    ))}
                  </div>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="btn btn-sm btn-outline-danger"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center mb-4">
        <div className="col-auto">
          <div className="btn-group" role="group">
            <button
              onClick={() => setActiveView("quiz")}
              className={`btn ${
                activeView === "quiz" ? "btn-primary" : "btn-outline-primary"
              }`}
            >
              Quiz
            </button>
            <button
              onClick={() => setActiveView("manage")}
              className={`btn ${
                activeView === "manage" ? "btn-primary" : "btn-outline-primary"
              }`}
            >
              Quản Lý
            </button>
          </div>
        </div>
      </div>

      {activeView === "quiz" ? renderQuizView() : renderManagementView()}
    </div>
  );
};

export default QuizApp;