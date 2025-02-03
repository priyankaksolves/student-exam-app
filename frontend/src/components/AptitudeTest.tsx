import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getExamQuestions, submitExamAnswers, getExamScore } from "../api";
import "../styles/AptitudeTest.css";

// Updated Question interface to match API response
interface Question {
  id: number;
  question_text: string; // Updated field name
  options: { id: string; text: string }[]; // Transformed options
}

const AptitudeTest = () => {
  const { examId } = useParams<{ examId: string }>(); // Get examId from URL params
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const userId = 1; // Replace with actual user ID from authentication

  useEffect(() => {
    fetchQuestions();
  }, [examId]);

  const fetchQuestions = () => {
    if (examId) {
      getExamQuestions(Number(examId))
        .then((response) => {
          // Transform API response to match the expected structure
          const formattedQuestions = response.data.map((q: any) => ({
            id: q.id,
            question_text: q.question_text,
            options: q.options.map((opt: string, index: number) => ({
              id: `${q.id}-${index}`, // Unique ID for options
              text: opt,
            })),
          }));
          setQuestions(formattedQuestions);
        })
        .catch((error) => {
          console.error("Error fetching questions:", error);
        });
    }
  };

  const handleSelect = (questionId: number, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    if (!examId) return;

    const answers = Object.keys(selectedAnswers).map((questionId) => ({
      questionId: Number(questionId),
      selectedOption: selectedAnswers[Number(questionId)],
    }));

    try {
      await submitExamAnswers(Number(userId), Number(examId), answers);
      const response = await getExamScore(Number(examId), userId);
      setScore(response.data.score);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  return (
    <div className="test-container">
      <div className="test-card">
        <h1 className="test-title">Aptitude Test</h1>
        {questions.length > 0 ? (
          questions.map((q) => (
            <div key={q.id} className="question-container">
              <h3 className="question-text">{q.question_text}</h3>
              {q.options.map((opt) => (
                <label key={opt.id} className="option-label">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    className="option-input"
                    checked={selectedAnswers[q.id] === opt.id}
                    onChange={() => handleSelect(q.id, opt.id)}
                  />
                  {opt.text}
                </label>
              ))}
            </div>
          ))
        ) : (
          <p className="loading-text">Loading questions...</p>
        )}

        <button onClick={handleSubmit} disabled={submitted} className="submit-button">
          Submit Test
        </button>

        {submitted && <h2 className="score-text">Your Score: {score} / {questions.length}</h2>}
      </div>
    </div>
  );
};

export default AptitudeTest;
