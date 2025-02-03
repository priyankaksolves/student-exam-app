import axios from "axios";
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
export const createExam = async (examData: Partial<Exam>) => axios.post(`${API_URL}/exams`, examData);
export const updateExam = async (id: number, updatedExam: Partial<Exam>) => axios.put(`${API_URL}/exams/${id}`, updatedExam);
export const deleteExam = async (id: number) => axios.delete(`${API_URL}/exams/${id}`);

// **Aptitude Test APIs**

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
export const addQuestion = async (examId: number, questionData: { question_text: string; options: string[]; correct_answer: string }) => {
  return api.post(`/exams/${examId}/questions`, questionData);
};

// **NEW: Update an existing question**
export const updateQuestion = async (questionId: number, questionData: { question_text: string; options: string[]; correct_answer: string }) => {
  return api.put(`/questions/${questionId}`, questionData);
};

// **NEW: Delete a question**
export const deleteQuestion = async (questionId: number) => {
  return api.delete(`/questions/${questionId}`);
};

export default api;
