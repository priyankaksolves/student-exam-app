import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Spinner, Alert, Form } from "react-bootstrap";
import { getExamById, submitExam } from "../api"; // Import API functions

const ExamPage: React.FC = () => {
  const { examId } = useParams(); // Get exam ID from URL
  const navigate = useNavigate();
  
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responses, setResponses] = useState<{ [key: number]: number | null }>({}); // Store selected options

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const response = await getExamById(Number(examId));
        setExam(response.data.examDetails);

        // Initialize state with no selection
        const initialResponses: { [key: number]: number | null } = {};
        response.data.examDetails.questions.forEach((q: any) => {
          initialResponses[q.question_id] = null;
        });
        setResponses(initialResponses);
      } catch (err: any) {
        setError("Failed to load exam details.");
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [examId]);

  // Handle option selection
  const handleOptionChange = (questionId: number, optionId: number) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: optionId,
    }));
  };

  // Handle exam submission
  const handleSubmit = async () => {
    try {
      const formattedResponses = Object.entries(responses).map(([questionId, selectedOptionId]) => ({
        question_id: Number(questionId),
        selected_option_id: selectedOptionId,
      }));

      // Submit API Call
      const submitResponse = await submitExam(Number(examId), formattedResponses);
      alert(submitResponse.data.message); // Show success message
      navigate("/dashboard"); // Redirect after submission
    } catch (err: any) {
      alert("Failed to submit exam.");
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!exam) return <p>No exam found!</p>;

  return (
    <Container>
      <h2>{exam.title}</h2>
      <p>Duration: {exam.duration} minutes</p>

      {exam.questions.map((question: any, index: number) => (
        <div key={question.question_id} className="mb-4">
          <h4>{index + 1}. {question.question_text}</h4>
          <Form>
            {question.options.map((option: any) => (
              <Form.Check
                key={option.option_id}
                type="radio"
                label={option.option_text}
                name={`question_${question.question_id}`}
                checked={responses[question.question_id] === option.option_id}
                onChange={() => handleOptionChange(question.question_id, option.option_id)}
              />
            ))}
          </Form>
        </div>
      ))}

      <Button variant="success" onClick={handleSubmit}>Submit Exam</Button>
    </Container>
  );
};

export default ExamPage;
