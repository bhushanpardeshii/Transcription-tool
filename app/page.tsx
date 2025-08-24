'use client';

import { FileUploadForm } from '@/components/file-upload-form';
import { TranscriptionResults } from '@/components/transcription-results';
import { AnalysisResults } from '@/components/analysis-results';
import { ErrorDisplay } from '@/components/error-display';
import { useTranscription } from '@/hooks/use-transcription';
import { useAnalysis } from '@/hooks/use-analysis';
import { FileUploadForm as FileUploadFormType } from '@/lib/schemas';

export default function Home() {
  const transcriptionMutation = useTranscription();
  const analysisMutation = useAnalysis();

  const handleFileUpload = (data: FileUploadFormType) => {
    transcriptionMutation.mutate(data.file);
  };

  const handleAnalyze = () => {
    if (transcriptionMutation.data?.transcription) {
      analysisMutation.mutate(transcriptionMutation.data.transcription);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Audio & Video Transcription
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Upload audio or video files and get accurate speech-to-text transcriptions
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-8">
            <FileUploadForm 
              onSubmit={handleFileUpload}
              isLoading={transcriptionMutation.isPending}
            />
          </div>

          {/* Transcription Error Display */}
          {transcriptionMutation.error && (
            <ErrorDisplay error={transcriptionMutation.error.message} />
          )}

          {/* Transcription Results */}
          {transcriptionMutation.data && (
            <TranscriptionResults
              result={{
                transcription: transcriptionMutation.data.transcription,
                confidence: transcriptionMutation.data.confidence,
                metadata: transcriptionMutation.data.metadata
              }}
              onAnalyze={handleAnalyze}
              isAnalyzing={analysisMutation.isPending}
            />
          )}

          {/* Analysis Error Display */}
          {analysisMutation.error && (
            <ErrorDisplay error={analysisMutation.error.message} />
          )}

          {/* Analysis Results */}
          {analysisMutation.data && (
            <AnalysisResults analysis={analysisMutation.data.analysis} />
          )}
        </div>
      </div>
    </div>
  );
}