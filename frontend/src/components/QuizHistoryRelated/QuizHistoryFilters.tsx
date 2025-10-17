import { motion } from "framer-motion";

interface QuizHistoryFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: "newest" | "oldest" | "highest" | "lowest";
  onSortChange: (value: "newest" | "oldest" | "highest" | "lowest") => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  currentItemsCount: number;
  totalItemsCount: number;
  className?: string;
}

export const QuizHistoryFilters: React.FC<QuizHistoryFiltersProps> = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  itemsPerPage,
  onItemsPerPageChange,
  currentItemsCount,
  totalItemsCount,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-slate-800/50 rounded-lg p-6 space-y-4 ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="md:col-span-2">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Search Quizzes
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search by quiz title or teacher name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Sort Dropdown */}
        <div>
          <label
            htmlFor="sort"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Sort By
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Score</option>
            <option value="lowest">Lowest Score</option>
          </select>
        </div>
      </div>

      {/* Items Per Page and Results Count */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <label
            htmlFor="itemsPerPage"
            className="text-sm font-medium text-slate-300"
          >
            Show:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>10</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-slate-400">
            Showing {currentItemsCount} of {totalItemsCount} quizzes
          </span>
        </div>

        {searchTerm && (
          <span className="text-sm text-slate-400">
            Found {totalItemsCount} results for "{searchTerm}"
          </span>
        )}
      </div>
    </motion.div>
  );
};