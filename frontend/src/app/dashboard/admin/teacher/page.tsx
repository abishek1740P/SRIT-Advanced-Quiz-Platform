"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { adminAPI } from "@/lib/api";
import { Teacher, AddTeacherForm } from "@/types/index";
import TeacherHeader from "@/components/dashboard/admin/teacher/TeacherHeader";
import TeacherFilters from "@/components/dashboard/admin/teacher/TeacherFilters";
import TeacherTable from "@/components/dashboard/admin/teacher/TeacherTable";
import Pagination from "@/components/dashboard/admin/teacher/Pagination";
import AddTeacherDialog from "@/components/dashboard/admin/teacher/AddTeacherDialog";

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddTeacherDialog, setShowAddTeacherDialog] = useState(false);
  const [addTeacherForm, setAddTeacherForm] = useState<AddTeacherForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [addingTeacher, setAddingTeacher] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const { toast } = useToast();

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTeachers = filteredTeachers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers("teachers");

      if (response.data.success) {
        const teacherUsers = response.data.data.filter(
          (user: any) => user.role === "teacher"
        ) as Teacher[];
        setTeachers(teacherUsers);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to fetch teachers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();

    if (addTeacherForm.password !== addTeacherForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      setAddingTeacher(true);
      const response = await adminAPI.addTeacher({
        name: addTeacherForm.name,
        email: addTeacherForm.email,
        password: addTeacherForm.password,
      });

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Teacher added successfully",
        });
        setShowAddTeacherDialog(false);
        setAddTeacherForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        fetchTeachers();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add teacher",
        variant: "destructive",
      });
    } finally {
      setAddingTeacher(false);
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;

    try {
      const response = await adminAPI.deleteUser(teacherId);

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Teacher deleted successfully",
        });
        fetchTeachers();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete teacher",
        variant: "destructive",
      });
    }
  };

  const handleBulkUpload = async () => {
    if (!csvFile) {
      toast({
        title: "Error",
        description: "Please select a CSV file",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", csvFile);

      const response = await adminAPI.bulkUploadTeachers(formData);

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Teachers uploaded successfully",
        });
        setCsvFile(null);
        fetchTeachers();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to upload teachers",
        variant: "destructive",
      });
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await adminAPI.downloadUsers("teachers");

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `teachers_${new Date().toISOString().split("T")[0]}.csv`;
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

  const handleFormChange = (field: keyof AddTeacherForm, value: string) => {
    setAddTeacherForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <TeacherHeader
            onAddTeacher={() => setShowAddTeacherDialog(true)}
            onDownloadCSV={handleDownloadCSV}
            onFileSelect={setCsvFile}
            csvFile={csvFile}
            onBulkUpload={handleBulkUpload}
          />

          <TeacherFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={(value) => {
              setItemsPerPage(value);
              setCurrentPage(1);
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden"
          >
            <TeacherTable
              teachers={paginatedTeachers}
              loading={loading}
              onDeleteTeacher={handleDeleteTeacher}
            />
          </motion.div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredTeachers.length}
              onPageChange={setCurrentPage}
            />
          )}

          <AddTeacherDialog
            isOpen={showAddTeacherDialog}
            onClose={() => setShowAddTeacherDialog(false)}
            form={addTeacherForm}
            onFormChange={handleFormChange}
            onSubmit={handleAddTeacher}
            loading={addingTeacher}
          />
        </div>
      </div>
    </div>
  );
}
