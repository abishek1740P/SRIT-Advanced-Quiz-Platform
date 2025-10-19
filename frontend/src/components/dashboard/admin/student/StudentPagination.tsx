interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  className = ""
}: PaginationProps) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 ${className}`}>
      <div className="text-slate-400 text-sm text-center sm:text-left">
        Showing {startIndex + 1} to {endIndex} of {totalItems} items
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 sm:px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600/50 transition-colors text-sm"
        >
          Previous
        </button>
        <span className="px-3 sm:px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 sm:px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600/50 transition-colors text-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
}