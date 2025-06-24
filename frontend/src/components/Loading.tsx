export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative">
        <div className="h-16 w-16 animate-spin">
          <div className="absolute h-full w-full rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
          <div className="absolute h-full w-full rounded-full border-4 border-blue-500 dark:border-blue-400 border-t-transparent animate-spin"></div>
        </div>
      </div>
    </div>
  );
} 