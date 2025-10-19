"use client";

import { motion } from "framer-motion";
import { AddTeacherForm } from "@/types/index";

interface AddTeacherDialogProps {
  isOpen: boolean;
  onClose: () => void;
  form: AddTeacherForm;
  onFormChange: (field: keyof AddTeacherForm, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function AddTeacherDialog({
  isOpen,
  onClose,
  form,
  onFormChange,
  onSubmit,
  loading,
}: AddTeacherDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800 rounded-2xl p-4 sm:p-6 w-full max-w-md border border-slate-700/50 mx-4"
      >
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
          Add New Teacher
        </h3>

        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            label="Full Name"
            type="text"
            value={form.name}
            onChange={(value) => onFormChange("name", value)}
            placeholder="Enter full name"
            required
          />

          <FormField
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) => onFormChange("email", value)}
            placeholder="teacher@sritcbe.ac.in"
            required
          />

          <FormField
            label="Password"
            type="password"
            value={form.password}
            onChange={(value) => onFormChange("password", value)}
            placeholder="Enter password"
            required
            minLength={6}
          />

          <FormField
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={(value) => onFormChange("confirmPassword", value)}
            placeholder="Confirm password"
            required
          />

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg font-semibold text-white hover:bg-slate-600/50 transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold text-white hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? "Adding..." : "Add Teacher"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  minLength?: number;
}

function FormField({
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
  minLength,
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>
      <input
        type={type}
        required={required}
        minLength={minLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
        placeholder={placeholder}
      />
    </div>
  );
}
