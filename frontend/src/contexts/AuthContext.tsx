"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "@/lib/api";
import { User, AuthResponse } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: "student" | "teacher"
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      // Verify token with backend
      const response = await authAPI.getMe();
      if (response.data.success) {
        setUser(response.data.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("quiz_user");
    } finally {
      setLoading(false);
    }
  };

  // Remove redirect logic from login/register - let components handle it
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      if (!email.endsWith("@sritcbe.ac.in")) {
        throw new Error("Only @sritcbe.ac.in emails are allowed");
      }

      // Use real API call
      const response = await authAPI.login({ email, password });

      if (response.data.success) {
        const { token, ...userData } = response.data.data;

        setUser(userData);
        localStorage.setItem("token", token);
        localStorage.setItem("quiz_user", JSON.stringify(userData));

        // Return success - let the component handle redirect
        return;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(
        error.response?.data?.message || error.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role?: "student" | "teacher" | "admin"
  ) => {
    try {
      setLoading(true);

      if (!email.endsWith("@sritcbe.ac.in")) {
        throw new Error("Only @sritcbe.ac.in emails are allowed");
      }

      // Determine role based on email or use provided role
      const userRole: "student" | "teacher" | "admin" =
        role || (email.includes("teacher") ? "teacher" : "student");

      // Use real API call
      const response = await authAPI.register({
        name,
        email,
        password,
        role: userRole,
      });

      if (response.data.success) {
        const { token, ...userData } = response.data.data;

        setUser(userData);
        localStorage.setItem("token", token);
        localStorage.setItem("quiz_user", JSON.stringify(userData));

        // Return success - let the component handle redirect
        return;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      throw new Error(
        error.response?.data?.message || error.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setLoading(false);
    localStorage.removeItem("token");
    localStorage.removeItem("quiz_user");
    window.location.href = "/auth/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
