import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllQuestions, createExam } from '../api'; // Import API functions
import '../styles/CreateExam.css'; // Import styles

interface Question {
  id: number;
  question_text: string;
  options: string[];
}

const CreateExam: React.FC = () => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch available questions using getAllQuestions from api.ts
    const fetchQuestions = async () => {
      try {
        const response = await getAllQuestions();
        setQuestions(response.data); // Assuming response.data contains the questions array
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleCreateExam = async () => {
    try {
      const userId = localStorage.getItem("userId"); // Get user ID from localStorage
  
      if (!userId) {
        alert("User not logged in!");
        return;
      }
  
      // Ensure start_time and end_time are properly formatted
      if (!startTime || !endTime) {
        alert("Please select valid start and end times!");
        return;
      }
  
      const formattedStartTime = new Date(startTime).toISOString();
      const formattedEndTime = new Date(endTime).toISOString();
  
      const examData = {
        title,
        startTime: formattedStartTime,  // Ensure correct property names
        endTime: formattedEndTime,
        isLive,
        createdBy: parseInt(userId, 10), // Ensure correct property name and convert to number
        question_ids: selectedQuestions, // Ensure we send `question_ids`
      };
  
      console.log("✅ Exam Payload:", examData); // Debugging
  
      await createExam(examData);
      navigate('/dashboard'); // Redirect after successful creation
    } catch (error) {
      console.error("❌ Error creating exam:", error);
    }
  };
  


  return (
    <div className="create-exam-container">
      <h1 className="create-exam-title">Create Exam</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleCreateExam(); }}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="startTime">Start Time</label>
          <input
            type="datetime-local"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="endTime">End Time</label>
          <input
            type="datetime-local"
            id="endTime"
            value={endTime}
            onChange={(e) => {setEndTime(e.target.value)}}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="isLive">Is Live</label>
          <input
            type="checkbox"
            id="isLive"
            checked={isLive}
            onChange={(e) => setIsLive(e.target.checked)}
          />
        </div>
        <div className="form-group">
          <label>Select Questions</label>
          {questions.map((question) => (
            <div key={question.id}>
              <input
                type="checkbox"
                value={question.id}
                onChange={(e) => {
                  const questionId = Number(e.target.value);
                  setSelectedQuestions((prev) =>
                    e.target.checked
                      ? [...prev, questionId]
                      : prev.filter((id) => id !== questionId)
                  );
                }}
              />
              {question.question_text}
            </div>
          ))}
        </div>
        <button type="submit" className="create-exam-button">Create Exam</button>
      </form>
    </div>
  );
};

export default CreateExam;