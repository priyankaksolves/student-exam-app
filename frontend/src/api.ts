import axios from "axios";
import { Question } from "./interfaces/Question";
import { Exam } from "./interfaces/exam";

const API_URL = "http://localhost:5000/api"; // Base API URL

// Set up Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// User Authentication APIs
export const loginUser = async (email: string, password: string) => {
  return fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  }).then((res) => res.json());
};


export const registerUser = async (userData: { firstName: string; lastName: string; email: string; password: string; role: string }) => {
  try {
    const response = await axios.post(`${API_URL}/users/signup`, 
      {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.role,
      }
    );

    return response.data;  // Axios automatically parses JSON
  } catch (error) {
    console.error("Signup Error:", error);
    throw error;
  }
};


// Get User Profile (Protected Route)
export const getUserProfile = async (token: string) => {
  try {
    const response = await api.get("/users/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Failed to fetch profile";
  }
};

// Logout User (Optional - Clearing token from localStorage)
export const logoutUser = () => {
  localStorage.removeItem("token");
};

// Exam APIs
export const getExamById = async (id: number) => api.get(`/exams/${id}`);

export const getAllExams = async () => {
  const response = await axios.get(`${API_URL}/exam`);
  return response.data.exams; // Directly return the exams array
};

export const createExam = async (examData: Partial<Exam>) => {
  const formattedExamData = {
    title: examData.title,
    duration: examData.duration || "", // Ensure description is included
    type: examData.type,
    pass_marks: examData.pass_marks ?? 0, // Ensure pass_marks is included
    created_by: 1, // examData.created_by,
    questions: examData.questions || [], // Ensure we send questions
  };

  return axios.post(`${API_URL}/exam/`, formattedExamData);
};


export const updateExam = async (id: number, updatedExam: Partial<Exam>) => axios.put(`${API_URL}/exams/${id}`, updatedExam);
export const deleteExam = async (id: number) => axios.delete(`${API_URL}/exams/${id}`);

// **Aptitude Test APIs**

// Get all questions (without specifying an exam)
export const getAllQuestions = async () => {
  return api.get(`/questions/allquestions`);
};


// Get all questions for an exam
export const getExamQuestions = async (examId: number) => {
  return api.get(`/exams/${examId}/questions`);
};

// Submit answers for an exam
export const submitExamAnswers = async (userId: number, examId: number, answers: { questionId: number; selectedOption: string }[]) => {
  return api.post(`/exams/${examId}/submit`, { userId, answers });
};

// Get exam score after submission
export const getExamScore = async (examId: number, userId: number) => {
  return api.get(`/exams/${examId}/score/${userId}`);
};

// Get questions by exam id
export const getQuestionsByExamId = async (examId: number) => {
  return await axios.get(`${API_URL}/exams/${examId}/questions`);
};

// **NEW: Add a question to an exam**
export const addQuestionToExam = async (examId: number, questionData: { question_text: string; options: string[]; correct_answer: string }) => {
  return api.post(`/exams/${examId}/questions`, questionData);
};

// **NEW: Update an existing question**
export const updateQuestion = async (questionId: number, questionData: { question_text: string; options: string[]; correct_answer: string }) => {
  return api.put(`/questions/${questionId}`, questionData);
};

export const deleteQuestion = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/questions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};

export const addQuestion = async (examId: number, newQuestion: Question) => {
  return api.post(`/exam/${examId}/question/add`, {
    questions: [
      {
        exam_id: examId,
        question_text: newQuestion.question_text,
        question_type: newQuestion.question_type,
        marks: Number(newQuestion.marks), // ✅ Ensure marks is a number
        correct_answer: newQuestion.correct_answer,
        options:
          newQuestion.question_type === "multiple_choice" || newQuestion.question_type === "multi_select"
            ? newQuestion.options?.map((option) => ({
              option_text: option.option_text, // ✅ Ensure text is included
                is_correct: option.is_correct || false, // ✅ At least one must be true
              })) || []
            : [],
      },
    ],
  });
};


// Fetch existing questions for an exam
export const getQuestionsForExam = async (examId: number) => {
  return api.get(`/exam/${examId}`);
};

export default api;
