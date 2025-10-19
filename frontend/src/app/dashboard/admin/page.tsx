"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { adminAPI, authAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  LoadingState,
  AccessDenied,
  BackgroundElements,
} from "@/components/Common";
import { DashboardHeader } from "@/components/dashboard/admin/AdminDashboardHeader";
import { DashboardGrid } from "@/components/dashboard/admin/AdminDashboardGrid";
import { StatsOverview } from "@/components/dashboard/admin/AdminStatsOverview";
import { AdditionalStats } from "@/components/dashboard/admin/AdminAdditionalStats";

interface DashboardStats {
  totalTeachers: number;
  totalStudents: number;
  totalQuizzes: number;
  activeQuizzes: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalTeachers: 0,
    totalStudents: 0,
    totalQuizzes: 0,
    activeQuizzes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !user) {
        router.push("/auth/login");
        return;
      }

      await authAPI.getMe();
      setAuthChecked(true);
      fetchDashboardStats();
    } catch (error) {
      toast({
        title: "Session Expired",
        description: "Please log in again",
        variant: "destructive",
      });
      logout();
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch dashboard stats:", error);

      if (error.response?.status === 401) {
        toast({
          title: "Session Expired",
          description: "Please log in again",
          variant: "destructive",
        });
        logout();
        return;
      }

      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to fetch dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardStats();
  };

  const handleRedirectToRoleDashboard = () => {
    if (user?.role === "teacher") {
      router.push("/dashboard/teacher");
    } else if (user?.role === "student") {
      router.push("/dashboard/student");
    } else {
      router.push("/auth/login");
    }
  };

  if (!authChecked || loading) {
    return <LoadingState message="Loading Admin Dashboard..." />;
  }

  if (user?.role !== "admin") {
    return (
      <AccessDenied
        userRole={user?.role}
        onRedirect={handleRedirectToRoleDashboard}
        requiredRole="admin"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <BackgroundElements />

      <div className="p-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader
            title="Admin Dashboard"
            subtitle="Manage your educational institution"
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />

          <DashboardGrid />

          <StatsOverview stats={stats} loading={loading} />

          <AdditionalStats stats={stats} loading={loading} />
        </div>
      </div>
    </div>
  );
}
