"use client";

import Link from "next/link";
import { LogOut, User, Lock, Menu, X, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Header() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Get dashboard link based on user role
  const getDashboardLink = () => {
    if (!user) return "/auth/login";

    switch (user.role) {
      case "teacher":
        return "/dashboard/teacher";
      case "student":
        return "/dashboard/student";
      default:
        return "/dashboard";
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 border border-blue-200">
              <img
                src="/srit_logo.jpg"
                alt="SRIT Logo"
                className="w-6 h-6 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <Link href="/" className="flex flex-col">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent cursor-pointer hover:opacity-90">
                  SecureQuiz
                </h1>
                <span className="text-xs text-slate-400 -mt-1">
                  SRIT Platform
                </span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Desktop User Info Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex items-center gap-4"
        >
          {user ? (
            <div className="flex items-center gap-4">
              {/* Dashboard Button */}
              <Link href={getDashboardLink()}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:text-white hover:bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm transition-all duration-200 flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>

              {/* User Info */}
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">
                    {user.name}
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-300 border-blue-500/30 backdrop-blur-sm"
                >
                  {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                </Badge>
              </div>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-slate-300 hover:text-white hover:bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className="text-slate-300 hover:text-white hover:bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm transition-all"
                >
                  Login
                </Button>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-slate-300 hover:text-white"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-slate-900/95 border-t border-slate-700/50 px-6 py-4 flex flex-col gap-4"
        >
          {user ? (
            <>
              {/* Dashboard Link for Mobile */}
              <Link
                href={getDashboardLink()}
                onClick={() => setMobileOpen(false)}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:text-white hover:bg-slate-800/50 w-full justify-start"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>

              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{user.name}</span>
                <Badge className="bg-blue-500/20 text-blue-300">
                  {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="text-slate-300 hover:text-white hover:bg-slate-800/50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-slate-800/50 w-full"
              >
                Login
              </Button>
            </Link>
          )}
        </motion.div>
      )}
    </header>
  );
}
