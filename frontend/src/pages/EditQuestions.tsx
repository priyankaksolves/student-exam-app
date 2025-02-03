import { useEffect, useState } from "react";
import { fetchAptitudeQuestions, updateQuestion } from "../api_old";
import "../styles/EditQuestions.css";

interface Question {
  id: number;
  question: string;
}

function EditQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editedQuestion, setEditedQuestion] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAptitudeQuestions()
      .then((response) => {
        setQuestions(response.data);
      })
      .catch(() => setError("Failed to fetch questions"));
  }, []);

  const handleUpdate = async (id: number) => {
    if (!editedQuestion[id]) {
      setError("Question text cannot be empty.");
      return;
    }

    try {
      await updateQuestion(id, { question: editedQuestion[id] });

      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => (q.id === id ? { ...q, question: editedQuestion[id] } : q))
      );

      setError(null);
    } catch (err) {
      setError(`Failed to update question with ID ${id}`);
    }
  };

  const handleInputChange = (id: number, value: string) => {
    setEditedQuestion((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="edit-container">
      <h1 className="edit-title">Edit Questions</h1>
      {error && <p className="error-text">{error}</p>}
      {questions.length === 0 ? (
        <p className="loading-text">Loading questions...</p>
      ) : (
        <div className="questions-list">
          {questions.map((q) => (
            <div key={q.id} className="question-card">
              <input
                type="text"
                className="question-input"
                value={editedQuestion[q.id] ?? q.question}
                onChange={(e) => handleInputChange(q.id, e.target.value)}
              />
              <button className="update-button" onClick={() => handleUpdate(q.id)}>
                Update
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EditQuestions;
