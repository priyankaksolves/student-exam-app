import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuestionsForExam, submitExamAnswers } from "../api"; // API functions
import { Button, Container, Form, Alert, Spinner } from "react-bootstrap";
import { Question } from "../interfaces/Question";
import { useAuth } from "../authContext/AuthContext";


const StudentExamPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string | string[] }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const { userId, role } = useAuth();


  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await getQuestionsForExam(Number(examId));
      setQuestions(response.data.examDetails.questions);
    } catch (err) {
      setError("Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await submitExamAnswers(userId, Number(examId), answers);
      setScore(response.data.score);
      setSubmitted(true);
    } catch (err) {
      setError("Failed to submit answers. Please try again.");
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-4">
      <h2>Exam Questions</h2>

      {questions.map((question) => (
        <Form.Group key={question.question_id} className="mb-3">
          <Form.Label>{question.question_text}</Form.Label>

          {question.question_type === "multiple_choice" ? (
            question.options?.map((option: Option) => (
              <Form.Check
                key={option.option_id}
                type="radio"
                name={`question-${question.question_id}`}
                label={option.option_text}
                onChange={() => handleAnswerChange(question.question_id, option.option_text)}
              />
            ))
          ) : question.question_type === "multi_select" ? (
            question.options?.map((option: Option) => (
              <Form.Check
                key={option.option_id}
                type="checkbox"
                name={`question-${question.question_id}`}
                label={option.option_text}
                onChange={(e) => {
                  const selected = answers[question.question_id] || [];
                  if (e.target.checked) {
                    handleAnswerChange(question.question_id, [...selected, option.option_text]);
                  } else {
                    handleAnswerChange(
                      question.question_id,
                      selected.filter((opt: string) => opt !== option.option_text)
                    );
                  }
                }}
              />
            ))
          ) : (
            <Form.Check
              type="checkbox"
              label="True"
              checked={answers[question.question_id] === "true"}
              onChange={() => handleAnswerChange(question.question_id, "true")}
            />
          )}
        </Form.Group>
      ))}

      <Button variant="primary" onClick={handleSubmit} disabled={submitted}>
        Submit Exam
      </Button>

      {submitted && <Alert variant="success">Your score: {score}</Alert>}
    </Container>
  );
};

export default StudentExamPage;
