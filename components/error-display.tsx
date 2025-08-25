'use client';

interface ErrorDisplayProps {
  error: string;
  details?: string;
  supportedFormats?: string[];
}

export function ErrorDisplay({ error, details, supportedFormats }: ErrorDisplayProps) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
      <div className="flex">
        <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
          {details && (
            <p className="text-red-700 dark:text-red-300 text-sm mt-1">{details}</p>
          )}
          {supportedFormats && (
            <div className="mt-2">
              <p className="text-red-700 dark:text-red-300 text-sm font-medium">Supported formats:</p>
              <p className="text-red-600 dark:text-red-400 text-sm">
                {supportedFormats.join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
