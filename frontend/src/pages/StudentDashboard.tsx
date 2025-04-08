import { useEffect, useState } from "react";
import { getStudentExams, startExam } from "../api";
import { useAuth } from "../authContext/AuthContext";
import { Container, Table, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { StudentExam } from "../interfaces/StudentExam";

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState<StudentExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      if (!user?.user_id) {
        throw new Error("User ID is undefined");
      }
      const response = await getStudentExams(user.user_id);
      setExams(response.exams);
    } catch (err: any) {
      setError("Failed to load exams. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = async (studentExamId: number) => {
    try {
      await startExam(studentExamId);
      navigate("/student-exam", { state: { studentExamId } });
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
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
                <td>{exam.status}</td>
                <td>
                  {typeof exam.exam?.type === "string" &&
                  exam.exam.type === "coding" ? (
                    <>
                      {exam.status !== "completed" ? (
                        <Button
                          onClick={() => handleStartExam(exam.student_exam_id)}
                        >
                          Start Exam
                        </Button>
                      ) : (
                        <Button
                          onClick={() => showResult(exam.student_exam_id)}
                        >
                          Show Result
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      {!user?.is_registered ? (
                        <Button
                          onClick={() =>
                            navigate(
                              `/smowl/registration/${exam.student_exam_id}`
                            )
                          }
                        >
                          Register for exam
                        </Button>
                      ) : (
                        <>
                          {exam.status !== "completed" ? (
                            <Button
                              onClick={() =>
                                handleStartExam(exam.student_exam_id)
                              }
                            >
                              Start Exam
                            </Button>
                          ) : (
                            <Button
                              onClick={() => showResult(exam.student_exam_id)}
                            >
                              Show Result
                            </Button>
                          )}
                        </>
                      )}
                    </>
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