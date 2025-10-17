import { useState, useEffect } from "react";
import { ProcessedQuizHistory } from "@/types";

export const useQuizHistoryFilters = (quizHistory: ProcessedQuizHistory[]) => {
  const [filteredHistory, setFilteredHistory] = useState<ProcessedQuizHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    filterAndSortHistory();
  }, [quizHistory, searchTerm, sortBy]);

  const filterAndSortHistory = () => {
    let filtered = quizHistory;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quiz.teacher.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
          );
        case "highest":
          return b.percentage - a.percentage;
        case "lowest":
          return a.percentage - b.percentage;
        default:
          return 0;
      }
    });

    setFilteredHistory(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = filteredHistory.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearSearch = () => setSearchTerm("");

  return {
    filteredHistory,
    paginatedHistory,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    itemsPerPage,
    setItemsPerPage,
    currentPage,
    totalPages,
    handlePageChange,
    clearSearch,
  };
};