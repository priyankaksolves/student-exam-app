import React, { useEffect, useState } from 'react';
import { getAllQuestions, updateQuestion, deleteQuestion } from '../api'; // Import API functions
import '../styles/EditQuestions.css'; // Import styles

interface Question {
  id: number;
  question_text: string;
  options: string[];
}

const EditQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editedQuestions, setEditedQuestions] = useState<{ [key: number]: Partial<Question> }>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await getAllQuestions();
      setQuestions(response.data);
    } catch (err) {
      setError('Failed to fetch questions. Please try again.');
    }
  };

  const handleInputChange = (questionId: number, field: string, value: string) => {
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
        // Ensure correct_answer is provided
        const questionData = {
          question_text: updatedQuestion.question_text ?? questions.find(q => q.id === id)?.question_text ?? '',
          options: updatedQuestion.options ?? questions.find(q => q.id === id)?.options ?? [],
          correct_answer: questions.find(q => q.id === id)?.options[0] ?? '' // Default to first option
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
    try {
      await deleteQuestion(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      setError(`Failed to delete question with ID ${id}`);
    }
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
                value={editedQuestions[q.id]?.question_text ?? q.question_text}
                onChange={(e) => handleInputChange(q.id, 'question_text', e.target.value)}
              />
              {q.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  className="option-input"
                  value={editedQuestions[q.id]?.options?.[index] ?? option}
                  onChange={(e) =>
                    handleInputChange(q.id, `options.${index}`, e.target.value)
                  }
                />
              ))}
              <button onClick={() => handleUpdateQuestion(q.id)} className="update-button">
                Update
              </button>
              <button onClick={() => handleDeleteQuestion(q.id)} className="delete-button">
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