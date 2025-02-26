import { useEffect, useState } from "react";
import { getAllExams, deleteExam } from "../api"; // ✅ Import deleteExam
import { useNavigate } from "react-router-dom";
import { Exam } from "../interfaces/exam";
import { Button, Container, Table, Alert, Spinner } from "react-bootstrap";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null); // ✅ Track deletion status

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await getAllExams();
      setExams(response);
    } catch (err) {
      setError("Failed to load exams. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle exam deletion
  const handleDelete = async (examId: number) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return; // Confirm before delete

    setDeleting(examId); // Indicate that the exam is being deleted
    try {
      await deleteExam(examId);
      setExams((prevExams) => prevExams.filter((exam) => exam.exam_id !== examId)); // Remove deleted exam
    } catch (err) {
      setError("Failed to delete the exam.");
    } finally {
      setDeleting(null); // Reset deleting state
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
                  <Button
                    variant="danger"
                    disabled={deleting === exam.exam_id} // ✅ Disable button during deletion
                    onClick={() => handleDelete(exam.exam_id)}
                  >
                    {deleting === exam.exam_id ? "Deleting..." : "Delete"}
                  </Button>
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
