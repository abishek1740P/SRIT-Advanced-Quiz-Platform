import { motion } from "framer-motion";

interface NoResultsProps {
  searchTerm: string;
  onClearSearch: () => void;
  className?: string;
}

export const NoResults: React.FC<NoResultsProps> = ({
  searchTerm,
  onClearSearch,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="text-slate-400 text-lg">
        No quizzes found matching your search criteria.
      </div>
      <button
        onClick={onClearSearch}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Clear Search
      </button>
    </motion.div>
  );
};