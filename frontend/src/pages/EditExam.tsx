import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExamById, updateExam } from "../api";
import { useAuth } from "../authContext/AuthContext";
import { Exam } from "../interfaces/exam";
import { toast } from "react-toastify";

const UpdateExam: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [examData, setExamData] = useState<Partial<Exam>>({
    type: "aptitude",  // Default type
  });  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await getExamById(Number(id)); // Fetch the exam by ID
        console.log("Fetched Exam Data:", response.data.examDetails); // Debugging line
        setExamData({ ...response.data.examDetails }); // Force updating state
      } catch (err) {
        setError("Failed to fetch exam details.");
      }
    };
    if (id) fetchExam();
  }, [id]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Updating field ${name} with value:`, value);
    setExamData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure all fields are populated
    if (!examData.title || !examData.duration || !examData.type || !examData.pass_marks) {
      setError("All fields are required.");
      return;
    }

    if (!examData.title) {
      return <div>Loading Exam Details...</div>;
    }
  
    try {
      await updateExam(Number(id), {...examData, created_by: userId ?? 0 });
      setExamData({ ...examData, created_by: userId ?? 0 });
      toast.success("Exam updated successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Failed to update exam. Please try again.");
    }
  };
  

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Update Exam</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="card p-4 shadow">
        <div className="mb-3">
          <label className="form-label">Exam Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={examData.title ?? ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows={3}
            value={examData.description ?? ""}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            className="form-control"
            value={examData.duration ?? ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Exam Type</label>
          <select
            name="type"
            className="form-select"
            value={examData.type ?? "aptitude"}
            onChange={handleChange}
            required
          >
            <option value="aptitude">Aptitude</option>
            <option value="coding">Coding</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Pass Marks</label>
          <input
            type="number"
            name="pass_marks"
            className="form-control"
            value={examData.pass_marks ?? ""}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Update Exam</button>
      </form>
    </div>
  );
};

export default UpdateExam;
