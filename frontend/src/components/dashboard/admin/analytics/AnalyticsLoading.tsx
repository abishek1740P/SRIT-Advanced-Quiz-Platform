// frontend/src/app/dashboard/admin/analytics/components/AnalyticsLoading.tsx
export default function AnalyticsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-64 mb-2"></div>
          <div className="h-4 bg-slate-700 rounded w-96 mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
                <div className="h-6 bg-slate-700 rounded w-32 mb-2"></div>
                <div className="h-8 bg-slate-700 rounded w-20 mb-4"></div>
                <div className="h-4 bg-slate-700 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}