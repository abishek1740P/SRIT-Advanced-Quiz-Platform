import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
}

export function Table({ headers, children, className = "" }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full min-w-[600px] ${className}`}>
        <thead>
          <tr className="border-b border-slate-700/50">
            {headers.map((header, index) => (
              <th
                key={index}
                className="text-left p-3 sm:p-4 font-semibold text-slate-300 text-sm sm:text-base"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

interface TableRowProps {
  children: ReactNode;
  index?: number;
  className?: string;
}

export function TableRow({ children, index = 0, className = "" }: TableRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className={`border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors ${className}`}
    >
      {children}
    </motion.tr>
  );
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export function TableCell({ children, className = "" }: TableCellProps) {
  return (
    <td className={`p-3 sm:p-4 ${className}`}>
      {children}
    </td>
  );
}