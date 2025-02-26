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
    <div className="container mt-4">
      <h2 className="mb-3">Create Exam</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="card p-4 shadow">
        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Exam Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            placeholder="Enter exam title"
            value={examData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            placeholder="Enter exam description"
            rows={3}
            value={examData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Duration */}
        <div className="mb-3">
          <label className="form-label">Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            className="form-control"
            placeholder="Enter duration in minutes"
            value={examData.duration}
            onChange={handleChange}
            required
          />
        </div>

        {/* Exam Type */}
        <div className="mb-3">
          <label className="form-label">Exam Type</label>
          <select
            name="type"
            className="form-select"
            value={examData.type}
            onChange={handleChange}
            required
          >
            <option value="aptitude">Aptitude</option>
            <option value="coding">Coding</option>
          </select>
        </div>

        {/* Pass Marks */}
        <div className="mb-3">
          <label className="form-label">Pass Marks</label>
          <input
            type="number"
            name="pass_marks"
            className="form-control"
            placeholder="Enter minimum pass marks"
            value={examData.pass_marks}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-100">
          Create Exam
        </button>
      </form>
    </div>
  );
};

export default CreateExam;
