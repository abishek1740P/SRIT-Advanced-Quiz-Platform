import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export function Card({ children, className = "", animate = true }: CardProps) {
  const Component = animate ? motion.div : "div";
  
  return (
    <Component
      {...(animate && {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
      })}
      className={`bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 ${className}`}
    >
      {children}
    </Component>
  );
}