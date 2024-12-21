import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jumpToQuestion, setJumpToQuestion] = useState("");

  // Ref cho các phần tử câu hỏi
  const questionRefs = useRef({});

  const supabaseUrl = "https://pkttzivlgieogqzfoeqz.supabase.co";
  const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrdHR6aXZsZ2llb2dxemZvZXF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMzQ2ODcsImV4cCI6MjA0ODcxMDY4N30.usBaRnShx_FqeaoFccbAp9KA4kq7233O5ThXUre-cTQ";
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from("questions")
          .select("*")
          .order("id", { ascending: true });

        if (error) throw error;
        setQuestions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const getCorrectAnswer = (answers) => {
    return answers.find((answer) => answer.is_correct)?.text;
  };

  const handleJumpToQuestion = (e) => {
    e.preventDefault();
    const questionNumber = parseInt(jumpToQuestion);
    if (questionNumber > 0 && questionNumber <= questions.length) {
      questionRefs.current[questionNumber]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Fixed navigation input */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          backgroundColor: "white",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          border: "1px solid #dee2e6",
        }}
      >
        <form onSubmit={handleJumpToQuestion} className="d-flex gap-2">
          <input
            type="number"
            className="form-control"
            placeholder="Nhập số câu hỏi"
            min="1"
            max={questions.length}
            value={jumpToQuestion}
            onChange={(e) => setJumpToQuestion(e.target.value)}
            style={{ width: "150px" }}
          />
          <button type="submit" className="btn btn-primary">
            Đi tới
          </button>
        </form>
        <small className="text-muted">(1-{questions.length})</small>
      </div>

      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Danh sách câu hỏi và đáp án</h2>
        </div>
        <div className="card-body">
          <div className="list-group">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="list-group-item"
                ref={(el) => (questionRefs.current[index + 1] = el)}
              >
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-2">
                    <span className="badge bg-secondary me-2">{index + 1}</span>
                    {question.question_text}
                  </h5>
                </div>
                <p className="mb-1">
                  <strong>Đáp án đúng: </strong>
                  <span
                    className="text-danger fw-bold"
                    style={{
                      fontSize: "1.2rem",
                      textDecoration: "underline",
                      backgroundColor: "#ffe6e6",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {getCorrectAnswer(question.answers)}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionList;
