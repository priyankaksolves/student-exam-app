import { useState } from "react";
import { createExam } from "../api";
import { useAuth } from "../authContext/AuthContext";
import { useNavigate } from "react-router-dom";
import { Exam } from "../interfaces/exam";


const CreateExam: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [examData, setExamData] = useState<Partial<Exam>>({
    title: "",
    description: "",
    duration: 10,
    type: "aptitude",
    pass_marks: 0,
    created_by: userId ?? 0,
    questions: [],
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExamData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examData.title || !examData.duration || !examData.type || !examData.pass_marks) {
      setError("All fields are required.");
      return;
    }
    try {
      await createExam({ ...examData, created_by: userId ?? 0 });
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to create exam. Please try again.");
    }
  };

  return (
    <div className="create-exam-container">
      <h2>Create Exam</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" value={examData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={examData.description} onChange={handleChange}></textarea>
        <input type="number" name="duration" placeholder="Duration (minutes)" value={examData.duration} onChange={handleChange} required />
        <select name="type" value={examData.type} onChange={handleChange} required>
          <option value="aptitude">Aptitude</option>
          <option value="coding">Coding</option>
        </select>
        <input type="number" name="pass_marks" placeholder="Pass Marks" value={examData.pass_marks} onChange={handleChange} required />
        <button type="submit">Create Exam</button>
      </form>
    </div>
  );
};

export default CreateExam;
