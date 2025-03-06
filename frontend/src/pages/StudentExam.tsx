import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Table, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchStudents,
  fetchExams,
  fetchStudentExams,
  assignStudentExam,
  deleteStudentExam,
} from "../api"; // Ensure these API functions are properly defined in your API file.
import "../styles/AdminDashboard.css";

interface Student {
  user_id: number;
  first_name: string;
  email: string;
}

interface Exam {
  exam_id: number;
  title: string;
}

interface Option {
  value: number;
  label: string;
}

interface StudentExamRecord {
  student_exam_id: number;
  student: Student;
  exam: Exam;
  start_time: string;
  end_time: string;
  status: string;
}

const StudentExam: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Option | null>(null);
  const [selectedExam, setSelectedExam] = useState<Option | null>(null);
  const [startTime, setStartTime] = useState("");
  const [studentExams, setStudentExams] = useState<StudentExamRecord[]>([]);
  const { id } = useParams()

  useEffect(() => {
    loadStudents();
    loadExams();
    loadStudentExams();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await fetchStudents();
      setStudents(response);
    } catch (error) {
      console.error("Error fetching students", error);
    }
  };

  const loadExams = async () => {
    try {
      const response = await fetchExams();
      setExams(response || []);
    } catch (error) {
      console.error("Error fetching exams", error);
    }
  };

  const loadStudentExams = async () => {
    try {
      setLoading(true);
      const response = await fetchStudentExams();
      setStudentExams(response.data.studentExams);
    } catch (error) {
      console.error("Error fetching student exams", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedStudent(null);
    setSelectedExam(null);
    setStartTime("");
  };

  const handleAssignExam = () => {
    resetForm();
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!selectedStudent || !selectedExam || !startTime) {
      toast.error("Please select a student, an exam, and a start time.", {
        autoClose: 5000,
      });
      return;
    }

    try {
      await assignStudentExam(
        selectedStudent.value,
        selectedExam.value,
        startTime,
      );

      toast.success("Student exam assigned successfully");
      setShowForm(false);
      resetForm();
      loadStudentExams();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error assigning student exam",
        { autoClose: 5000 }
      );
    }
  };

  const handleEdit= async (student_exam_id: number, record: StudentExamRecord)=> {
    navigate(`/edit/${student_exam_id}`, { state: { record } });

  };


  const handleDelete = async (studentExamId: number) => {
    try {
      await deleteStudentExam(studentExamId);
      toast.success("Exam deleted successfully", { autoClose: 5000 });
      setStudentExams(studentExams.filter((exam) => exam.student_exam_id !== studentExamId));
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete exam. Please try again.",
        { autoClose: 5000 }
      );
    }
  };

  const studentOptions: Option[] = students.map((student) => ({
    value: student.user_id,
    label: `${student.first_name} (${student.email})`,
  }));

  const examOptions: Option[] = exams.map((exam) => ({
    value: exam.exam_id,
    label: exam.title,
  }));

  return (
    <div className="mt-5">
      <button className="btn btn-primary rounded-pill btn-sm" onClick={handleAssignExam}>
        Assign Exam
      </button>

      {loading && <Spinner className="mt-2" animation="border" role="status" />}

      {showForm && (
        <div className="assign-exam-form border p-3 mt-3 rounded mb-4">
          <div className="row">
            <div className="mb-2 col-4">
              <label>Student</label>
              <Select
                options={studentOptions}
                value={selectedStudent}
                onChange={setSelectedStudent}
                placeholder="Select Student..."
                isClearable
              />
            </div>
            <div className="mb-2 col-4">
              <label>Exam</label>
              <Select
                options={examOptions}
                value={selectedExam}
                onChange={setSelectedExam}
                placeholder="Select Exam..."
                isClearable
              />
            </div>
            <div className="mb-2 col-4">
              <label>Start Time</label>
              <input
                type="datetime-local"
                className="form-control"
                onChange={(e) => setStartTime(e.target.value)}
                value={startTime}
              />
            </div>
          </div>
          <div className="d-flex mt-2">
            <button className="btn btn-success btn-sm me-2" onClick={handleSubmit}>
              Create
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {studentExams.length > 0 && (
        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>Sr. NO.</th>
              <th>Exam</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Assigned Date</th>
              <th>Start Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {studentExams.map((record, index) => (
              <tr key={record.student_exam_id}>
                <td>{index + 1}</td>
                <td>{record.exam.title}</td>
                <td>{record.student.first_name}</td>
                <td>{record.status.replace("_", " ")}</td>
                <td>{new Date(record.start_time).toLocaleDateString()}</td>
                <td>{new Date(record.start_time).toLocaleTimeString()}</td>
                <td className="d-flex align-items-center">
                  <span className="edit-button me-1" onClick={() => handleEdit(record.student_exam_id, record)}>
                    ✏️ Edit
                  </span>
                  <span className="delete-button me-1" onClick={() => handleDelete(record.student_exam_id)}>
                    🗑️ Delete
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default StudentExam;
