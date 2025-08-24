import { useMutation } from '@tanstack/react-query';
import { analyzeResponseSchema, errorResponseSchema } from '@/lib/schemas';
import type { AnalyzeResponse } from '@/lib/schemas';

interface AnalysisError extends Error {
  status?: number;
}

export const useAnalysis = () => {
  return useMutation<AnalyzeResponse, AnalysisError, string>({
    mutationFn: async (transcript: string): Promise<AnalyzeResponse> => {
      const response = await fetch('/api/analyze-perplexity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorResult = errorResponseSchema.safeParse(data);
        const errorMessage = errorResult.success ? errorResult.data.error : 'Failed to analyze transcript';
        const error = new Error(errorMessage) as AnalysisError;
        error.status = response.status;
        throw error;
      }

      const result = analyzeResponseSchema.safeParse(data);
      if (!result.success) {
        console.error('Analysis response validation failed:', result.error);
        throw new Error('Invalid response format from analysis API');
      }

      return result.data;
    },
    onError: (error) => {
      console.error('Analysis error:', error);
    },
  });
};
