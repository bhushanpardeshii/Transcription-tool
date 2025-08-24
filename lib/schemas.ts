import { z } from 'zod';

// File upload schema for form validation
export const fileUploadFormSchema = z.object({
  file: z.any()
    .refine((files) => {
      // Check if it's a FileList or File object
      if (typeof FileList !== 'undefined' && files instanceof FileList) {
        return files.length > 0;
      }
      if (typeof File !== 'undefined' && files instanceof File) {
        return true;
      }
      return false;
    }, 'Please select a file')
    .refine(
      (files) => {
        const file = typeof FileList !== 'undefined' && files instanceof FileList ? files[0] : files;
        return file?.size <= 100 * 1024 * 1024; // 100MB
      },
      'File size must be less than 100MB'
    )
    .refine(
      (files) => {
        const file = typeof FileList !== 'undefined' && files instanceof FileList ? files[0] : files;
        const supportedTypes = [
          'audio/webm',
          'video/webm', 
          'audio/m4a',
          'video/mp4',
          'audio/wav',
          'audio/mp3'
        ];
        return supportedTypes.includes(file?.type || '');
      },
      'File type not supported. Please upload WebM, M4A, MP4, WAV, or MP3 files'
    ),
});

// Transcription result schema
export const transcriptionResultSchema = z.object({
  transcription: z.string(),
  confidence: z.number(),
  metadata: z.object({
    duration: z.number(),
    channels: z.number(),
  }),
});

// Analysis result schema
export const analysisResultSchema = z.object({
  summary: z.string(),
  interview_type: z.string(),
  overall_sentiment: z.string(),
  interview_flow_score: z.number(),
  interviewee_feedback: z.object({
    what_went_well: z.array(z.string()),
    areas_for_improvement: z.array(z.string()),
    actionable_tips: z.array(z.string()),
    confidence_level: z.string(),
  }),
  recruiter_feedback: z.object({
    areas_missed: z.array(z.string()),
    questions_not_asked: z.array(z.string()),
    missed_red_flags: z.array(z.string()),
  }),
  key_topics_discussed: z.array(z.string()),
  improvement_recommendations: z.object({
    for_next_interview: z.array(z.string()),
    long_term_development: z.array(z.string()),
  }),
  raw_feedback: z.string().optional(),
});

// API response schemas
export const transcribeResponseSchema = z.object({
  success: z.boolean(),
  transcription: z.string(),
  confidence: z.number(),
  metadata: z.object({
    duration: z.number(),
    channels: z.number(),
  }),
});

export const analyzeResponseSchema = z.object({
  success: z.boolean(),
  analysis: analysisResultSchema,
  metadata: z.object({
    transcript_length: z.number(),
    analysis_timestamp: z.string(),
    model_used: z.string(),
  }),
});

// Error response schema
export const errorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

// Type exports
export type FileUploadForm = { file: File };
export type TranscriptionResult = z.infer<typeof transcriptionResultSchema>;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;
export type TranscribeResponse = z.infer<typeof transcribeResponseSchema>;
export type AnalyzeResponse = z.infer<typeof analyzeResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
