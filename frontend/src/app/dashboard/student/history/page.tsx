"use client";

import { useRouter } from "next/navigation";
import { useQuizHistory } from "@/hooks/useQuizHistory";
import { useQuizHistoryFilters } from "@/hooks/useQuizHistoryFilters";
import { QuizHistoryHeader } from "@/components/QuizHistoryHeader";
import { QuizHistoryFilters } from "@/components/QuizHistoryRelated/QuizHistoryFilters";
import { QuizHistoryList } from "@/components/QuizHistoryRelated/QuizHistoryList";
import { Pagination } from "@/components/QuizHistoryRelated/Pagination";
import { NoResults } from "@/components/QuizHistoryRelated/NoResults";
import { EmptyQuizHistory } from "@/components/EmptyQuizHistory";
import { LoadingState } from "@/components/Common/LoadingState";
import { BackgroundElements } from "@/components/Common/BackgroundElements";
import { ProcessedQuizHistory } from "@/types";

export default function StudentHistoryPage() {
  const router = useRouter();
  const { quizHistory, loading } = useQuizHistory();
  const {
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
  } = useQuizHistoryFilters(quizHistory);

  const handleBack = () => router.push("/dashboard/student");
  const handleReview = (quiz: ProcessedQuizHistory) => {
    // Handle review logic
    console.log("Review quiz:", quiz);
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      <BackgroundElements />

      <div className="relative z-10 mx-auto max-w-6xl p-6 space-y-8">
        <QuizHistoryHeader onBack={handleBack} />

        {/* Search and Filter Controls */}
        <QuizHistoryFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          currentItemsCount={paginatedHistory.length}
          totalItemsCount={filteredHistory.length}
        />

        {/* Quiz History List */}
        <QuizHistoryList quizzes={paginatedHistory} onReview={handleReview} />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-8"
        />

        {/* Empty State */}
        {quizHistory.length === 0 && <EmptyQuizHistory onAction={handleBack} />}

        {/* No Results State */}
        {quizHistory.length > 0 && filteredHistory.length === 0 && (
          <NoResults searchTerm={searchTerm} onClearSearch={clearSearch} />
        )}
      </div>
    </div>
  );
}
