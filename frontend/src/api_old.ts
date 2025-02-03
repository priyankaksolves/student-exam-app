import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/tasks'; // Adjust as per your backend URL
const AUTH_API_BASE_URL = 'http://localhost:3000/api/auth';
const USER_API_URL = 'http://localhost:3000/api/users/me';
const FRIENDS_API_URL = 'http://localhost:3000/api/friendship/friends';
const QUESTIONS_API_URL = 'http://localhost:3000/api/questions';

interface Exam {
  id: number;
  institute_name: string;
  type: string;
  exam_start_at: string;
  exam_end_at: string;
  is_live: boolean;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: string;
}

const dummyExams: Exam[] = [
  {
    id: 1,
    institute_name: "XYZ University",
    type: "Aptitude",
    exam_start_at: "2025-02-10T10:00:00Z",
    exam_end_at: "2025-02-10T12:00:00Z",
    is_live: true,
  },
  {
    id: 2,
    institute_name: "ABC College",
    type: "Coding",
    exam_start_at: "2025-02-15T14:00:00Z",
    exam_end_at: "2025-02-15T16:00:00Z",
    is_live: false,
  },
];

const dummyQuestions: Question[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correct_answer: "Paris",
  },
  {
    id: 2,
    question: "Which number comes next in the sequence: 2, 6, 12, 20, __?",
    options: ["24", "30", "28", "36"],
    correct_answer: "30",
  },
  {
    id: 3,
    question: "What is 15% of 200?",
    options: ["20", "25", "30", "35"],
    correct_answer: "30",
  },
  {
    id: 4,
    question: "Who developed the theory of relativity?",
    options: ["Isaac Newton", "Albert Einstein", "Nikola Tesla", "Galileo Galilei"],
    correct_answer: "Albert Einstein",
  },
  {
    id: 5,
    question: "What is the square root of 144?",
    options: ["10", "12", "14", "16"],
    correct_answer: "12",
  }
];

// Helper function to get the token from localStorage
const getToken = () => localStorage.getItem('token');

// Helper to set the authorization headers
const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Authentication APIs
export const signup = async (userData: { username: string; email: string; password: string }) => {
  return await axios.post(`${AUTH_API_BASE_URL}/signup`, userData);
};

export const login = async (userData: { email: string; password: string }) => {
  return await axios.post(`${AUTH_API_BASE_URL}/login`, userData);
};

// Fetching exams (returning dummy data instead of API call)
export const fetchExams = async () => {
  return new Promise<{ data: Exam[] }>((resolve) => {
    setTimeout(() => {
      resolve({ data: dummyExams });
    }, 1000); // Simulate API delay
  });
};

// Fetching aptitude questions (returning dummy data instead of API call)
export const fetchAptitudeQuestions = async () => {
  return new Promise<{ data: Question[] }>((resolve) => {
    setTimeout(() => {
      resolve({ data: dummyQuestions });
    }, 1000); // Simulate API delay
  });
};

// API for updating a question
export const updateQuestion = async (id: number, data: { question: string }) => {
  return await axios.put(`${QUESTIONS_API_URL}/${id}`, data, authHeaders());
};
