import axios from "axios";
import { Exam } from "./interfaces/exam";
import { Question } from "./interfaces/Question";

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

export const registerUser = async (userData: { name: string; email: string; password: string; role: string }) => {
  return fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
    credentials: "include",
  }).then((res) => res.json());
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
export const getExams = async () => axios.get(`${API_URL}/exams`);
export const createExam = async (examData: Partial<Exam>) => {
  
  const formattedExamData = {
    title: examData.title,
    start_time: examData.startTime, // Convert to valid datetime
    end_time: examData.endTime, // Convert to valid datetime
    is_live: examData.isLive,
    created_by: examData.createdBy,
  };

  return axios.post(`${API_URL}/exams`, formattedExamData);
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

export const addQuestion = async (newQuestion: Question, examId: number) => {
  return api.post(`/questions/addquestion`, {
    question_text: newQuestion.question_text,
    options: newQuestion.options,
    correct_answer: newQuestion.correct_answer,
    exam_id: examId,  // ✅ Pass the exam_id
  });
};

export default api;
