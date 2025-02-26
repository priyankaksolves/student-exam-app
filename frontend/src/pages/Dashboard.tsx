import { useEffect, useState } from "react";
import { getAllExams } from "../api";
import { useNavigate } from "react-router-dom";
import { Exam } from "../interfaces/exam";
import { Button, Container, Table, Alert, Spinner } from "react-bootstrap";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await getAllExams();
      setExams(response); // Assuming API returns { exams: [...] }
    } catch (err) {
      setError("Failed to load exams. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Exams List</h2>

      {loading && <Spinner animation="border" role="status" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && exams.length === 0 && (
        <Alert variant="warning">No exams available.</Alert>
      )}

      {exams.length > 0 && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Pass Marks</th>
              <th>Duration (mins)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.exam_id}>
                <td>{exam.exam_id}</td>
                <td>{exam.title}</td>
                <td>{exam.type}</td>
                <td>{exam.pass_marks}</td>
                <td>{exam.duration}</td>
                <td>
                  <Button
                    variant="primary"
                    className="me-2"
                    onClick={() => navigate(`/exam/${exam.exam_id}/add-questions`)}
                  >
                    View
                  </Button>
                  <Button variant="danger">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Button variant="success" className="mt-3" onClick={() => navigate("/create-exam")}>
        + Create New Exam
      </Button>
    </Container>
  );
};

export default Dashboard;