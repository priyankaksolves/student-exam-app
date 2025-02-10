import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getExams, createExam, updateExam, deleteExam } from "../api"; // Import exam APIs
import "../styles/Dashboard.css";
import { useAuth } from "../authContext/AuthContext";

interface Exam {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  is_live: boolean;
  created_by: number;
}

const Dashboard: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newExam, setNewExam] = useState<Partial<Exam>>({});
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const navigate = useNavigate();
  const { userId } = useAuth();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await getExams();
      setExams(response.data);
    } catch (err) {
      setError("Failed to fetch exams. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = async () => {
    if (!newExam.title || !newExam.start_time || !newExam.end_time) {
      setError("All fields are required.");
      return;
    }
  
    const payload = { 
      ...newExam, 
      created_by: userId // Ensure created_by is included
    };
  
    console.log("Creating Exam with payload:", payload); // ✅ Debug log
  
    try {
      await createExam(payload);
      setNewExam({ title: "", start_time: "", end_time: "", is_live: false }); // Clear form
      fetchExams();
    } catch (err) {
      console.error("Create Exam Error:", err);
      setError("Failed to create exam. Please try again.");
    }
  };

  const handleEditExam = async () => {
    if (!editingExam) return;
    try {
      await updateExam(editingExam.id, editingExam);
      setEditingExam(null);
      fetchExams();
    } catch (err) {
      setError("Failed to update exam. Please try again.");
    }
  };

  const handleDeleteExam = async (id: number) => {
    try {
      await deleteExam(id);
      fetchExams();
    } catch (err) {
      setError("Failed to delete exam. Please try again.");
    }
  };

  const handleStartExam = (examId: number) => {
    navigate(`/exam/${examId}/questions`);
  };


  if (loading) return <p className="loading-text">Loading exams...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <h2 className="section-title">Upcoming Exams</h2>

      <div className="exam-form">
        <h3>{editingExam ? "Edit Exam" : "Create Exam"}</h3>
        <input
          type="text"
          placeholder="Title"
          value={editingExam ? editingExam.title : newExam.title || ""}
          onChange={(e) =>
            editingExam
              ? setEditingExam({ ...editingExam, title: e.target.value })
              : setNewExam({ ...newExam, title: e.target.value })
          }
        />
        <input
          type="datetime-local"
          placeholder="Start Time"
          value={editingExam ? editingExam.start_time : newExam.start_time || ""}
          onChange={(e) =>
            editingExam
              ? setEditingExam({ ...editingExam, start_time: e.target.value })
              : setNewExam({ ...newExam, start_time: e.target.value })
          }
        />
        <input
          type="datetime-local"
          placeholder="End Time"
          value={editingExam ? editingExam.end_time : newExam.end_time || ""}
          onChange={(e) =>
            editingExam
              ? setEditingExam({ ...editingExam, end_time: e.target.value })
              : setNewExam({ ...newExam, end_time: e.target.value })
          }
        />
        <select
          value={editingExam ? (editingExam.is_live ? "true" : "false") : newExam.is_live ? "true" : "false"}
          onChange={(e) =>
            editingExam
              ? setEditingExam({ ...editingExam, is_live: e.target.value === "true" })
              : setNewExam({ ...newExam, is_live: e.target.value === "true" })
          }
        >
          <option value="true">Live</option>
          <option value="false">Not Live</option>
        </select>
        {editingExam ? (
          <button onClick={handleEditExam}>Update Exam</button>
        ) : (
          <button onClick={handleCreateExam}>Add Exam</button>
        )}
      </div>

      {exams.length > 0 ? (
        <div className="exam-list">
          {exams.map((exam) => (
            <div key={exam.id} className="exam-card">
              <p className="exam-title"><strong>{exam.title}</strong></p>
              <p className="exam-datetime">Start: {new Date(exam.start_time).toLocaleString()}</p>
              <p className="exam-datetime">End: {new Date(exam.end_time).toLocaleString()}</p>
              <p className={`exam-status ${exam.is_live ? "live" : "not-live"}`}>
                Status: {exam.is_live ? "Live" : "Not Live"}
              </p>
              <button onClick={() => handleStartExam(exam.id)} className="start-button">Start Exam</button>
              <button onClick={() => navigate("/create-exam")}>Create Exam</button>
              <button onClick={() => navigate(`/edit-exam/${exam.id}`)}>Edit</button>
              <button onClick={() => handleDeleteExam(exam.id)} className="delete-button">Delete</button>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-exams">No upcoming exams available.</p>
      )}
    </div>
  );
};

export default Dashboard;
