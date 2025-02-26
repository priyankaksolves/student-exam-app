import { useEffect, useState } from "react";
import { getAllExams, getAllStudents, assignExamToStudent } from "../api"; // Import student functions
import { useNavigate } from "react-router-dom";
import { Exam } from "../interfaces/exam";
import { Button, Container, Table, Alert, Spinner, Form } from "react-bootstrap";
import { useAuth } from "../authContext/AuthContext";
import { User } from "../interfaces/User";


const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth(); // Get user role
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<number | "">("");

  useEffect(() => {
    fetchExams();
    fetchStudents();
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

  const fetchStudents = async () => {
    try {
      const response = await getAllStudents();
      setStudents(response.users);
    } catch (err) {
      setError("Failed to load students. Please try again.");
    }
  };

  const handleAssignExam = async (examId: number) => {
    if (!selectedStudent) {
      alert("Please select a student.");
      return;
    }

    try {
      const startTime = new Date();
      startTime.setHours(new Date().getHours() + 1); // Set exam start time to 1 hour from now
      const response = await assignExamToStudent({
        student_id: selectedStudent,
        exam_id: examId,
        start_time: startTime.toISOString(),
      });

      alert(response.message || "Exam assigned successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to assign exam.");
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Admin - Assign Exams to Students</h2>

      {loading && <Spinner animation="border" role="status" />}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group controlId="selectStudent">
        <Form.Label>Select a Student:</Form.Label>
        <Form.Select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(Number(e.target.value))}
        >
          <option value="">-- Select Student --</option>
          {students.map((student) => (
            <option key={student.user_id} value={student.user_id}>
              {student.first_name} ({student.email})
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {exams.length > 0 && (
        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Pass Marks</th>
              <th>Duration (mins)</th>
              <th>Assign Exam</th>
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
                    variant="warning"
                    onClick={() => handleAssignExam(exam.exam_id)}
                    disabled={!selectedStudent}
                  >
                    Assign to Student
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Dashboard;
