import axios from "axios";
import { Question } from "./interfaces/Question";
import { Exam } from "./interfaces/exam";
import { User } from "./interfaces/User";

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
  const response = await axios.post(`${API_URL}/users/login`, {
    email,
    password,
  });

  return response.data;
};

export const registerUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/users/signup`, {
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      password: userData.password,
      role: userData.role,
    });

    return response.data;
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

// Exam APIs
export const getExamById = async (id: number) => api.get(`/exam/${id}`);
export const getStudentExamById = async (id: number) => {
  const token = localStorage.getItem("token");
  return api.get(`/student-exam/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllExams = async () => {
  const response = await axios.get(`${API_URL}/exam`);
  return response.data.exams; // Directly return the exams array
};

export const createExam = async (examData: Partial<Exam>) => {
  return axios.post(`${API_URL}/exam/`, examData);
};


export const updateExam = async (id: number | undefined, updatedExam: Partial<Exam>) => axios.put(`${API_URL}/exam/${id}`, updatedExam);
export const deleteExam = async (id: number) => axios.delete(`${API_URL}/exam/${id}`);

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
export const submitExamAnswers = async (
  userId: number,
  examId: number,
  answers: { questionId: number; selectedOption: string }[]
) => {
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
export const addQuestionToExam = async (
  examId: number,
  questionData: {
    question_text: string;
    options: string[];
    correct_answer: string;
  }
) => {
  return api.post(`/exams/${examId}/questions`, questionData);
};

// **NEW: Update an existing question**
export const updateQuestion = async (
  exam_id: number,
  question_id: number,
  questionData: any
) => {
  return api.put(`exam/${exam_id}/question/edit/${question_id}`, questionData);
};

export const deleteQuestion = async (question_id: number,exam_id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/exam/${exam_id}/question/${question_id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting question:", error);
    throw error;
  }
};

export const addQuestion = async (examId: number, questions: Question[]) => {
  return api.post(`/exam/${examId}/question/add`, { questions });
};

// Fetch existing questions for an exam
export const getQuestionsForExam = async (examId: number) => {
  return api.get(`/exam/${examId}`);
};

export const startExam = async (examId: number) => {
  return api
    .patch(`/student-exam/${examId}/start`)
    .then((response) => response.data) // Returns { message: 'Exam Started', leftTime }
    .catch((error) => {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      } else {
        throw { message: "Failed to start exam." };
      }
    });
};

// Fetch all students
export const getAllStudents = async () => {
  try {
    const response = await axios.post(`${API_URL}/users/getUsers`, {
      role: "student",
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to load students."
    );
  }
};

// Assign an exam to a student
export const assignExamToStudent = async (examData: {
  student_id: number;
  exam_id: number;
  start_time: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/student-exam`, examData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to assign exam.");
  }
};

// Fetch assigned exams for a student
export const getStudentExams = async (studentId: number) => {
  try {
    const response = await axios.get(`${API_URL}/student-exam/${studentId}/all`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch exams.");
  }
};

// Start an exam
export const startStudentExam = async (studentExamId: number) => {
  try {
    const response = await axios.patch(
      `${API_URL}/student-exam/${studentExamId}/start`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to start exam.");
  }
};

// Submit Exam
export const submitExam = async (studentExamId: number, responses: any[]) => {
  return axios.post(`${API_URL}/student-response/${studentExamId}`, {
    responses,
  });
};

export const declareResult = async (studentExamId: number) => {
  const response = await axios.post(`${API_URL}/result/exam/${studentExamId}`);
  return response.data;
};

// Fetch assigned exams for a student
export const getResult = async (studentExamId: number) => {
  try {
    const response = await axios.get(`${API_URL}/result/exam/${studentExamId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get score.");
  }
};
export const updateExamStatus = async (examId: number, isLive: boolean) => {
  return axios.patch(`${API_URL}/exam/${examId}/live`, { is_live: isLive });
};

export const fetchStudents = async () => {
  try {
    const response = await axios.get<{ users: User[] }>(`${API_URL}/users?role=student`);
    return response.data.users; // Extract only the users array
  } catch (error) {
    console.error("Error fetching students", error);
    throw error;
  }
};


export const fetchExams = async () => {
  try {
    const response = await axios.get<{ exams: Exam[] }>(`${API_URL}/exam`);
    return response.data.exams; // Extract exams array
  } catch (error) {
    console.error("Error fetching exams", error);
    throw error;
  }
};

export const fetchStudentExams = async () => {
  return axios.get<{ studentExams: any[] }>(`${API_URL}/student-exam`);
};

export const assignStudentExam = async (
  student_id: number,
  exam_id: number,
  start_time: string
) => {
  return axios.post(`${API_URL}/student-exam`, {
    student_id,
    exam_id,
    start_time,
  });
};

export const deleteStudentExam = async (studentExamId: number) => {
  return axios.delete(`${API_URL}/student-exam/${studentExamId}`);
};

export const updateStudentExam = async (studentExamData: {
  student_id: number;
  start_time: string;
  exam_id: number;
  student_exam_id: number;
}) => {
  try {
    const response = await axios.put(`${API_URL}/student-exam/${studentExamData.student_exam_id}`, studentExamData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update student exam.");
  }
};

export const fetchLanguages = async () => {
  const { data } = await api.get("/judge0/languages");
  return data;
};

export const submitCodeToJudge0 = async (payload: any) => {
  const { data } = await api.post("/judge0/submit-code", payload);
  return data;
};

export const fetchExecutionResult = async (token: string) => {
  const { data } = await api.get(`/judge0/result/${token}`);
  return data;
};

export default api;
