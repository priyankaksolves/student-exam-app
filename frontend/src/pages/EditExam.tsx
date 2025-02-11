import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExamById, addQuestionToExam, deleteQuestion } from "../api";

interface Question {
  id: number;
  question_text: string;
  options: string[];
  correct_answer: string;
}

const EditExam: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState({ question_text: "", options: ["", "", "", ""], correct_answer: "" });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExamDetails();
  }, []);

  const fetchExamDetails = async () => {
    try {
      const response = await getExamById(Number(examId));
      setExam(response.data);
      setQuestions(response.data.questions);
    } catch (err) {
      setError("Failed to load exam.");
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.question_text || !newQuestion.correct_answer || newQuestion.options.some(opt => !opt)) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await addQuestionToExam(Number(examId), newQuestion);
      setQuestions([...questions, response.data]);
      setNewQuestion({ question_text: "", options: ["", "", "", ""], correct_answer: "" });
    } catch (err) {
      setError("Failed to add question.");
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    try {
      await deleteQuestion(id);
      setQuestions(questions.filter((q) => q.id !== id));
    } catch (err) {
      setError("Failed to delete question.");
    }
  };

  return (
    <div>
      <h2>Edit Exam: {exam?.title}</h2>
      {error && <p className="error">{error}</p>}

      <h3>Questions</h3>
      <ul>
        {questions.map((q) => (
          <li key={q.id}>
            {q.question_text} 
            <button onClick={() => handleDeleteQuestion(q.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Add New Question</h3>
      <input 
        type="text" 
        placeholder="Question Text" 
        value={newQuestion.question_text} 
        onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })} 
      />
      {newQuestion.options.map((opt, index) => (
        <input 
          key={index} 
          type="text" 
          placeholder={`Option ${index + 1}`} 
          value={opt} 
          onChange={(e) => {
            const updatedOptions = [...newQuestion.options];
            updatedOptions[index] = e.target.value;
            setNewQuestion({ ...newQuestion, options: updatedOptions });
          }} 
        />
      ))}
      <input 
        type="text" 
        placeholder="Correct Answer" 
        value={newQuestion.correct_answer} 
        onChange={(e) => setNewQuestion({ ...newQuestion, correct_answer: e.target.value })} 
      />
      <button onClick={handleAddQuestion}>Add Question</button>

      <button onClick={() => navigate("/dashboard")}>Finish</button>
    </div>
  );
};

export default EditExam;
