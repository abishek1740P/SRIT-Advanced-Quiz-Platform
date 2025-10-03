// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "student" | "teacher";
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: "student" | "teacher";
  token: string;
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: "student" | "teacher";
}

// Quiz Types
export interface Question {
  id: string;
  questionText: string;
  choices: string[];
  correctAnswer: number;
  points: number;
}

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  duration: number;
  questions: Question[];
  teacher: string | User;
  secretCode: string;
  isActive: boolean;
  scheduledFor: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuizData {
  title: string;
  description: string;
  duration: number;
  questions: Question[];
}

// Answer Types
export interface Answer {
  questionIndex: number;
  selectedAnswer: number;
  isCorrect: boolean;
  timeTaken: number;
}

export interface DetailedAnswer {
  questionIndex: number;
  selectedAnswer: number;
  isCorrect: boolean;
  timeTaken: number;
  questionText: string;
  choices: string[];
  points: number;
  correctAnswer: number;
}

// Response Types
export interface QuizResponse {
  _id: string;
  quiz: string | Quiz;
  student: string;
  answers: Answer[];
  detailedAnswers?: DetailedAnswer[];
  score: number;
  totalPoints: number;
  violations: number;
  startTime: string;
  endTime: string;
  status: "in-progress" | "completed" | "submitted";
  createdAt: string;
  updatedAt: string;
}

// Processed History Data
export interface ProcessedQuizHistory {
  id: string;
  quizId: string;
  title: string;
  teacher: string;
  date: string;
  score: number;
  maxScore: number;
  timeTaken: number;
  violations: number;
  questions: {
    qId: number;
    questionText: string;
    choices: string[];
    correctAnswer: number;
    userAnswer: number;
    points: number;
  }[];
}

// Dashboard Types
export interface StatItem {
  label: string;
  value: string;
  icon?: any;
  color?: string;
}

export interface RecentQuiz {
  id: string;
  title: string;
  date: string;
  students: number;
  avgScore: number;
  status: string;
  secretCode: string;
  isActive: boolean;
}

export interface DashboardStats {
  stats: StatItem[];
  recentQuizzes: RecentQuiz[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}

// Teacher Analytics Types
export interface QuizAnalytics {
  quiz: {
    id: string;
    title: string;
    totalQuestions: number;
    totalPoints: number;
    isActive: boolean;
  };
  summary: {
    totalStudents: number;
    avgScore: number;
    avgViolations: number;
  };
  students: Array<{
    name: string;
    email: string;
    score: number;
    violations: number;
    timeTaken: number;
    status: string;
  }>;
}

// Student Quiz Types
export interface StudentQuiz {
  _id: string;
  title: string;
  description: string;
  duration: number;
  teacher: {
    name: string;
    email?: string;
  };
  secretCode: string;
  isActive: boolean;
  questions: Question[];
}

// Quiz Status Types
export interface QuizStatus {
  isActive: boolean;
}

// Utility Types
export type Role = "student" | "teacher";

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form Data Types
export interface QuizFormData {
  title: string;
  description: string;
  duration: number;
  questions: Array<{
    questionText: string;
    choices: string[];
    correctAnswer: number;
    points: number;
  }>;
}

// Join Quiz Types
export interface JoinQuizData {
  secretCode: string;
}

export interface SubmitQuizData {
  answers: Array<{
    questionIndex: number;
    selectedAnswer: number;
    timeTaken: number;
  }>;
  violations?: number;
}

// Context Types
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: Role
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

// Toast Types
export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  action?: React.ReactNode;
}

// Component Props Types
export interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  choices: string[];
  points: number;
  isReview?: boolean;
  correctAnswer?: number;
  userAnswer?: number;
  onAnswerSelect?: (answerIndex: number) => void;
  selectedAnswer?: number;
  timeTaken?: number;
}

export interface QuizCardProps {
  quiz: {
    _id: string;
    title: string;
    description: string;
    duration: number;
    secretCode: string;
    isActive: boolean;
    createdAt: string;
    teacher?: {
      name: string;
    };
  };
  onToggleStatus?: (quizId: string, isActive: boolean) => void;
  onViewAnalytics?: (quizId: string) => void;
}

// API Error Types
export interface ApiError {
  response?: {
    status: number;
    data: {
      success: boolean;
      message: string;
      error?: string;
    };
  };
  message: string;
}
