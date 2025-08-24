'use client';

import { TranscriptionResult } from '@/lib/schemas';
import { Brain, Copy, Loader2 } from 'lucide-react';

interface TranscriptionResultsProps {
  result: TranscriptionResult;
  onAnalyze: () => void;
  isAnalyzing?: boolean;
}

export function TranscriptionResults({ result, onAnalyze, isAnalyzing = false }: TranscriptionResultsProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Transcription Results</h2>
      
      {/* Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Confidence</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {(result.confidence * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {formatDuration(result.metadata.duration)}
          </p>
        </div>
        
      </div>

      {/* Transcription Text */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transcription</h3>
          <button
            onClick={() => navigator.clipboard.writeText(result.transcription)}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center space-x-1"
          >
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </button>
        </div>
        <p className="text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap">
          {result.transcription}
        </p>
      </div>

      {/* AI Analysis Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              <span>Analyzing with AI...</span>
            </>
          ) : (
            <>
              <Brain className="w-5 h-5" />
              <span>Analyze Interview</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
