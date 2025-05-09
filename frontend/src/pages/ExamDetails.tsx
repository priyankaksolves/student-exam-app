import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getExamById, getQuestionsForExam } from "../api";
import { Exam } from "../interfaces/exam";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";
import ExistingQuestions from "../components/ExistingQuestions";
import "../styles/ExamDetails.css";
import { Question } from "../interfaces/Question";

const ExamDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExamAndQuestions();
  }, [id]);

  const fetchExamAndQuestions = async () => {
    try {
      const examResponse = await getExamById(Number(id));
      setExam(examResponse.data.examDetails);

      const questionsResponse = await getQuestionsForExam(Number(id));
      setQuestions(questionsResponse.data.examDetails.questions || []); // Ensure fallback for empty list
    } catch (err) {
      setError("Failed to load exam details or questions.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner animation="border" role="status" className="loading-spinner" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!exam) return <Alert variant="warning">Exam not found.</Alert>;


  const handleEditQuestion = (questionId: number, updatedQuestion: Question) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.question_id === questionId ? updatedQuestion : q))
    );
  };
  
  const handleDeleteQuestion = (questionId: number) => {
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.question_id !== questionId));
  };

 
return (
  <Container className="exam-details-container">
    <Card className="exam-details-card">
      <Card.Header className="text-center text-white bg-primary">
        <h4>{exam.title}</h4>
      </Card.Header>
      <Card.Body>
        <p><strong>Type:</strong> {exam.type}</p>
        <p><strong>Pass Marks:</strong> {exam.pass_marks}</p>
        <p><strong>Duration:</strong> {exam.duration} minutes</p>
        <p>
          <strong>Status:</strong> 
          <span className={`status-badge ${exam.is_live ? "active" : "inactive"}`} style={{marginLeft: '10px'}}>
            {exam.is_live ? "Active" : "Inactive"}
          </span>
        </p>
      </Card.Body>
      <Card.Footer className="text-center">
        <Button variant="primary" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </Card.Footer>
    </Card>

    <div className="mt-4">
      <ExistingQuestions 
        questions={questions} 
        onEdit={handleEditQuestion} 
        onDelete={handleDeleteQuestion} 
      />
    </div>
  </Container>
);
};

export default ExamDetails;
