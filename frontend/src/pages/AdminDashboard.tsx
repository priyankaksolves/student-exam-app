import { useEffect, useState } from "react";
import { getAllExams, updateExamStatus, deleteExam } from "../api";
import { useNavigate } from "react-router-dom";
import { Exam } from "../interfaces/exam";
import { Button, Container, Table, Alert, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { ExamRow } from "../helper/ExamRow";

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
      setExams(response);
    } catch (err) {
      setError("Failed to load exams. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (examId: number) => {
    try {
      const response = await deleteExam(examId);
      toast.success(response.data.message, { autoClose: 3000 });
      setExams(exams.filter((exam) => exam.exam_id !== examId));
    } catch (error: any) {
      handleError(error, "Failed to delete exam. Please try again.");
    }
  };

  const handleToggleLiveStatus = async (
    examId: number,
    currentStatus: boolean
  ) => {
    try {
      const response = await updateExamStatus(examId, !currentStatus);
      toast.success(response.data.message, { autoClose: 3000 });
      setExams((prevExams) =>
        prevExams.map((exam) =>
          exam.exam_id === examId ? { ...exam, is_live: !currentStatus } : exam
        )
      );
    } catch (error: any) {
      handleError(error, "Failed to update exam status. Please try again.");
    }
  };

  const handleError = (error: any, defaultMessage: string) => {
    toast.error(error.response?.data?.message || defaultMessage, {
      autoClose: 3000,
    });
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="mb-4">Create & Edit Exams</h2>
        <Button
          variant="success"
          size="sm"
          onClick={() => navigate("/create-exam")}
        >
          + Add Exam
        </Button>
      </div>

      {loading && <Spinner animation="border" role="status" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {exams.length > 0 && (
        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Pass Marks</th>
              <th>Duration (mins)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <ExamRow
                key={exam.exam_id}
                exam={exam}
                onDelete={handleDelete}
                onToggleLiveStatus={handleToggleLiveStatus}
                navigate={navigate}
              />
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Dashboard;