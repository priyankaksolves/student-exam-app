import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createExam } from "../api";
import { useAuth } from "../authContext/AuthContext";

const CreateExam: React.FC = () => {
  const [exam, setExam] = useState({
    title: "",
    startTime: "",
    endTime: "",
    isLive: false,
    createdBy: undefined,
  });

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { userId } = useAuth(); // Get userId from context
  console.log("CreateExam userId:", userId); // ✅ Debug log
  const createdByUser = userId ?? undefined; 


  const handleCreateExam = async () => {
    if (!exam.title || !exam.startTime || !exam.endTime) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await createExam({
        ...exam,
        createdBy: createdByUser, // Ensure createdBy is included
      });

      navigate(`/exam/${response.data.id}/edit`);
    } catch (err) {
      setError("Failed to create exam.");
    }
  };

  return (
    <div>
      <h2>Create Exam</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        placeholder="Title"
        value={exam.title}
        onChange={(e) => setExam({ ...exam, title: e.target.value })}
      />
      <input
        type="datetime-local"
        value={exam.startTime}
        onChange={(e) => setExam({ ...exam, startTime: e.target.value })}
      />
      <input
        type="datetime-local"
        value={exam.endTime}
        onChange={(e) => setExam({ ...exam, endTime: e.target.value })}
      />
      <select
        value={exam.isLive ? "true" : "false"}
        onChange={(e) => setExam({ ...exam, isLive: e.target.value === "true" })}
      >
        <option value="false">Not Live</option>
        <option value="true">Live</option>
      </select>
      <button onClick={handleCreateExam}>Create Exam</button>
    </div>
  );
};

export default CreateExam;
