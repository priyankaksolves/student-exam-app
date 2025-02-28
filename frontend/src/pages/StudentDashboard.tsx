import { useEffect, useState } from "react";
import { getResult, getStudentExams } from "../api";
import { useAuth } from "../authContext/AuthContext";
import { Container, Table, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface StudentExam {
  student_exam_id: number;
  exam_id: number;
  status: "not_started" | "in_progress" | "completed";
  start_time: string;
  end_time: string;
  score?: number;
}

const StudentDashboard: React.FC = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState<StudentExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await getStudentExams(userId);
      setExams(response.exams);
    } catch (err: any) {
      setError("Failed to load exams. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = async (examId: number, studentExamId: number) => {
    navigate(`/exam/${examId}/${studentExamId}`);
  };

  const showResult = async (studentExamId: number | undefined) => {
    if (!studentExamId) {
      console.error("Error: studentExamId is undefined!");
      return;
    }
  
    try {
      navigate(`/result/${studentExamId}`);
    } catch (err: any) {
      setError("Failed to get result.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="mt-4">
      <h2>Student Dashboard</h2>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {exams.length > 0 ? (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Student Exam ID</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.student_exam_id}>
                <td>{exam.student_exam_id}</td>
                <td>{new Date(exam.start_time).toLocaleString()}</td>
                <td>{new Date(exam.end_time).toLocaleString()}</td>
                <td>
                  {exam.status === "completed"
                    ? `Completed (Score: ${exam.score ?? "N/A"})`
                    : exam.status}
                </td>
                <td>
                  {exam.status === "not_started" && (
                    <Button
                      onClick={() => handleStartExam(exam.exam_id, exam.student_exam_id)}
                    >
                      Start Exam
                    </Button>
                  )}
                  {exam.status === "completed" && (
                    <Button onClick={() => showResult(exam.student_exam_id)}>
                      Show Result
                    </Button>
                  )}
                </td> 
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No exams assigned.</p>
      )}
    </Container>
  );
};

export default StudentDashboard;
