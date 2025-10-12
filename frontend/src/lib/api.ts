import axios from "axios";
import {
  User,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  Quiz,
  CreateQuizData,
  QuizResponse,
  DashboardStats,
  ApiResponse,
  Answer,
  AIQuestionRequest,
  AIQuestionResponse,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("quiz_user");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (
    userData: RegisterData
  ): Promise<{ data: ApiResponse<AuthResponse> }> =>
    api.post("/users/register", userData),

  login: (
    credentials: LoginCredentials
  ): Promise<{ data: ApiResponse<AuthResponse> }> =>
    api.post("/users/login", credentials),

  getMe: (): Promise<{ data: ApiResponse<User> }> => api.get("/users/me"),
};

// Teacher API calls
export const teacherAPI = {
  createQuiz: (
    quizData: CreateQuizData
  ): Promise<{ data: ApiResponse<Quiz> }> =>
    api.post("/teacher/quizzes", quizData),

  getTeacherQuizzes: (): Promise<{ data: ApiResponse<Quiz[]> }> =>
    api.get("/teacher/quizzes"),

  getDashboardStats: (): Promise<{ data: ApiResponse<DashboardStats> }> =>
    api.get("/teacher/dashboard/stats"),

  getQuizAnalytics: (quizId: string): Promise<{ data: ApiResponse<any> }> =>
    api.get(`/teacher/quizzes/${quizId}/analytics`),

  toggleQuizStatus: (
    quizId: string,
    isActive: boolean
  ): Promise<{ data: ApiResponse<any> }> =>
    api.patch(`/teacher/quizzes/${quizId}/status`, { isActive }),

  getQuizStatus: (quizId: string): Promise<{ data: ApiResponse<any> }> =>
    api.get(`/teacher/quizzes/${quizId}/status`),
};

// Student API calls
export const studentAPI = {
  joinQuiz: (secretCode: string): Promise<{ data: ApiResponse<Quiz> }> =>
    api.post("/student/join", { secretCode }),

  submitQuiz: (
    quizId: string,
    data: { answers: Answer[]; violations?: number }
  ): Promise<{ data: ApiResponse<QuizResponse> }> =>
    api.post(`/student/${quizId}/submit`, data),

  getStudentQuizzes: (): Promise<{ data: ApiResponse<QuizResponse[]> }> =>
    api.get("/student/quizzes"),
};

// AI API calls - NEW
export const aiAPI = {
  generateQuestions: (
    data: AIQuestionRequest
  ): Promise<{ data: ApiResponse<AIQuestionResponse> }> =>
    api.post("/ai/generate-questions", data),

  checkHealth: (): Promise<{ data: ApiResponse<any> }> =>
    api.get("/ai/health"),
};