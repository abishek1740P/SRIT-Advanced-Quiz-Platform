import { motion } from "framer-motion";
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "destructive";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export function Button({
  children,
  onClick,
  icon: Icon,
  variant = "secondary",
  disabled = false,
  className = "",
  type = "button"
}: ButtonProps) {
  const baseStyles = "px-3 sm:px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-slate-700/50 border border-slate-600/50 hover:bg-slate-600/50 text-white",
    destructive: "bg-red-600 hover:bg-red-700 text-white"
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{children}</span>
    </motion.button>
  );
}