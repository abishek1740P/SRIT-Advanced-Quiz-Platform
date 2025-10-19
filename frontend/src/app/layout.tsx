// frontend\src\app\layout.tsx
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Browser Icon */}
        <link rel="icon" href="/ideas.png" type="image/png" />

        {/* Browser Theme Color */}
        <meta name="theme-color" content="#182539" />

        {/* Optional: SEO title */}
        <title>SRIT Quiz Platform</title>
      </head>
      <body className="bg-white text-gray-900 min-h-screen flex flex-col antialiased">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
