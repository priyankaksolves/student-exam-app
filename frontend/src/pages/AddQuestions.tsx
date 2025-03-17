import { useEffect, useState } from "react";
import QuestionForm from "../components/QuestionForm";
import { Alert, Container, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Question } from "../interfaces/Question";
import { getQuestionsForExam } from "../api";

const AddQuestions: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

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

  return (
    <Container className="mt-4">
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      <QuestionForm examID={Number(examId)} />
    </Container>
  );
};

export default AddQuestions;
