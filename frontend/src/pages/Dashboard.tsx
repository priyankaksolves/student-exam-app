import { useEffect, useState } from "react";
import {
  getAllExams,
  getAllStudents,
  assignExamToStudent,
  updateExamStatus,
} from "../api";
import { useNavigate } from "react-router-dom";
import { Exam } from "../interfaces/exam";
import {
  Button,
  Container,
  Table,
  Alert,
  Spinner,
  Form,
  Modal,
} from "react-bootstrap";
import { User } from "../interfaces/User";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<number | "">("");
  const [selectedExam, setSelectedExam] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [startTime, setStartTime] = useState<string>("");

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

  // Open modal & set selected exam
  const openAssignExamModal = (examId: number) => {
    if (!selectedStudent) {
      alert("Please select a student first.");
      return;
    }
    console.log("Opening modal for Exam ID:", examId);
    setSelectedExam(examId);
    setShowModal(true);
  };

  const handleAssignExam = async () => {
    if (!selectedStudent || !selectedExam || !startTime) {
      alert("Please select a student, exam, and start time.");
      return;
    }

    console.log("Assigning exam with data:", {
      student_id: selectedStudent,
      exam_id: selectedExam,
      start_time: new Date(startTime).toISOString(),
    });

    try {
      const response = await assignExamToStudent({
        student_id: selectedStudent,
        exam_id: selectedExam,
        start_time: new Date(startTime).toISOString(),
      });

      alert(response.message || "Exam assigned successfully!");
      setShowModal(false); // Close modal after assignment
    } catch (error: any) {
      console.error("Assignment failed:", error);
      alert(error.message || "Failed to assign exam.");
    }
  };

  const handleToggleLiveStatus = async (
    examId: number,
    currentStatus: boolean
  ) => {
    try {
      const response = await updateExamStatus(examId, !currentStatus);
      alert(response.data.message);
      setExams((prevExams) =>
        prevExams.map((exam) =>
          exam.exam_id === examId ? { ...exam, is_live: !currentStatus } : exam
        )
      );
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Admin - Assign & Edit Exams</h2>

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
              <th>Action</th>
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
                    onClick={() => {
                      console.log(
                        "🟢 Button Clicked for Exam ID:",
                        exam.exam_id
                      );
                      openAssignExamModal(exam.exam_id);
                    }}
                    disabled={!selectedStudent}
                  >
                    Assign to Student
                  </Button>
                </td>
                <td className="d-flex align-items-center">
                  <Button
                    variant="primary"
                    onClick={() =>
                      navigate(`/exam/${exam.exam_id}/add-questions/`)
                    }
                  >
                    Edit Exam
                  </Button>
                  <div className="form-check form-switch ms-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`toggleLive-${exam.exam_id}`}
                      checked={exam.is_live}
                      onChange={() =>
                        handleToggleLiveStatus(exam.exam_id, exam.is_live)
                      }
                    />
                    <label
                      className={`form-check-label ${
                        exam.is_live
                          ? "text-success fw-bold"
                          : "text-danger fw-bold"
                      }`}
                      htmlFor={`toggleLive-${exam.exam_id}`}
                    >
                      {exam.is_live ? "Active" : "Inactive"}
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal for selecting start time */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Exam Start Time</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="examStartTime">
            <Form.Label>Choose Start Time:</Form.Label>
            <Form.Control
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAssignExam}
            disabled={!startTime}
          >
            Confirm & Assign
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;
