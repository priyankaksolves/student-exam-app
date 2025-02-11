import React, { useEffect, useState } from "react";
import {
  getAllQuestions,
  updateQuestion,
  deleteQuestion,
  addQuestion,
} from "../api"; // Import addQuestion API
import "../styles/EditQuestions.css"; // Import styles

interface Question {
  id: number;
  question_text: string;
  options: string[];
  correct_answer: string;
}

const EditQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editedQuestions, setEditedQuestions] = useState<{
    [key: number]: Partial<Question>;
  }>({});
  const [error, setError] = useState<string | null>(null);

  // New question state
  const [newQuestion, setNewQuestion] = useState<Question>({
    id: 0,
    question_text: "",
    options: ["", "", "", ""],
    correct_answer: "",
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await getAllQuestions();
      setQuestions(response.data);
    } catch (err) {
      setError("Failed to fetch questions. Please try again.");
    }
  };

  const handleInputChange = (
    questionId: number,
    field: string,
    value: string
  ) => {
    setEditedQuestions((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: value,
      },
    }));
  };

  const handleUpdateQuestion = async (id: number) => {
    try {
      const updatedQuestion = editedQuestions[id];
      if (updatedQuestion) {
        const questionData = {
          question_text:
            updatedQuestion.question_text ??
            questions.find((q) => q.id === id)?.question_text ??
            "",
          options:
            updatedQuestion.options ??
            questions.find((q) => q.id === id)?.options ??
            [],
          correct_answer: questions.find((q) => q.id === id)?.options[0] ?? "",
        };

        await updateQuestion(id, questionData);
        setQuestions((prev) =>
          prev.map((q) => (q.id === id ? { ...q, ...questionData } : q))
        );
        setEditedQuestions((prev) => {
          const { [id]: _, ...rest } = prev;
          return rest;
        });
      }
    } catch (err) {
      setError(`Failed to update question with ID ${id}`);
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?"
    );
    if (!confirmDelete) return;

    try {
      await deleteQuestion(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      setError(`Failed to delete question with ID ${id}. Please try again.`);
    }
  };

  const handleNewQuestionChange = (
    field: string,
    value: string | string[],
    index?: number
  ) => {
    setNewQuestion((prev) => ({
      ...prev,
      [field]: Array.isArray(value)
        ? value
        : index !== undefined
        ? prev.options.map((opt, i) => (i === index ? value : opt))
        : value,
    }));
  };

  const handleAddQuestion = async () => {
    if (
      !newQuestion.question_text ||
      newQuestion.options.some((opt) => opt === "") ||
      !newQuestion.correct_answer
    ) {
      setError("Please fill in all fields correctly.");
      return;
    }

    try {
      const examId = 1; // Replace with actual exam_id (e.g., from state or props)
      const response = await addQuestion(newQuestion, examId);
      setQuestions([...questions, response.data]);

      // Reset form fields
      setNewQuestion({
        id: 0,
        question_text: "",
        options: ["", "", "", ""],
        correct_answer: "",
      });
    } catch (err) {
      setError("Failed to add question.");
    }
  };

  return (
    <div className="edit-container">
      <h1 className="edit-title">Edit Questions</h1>
      {error && <p className="error-text">{error}</p>}

      {/* Add New Question Form */}
      <div className="add-question-form">
        <h2>Add New Question</h2>
        <input
          type="text"
          className="question-input"
          placeholder="Enter question text"
          value={newQuestion.question_text}
          onChange={(e) =>
            handleNewQuestionChange("question_text", e.target.value)
          }
        />

        {newQuestion.options.map((option, index) => (
          <input
            key={index}
            type="text"
            className="option-input"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) =>
              handleNewQuestionChange("options", e.target.value, index)
            }
          />
        ))}

        <select
          className="correct-answer-select"
          value={newQuestion.correct_answer}
          onChange={(e) =>
            handleNewQuestionChange("correct_answer", e.target.value)
          }
        >
          <option value="">Select Correct Answer</option>
          {newQuestion.options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button onClick={handleAddQuestion} className="add-button">
          Add Question
        </button>
      </div>

      {/* Existing Questions List */}
      {questions.length === 0 ? (
        <p className="loading-text">Loading questions...</p>
      ) : (
        <div className="questions-list">
          {questions.map((q) => (
            <div key={q.id} className="question-card">
              <input
                type="text"
                className="question-input"
                value={editedQuestions[q.id]?.question_text ?? q.question_text}
                onChange={(e) =>
                  handleInputChange(q.id, "question_text", e.target.value)
                }
              />

              {q.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  className={`option-input ${
                    option === q.correct_answer ? "correct-answer" : ""
                  }`}
                  value={editedQuestions[q.id]?.options?.[index] ?? option}
                  onChange={(e) =>
                    handleInputChange(q.id, `options.${index}`, e.target.value)
                  }
                />
              ))}

              <button
                onClick={() => handleUpdateQuestion(q.id)}
                className="update-button"
              >
                Update
              </button>
              <button
                onClick={() => handleDeleteQuestion(q.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditQuestions;
