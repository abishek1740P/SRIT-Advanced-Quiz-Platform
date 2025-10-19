"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { adminAPI } from "@/lib/api";
import {
  Card,
  Button,
  SearchInput,
  Select,
  Table,
  TableRow,
  TableCell,
  Pagination,
  LoadingState,
  EmptyState,
  UserAvatar,
} from "@/components/dashboard/admin/student/index";
import { Download } from "lucide-react";

interface Student {
  _id: string;
  name: string;
  email: string;
  role: "student";
  createdAt: string;
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers("students");

      if (response.data.success) {
        const studentUsers = response.data.data.filter(
          (user: any) => user.role === "student"
        ) as Student[];
        setStudents(studentUsers);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to fetch students",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await adminAPI.downloadUsers("students");

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `students_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "CSV downloaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to download CSV",
        variant: "destructive",
      });
    }
  };

  const tableHeaders = ["Name", "Email", "Joined Date"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/admin"
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-300" />
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Student Management
                </h1>
                <p className="text-slate-300 text-sm sm:text-base">
                  View and manage students
                </p>
              </div>
            </div>

            <Button onClick={handleDownloadCSV} icon={Download}>
              Download CSV
            </Button>
          </div>

          {/* Search and Filters */}
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search students by name or email..."
                className="flex-1"
              />

              <Select
                value={itemsPerPage}
                onChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
                options={[
                  { value: 50, label: "50 per page" },
                  { value: 100, label: "100 per page" },
                  { value: 150, label: "150 per page" },
                  { value: 200, label: "200 per page" },
                ]}
              />
            </div>
          </Card>

          {/* Data Table */}
          <Card>
            {loading ? (
              <LoadingState message="Loading students..." />
            ) : (
              <>
                <Table headers={tableHeaders}>
                  {paginatedStudents.map((student, index) => (
                    <TableRow key={student._id} index={index}>
                      <TableCell>
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <UserAvatar name={student.name} />
                          <span className="font-medium text-white text-sm sm:text-base truncate">
                            {student.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300 text-sm sm:text-base truncate">
                        {student.email}
                      </TableCell>
                      <TableCell className="text-slate-300 text-sm sm:text-base">
                        {new Date(student.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </Table>

                {paginatedStudents.length === 0 && (
                  <EmptyState
                    title="No students found"
                    description={
                      searchTerm ? "Try adjusting your search terms" : undefined
                    }
                  />
                )}
              </>
            )}
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredStudents.length}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
