import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getExamQuestions, submitExamAnswers, getExamScore } from "../api";
import "../styles/AptitudeTest.css";

interface Question {
  id: number;
  question_text: string;
  options: { id: string; text: string }[];
}

const AptitudeTest = () => {
  const { examId } = useParams<{ examId: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const userId = 1; // Replace with actual user ID from authentication

  useEffect(() => {
    if (examId) {
      fetchQuestions();
    }
  }, [examId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await getExamQuestions(Number(examId));
      
      if (response?.data?.length > 0) {
        const formattedQuestions: Question[] = response.data.map((q: any) => ({
          id: q.id,
          question_text: q.question_text,
          options: q.options.map((opt: string, index: number) => ({
            id: `${q.id}-${index}`,
            text: opt,
          })),
        }));
        setQuestions(formattedQuestions);
      } else {
        setError("No questions found for this exam.");
      }
    } catch (err) {
      setError("Error fetching questions. Please try again later.");
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };
  

  const handleSelect = (questionId: number, selectedText: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedText,
    }));
  };

  const handleSubmit = async () => {
    if (!examId) return;

    const answers = Object.entries(selectedAnswers).map(([questionId, selectedOption]) => ({
      questionId: Number(questionId),
      selectedOption,
    }));

    try {
      await submitExamAnswers(Number(userId), Number(examId), answers);
      const response = await getExamScore(Number(examId), userId);
      if (response?.data?.score !== undefined) {
        setScore(response.data.score);
      } else {
        setError("Could not retrieve score. Try again.");
      }
      setSubmitted(true);
    } catch (err) {
      setError("Error submitting exam. Please try again.");
      console.error("Error submitting answers:", err);
    }
  };

  return (
    <div className="test-container">
      <div className="test-card">
        <h1 className="test-title">Aptitude Test</h1>

        {loading ? (
          <p className="loading-text">Loading questions...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : questions.length > 0 ? (
          questions.map((q) => (
            <div key={q.id} className="question-container">
              <h3 className="question-text">{q.question_text}</h3>
              {q.options.map((opt) => (
                <label key={opt.id} className="option-label">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    className="option-input"
                    checked={selectedAnswers[q.id] === opt.text}
                    onChange={() => handleSelect(q.id, opt.text)}
                  />
                  {opt.text}
                </label>
              ))}
            </div>
          ))
        ) : (
          <p className="loading-text">No questions available.</p>
        )}

        <button onClick={handleSubmit} disabled={submitted} className="submit-button">
          Submit Test
        </button>

        {submitted && (
          <h2 className="score-text">Your Score: {score} / {questions.length}</h2>
        )}
      </div>
    </div>
  );
};

export default AptitudeTest;
