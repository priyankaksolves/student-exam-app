import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { Table, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { deleteStudentExam } from "../api";
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
  student: {
    user_id: number;
    first_name: string;
    email: string;
  };
  exam: {
    exam_id: number;
    title: string;
  };
  start_time: string;
  end_time: string;
  status: string;
}

const StudentExam: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Option | null>(null);
  const [selectedExam, setSelectedExam] = useState<Option | null>(null);
  const [startTime, setStartTime] = useState<string>("");
  const [studentExams, setStudentExams] = useState<StudentExamRecord[]>([]);

  useEffect(() => {
    fetchStudents();
    fetchExams();
    fetchStudentExams();
  }, []);

  const fetchStudents = async (): Promise<void> => {
    try {
      const response = await axios.get<{ users: Student[] }>(
        "http://localhost:3000/api/users?role=student"
      );
      setStudents(response.data.users);
    } catch (error) {
      console.error("Error fetching students", error);
    }
  };

  const fetchExams = async (): Promise<void> => {
    try {
      const response = await axios.get<{ exams: Exam[] }>(
        "http://localhost:3000/api/exam"
      );
      setExams(response.data.exams);
    } catch (error) {
      console.error("Error fetching exams", error);
    }
  };

  const fetchStudentExams = async (): Promise<void> => {
    try {
      const response = await axios.get<{ studentExams: StudentExamRecord[] }>(
        "http://localhost:3000/api/student-exam"
      );
      setStudentExams(response.data.studentExams);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching student exams", error);
    }
  };

  const resetForm = () => {
    setSelectedStudent(null);
    setSelectedExam(null);
    setStartTime("");
  };

  const handleAssignExam = (): void => {
    resetForm();
    setShowForm(true);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!selectedStudent || !selectedExam || !startTime) {
      toast.error("Please select a student, an exam, and a start time.", {
        autoClose: 3000,
      });
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/student-exam", {
        student_id: selectedStudent.value,
        exam_id: selectedExam.value,
        start_time: startTime,
      });
      toast.success("Student exam assigned successfully");
      setShowForm(false);
      resetForm();
      fetchStudentExams();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error creating student exam",
        {
          autoClose: 3000,
        }
      );
    }
  };

  const handleDelete = async (studentexamId: number) => {
    try {
      const response = await deleteStudentExam(studentexamId);
      toast.success(response.data.message, { autoClose: 3000 });
      setStudentExams(
        studentExams.filter((exam) => exam.student_exam_id !== studentexamId)
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete exam. Please try again.",
        {
          autoClose: 3000,
        }
      );
    }
  };

  // Convert students and exams to react-select option format
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
      <button
        className="btn btn-primary rounded-pill btn-sm"
        onClick={handleAssignExam}
      >
        Assign Exam
      </button>
      <br />
      {loading && <Spinner className="mt-2" animation="border" role="status" />}

      {showForm && (
        <div className="assign-exam-form border p-3 mt-3 rounded mb-4">
          <div className="row">
            <div className="mb-2 col-4">
              <label>Student</label>
              <Select
                options={studentOptions}
                value={selectedStudent}
                onChange={(option) => {
                  console.log("Selected student option:", option);
                  setSelectedStudent(option);
                }}
                placeholder="Select Student..."
                isClearable
              />
            </div>
            <div className="mb-2 col-4">
              <label>Exam</label>
              <Select
                options={examOptions}
                value={selectedExam}
                onChange={(option) => {
                  console.log("Selected exam option:", option);
                  setSelectedExam(option);
                }}
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
            <button
              className="btn btn-success btn-sm me-2"
              onClick={handleSubmit}
            >
              Create
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
            >
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
                <td>
                  {new Date(record.start_time).toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td>
                  {new Date(record.start_time).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>
                <td className="d-flex align-items-center">
                  <div
                    className="d-flex align-items-center edit-button me-1"
                    onClick={() => navigate(`/`)}
                  >
                    <i className="bi bi-pencil-square me-1"></i>
                    <span> Edit</span>
                  </div>
                  <div
                    className="d-flex align-items-center delete-button me-1"
                    onClick={() => handleDelete(record.student_exam_id)}
                  >
                    <i className="bi bi-trash-fill me-1"></i>
                    <span> Delete</span>
                  </div>
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
