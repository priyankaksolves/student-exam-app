import { useEffect, useState } from "react";
import QuestionForm from "../components/QuestionForm";
import { Alert, Container, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getExamById } from "../api";
import { Exam } from "../interfaces/exam";

const AddQuestions: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await getExamById(Number(examId));
      setExam(response.data.examDetails);
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
      {exam && <QuestionForm examID={Number(examId)} examType={exam.type} />}
    </Container>
  );
};

export default AddQuestions;
