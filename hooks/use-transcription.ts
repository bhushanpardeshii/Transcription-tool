import { useMutation } from '@tanstack/react-query';
import { transcribeResponseSchema, errorResponseSchema } from '@/lib/schemas';
import type { TranscribeResponse } from '@/lib/schemas';

interface TranscribeError extends Error {
  status?: number;
}

export const useTranscription = () => {
  return useMutation<TranscribeResponse, TranscribeError, File>({
    mutationFn: async (file: File): Promise<TranscribeResponse> => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorResult = errorResponseSchema.safeParse(data);
        const errorMessage = errorResult.success ? errorResult.data.error : 'Failed to transcribe';
        const error = new Error(errorMessage) as TranscribeError;
        error.status = response.status;
        throw error;
      }

      const result = transcribeResponseSchema.safeParse(data);
      if (!result.success) {
        throw new Error('Invalid response format from transcription API');
      }

      return result.data;
    },
    onError: (error) => {
      console.error('Transcription error:', error);
    },
  });
};
