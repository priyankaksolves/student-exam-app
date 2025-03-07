import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";
import { updateStudentExam, fetchStudents, fetchExams } from "../api"; // Import update API function
import { User } from "../interfaces/User";
import { Exam } from "../interfaces/exam";

const EditStudentExam: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { studentExamId } = useParams();
  const [students, setStudents] = useState<User[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [selectedExam, setSelectedExam] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [startTime, setStartTime] = useState("");

  useEffect(() => {
    if (state?.record) {
      const { student, exam, start_time } = state.record;
      // Convert ISO string to "YYYY-MM-DDTHH:mm"
      const formattedStartTime = new Date(start_time)
        .toISOString()
        .slice(0, 16);

      setSelectedStudent({ value: student.user_id, label: student.first_name });
      setSelectedExam({ value: exam.exam_id, label: exam.title });
      setStartTime(formattedStartTime);
    }
    loadStudents();
    loadExams();
  }, [state]);

  const loadStudents = async () => {
    try {
      const response = await fetchStudents();
      setStudents(response);
    } catch (error) {
      toast.error("Failed to load students.");
    }
  };

  const loadExams = async () => {
    try {
      const response = await fetchExams();
      setExams(response);
    } catch (error) {
      toast.error("Failed to load exams.");
    }
  };

  const handleSubmit = async () => {
    if (!selectedStudent || !selectedExam) {
      toast.error("Please select both student and exam.");
      return;
    }

    try {
      await updateStudentExam({
        student_exam_id: Number(studentExamId),
        student_id: selectedStudent.value,
        exam_id: selectedExam.value,
        start_time: startTime,
      });
      toast.success("Exam updated successfully!");
      navigate("/admin/student-exam"); // Redirect back
    } catch (error) {
      toast.error("Failed to update exam.");
    }
  };

  return (
    <div className="mt-5">
      <h2>Edit Exam Assignment</h2>
      <div className="row">
        <div className="mb-2 col-4">
          <label>Student</label>
          <Select
            options={students.map((s) => ({
              value: s.user_id,
              label: s.first_name,
            }))}
            value={selectedStudent}
            onChange={setSelectedStudent}
          />
        </div>
        <div className="mb-2 col-4">
          <label>Exam</label>
          <Select
            options={exams.map((e) => ({ value: e.exam_id, label: e.title }))}
            value={selectedExam}
            onChange={setSelectedExam}
          />
        </div>
        <div className="mb-2 col-4">
          <label>Start Time</label>
          <input
            type="datetime-local"
            className="form-control"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleSubmit}>
        Update Exam
      </button>
    </div>
  );
};

export default EditStudentExam;
