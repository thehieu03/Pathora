export default function ToursLoading() {
  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen animate-pulse">
      <div className="h-16 bg-gray-100 dark:bg-slate-800" />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-10 w-1/3 rounded bg-gray-200 dark:bg-slate-700 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-72 rounded-xl bg-gray-100 dark:bg-slate-800"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
