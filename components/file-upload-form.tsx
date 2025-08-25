'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { fileUploadFormSchema, type FileUploadForm } from '@/lib/schemas';
import { FileAudio, Loader2 } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { X } from 'lucide-react';

interface FileUploadFormProps {
  onSubmit: (data: FileUploadForm) => void;
  isLoading?: boolean;
}

export function FileUploadForm({ onSubmit, isLoading = false }: FileUploadFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<z.infer<typeof fileUploadFormSchema>>({
    resolver: zodResolver(fileUploadFormSchema),
    mode: 'onChange',
  });

  const selectedFile = watch('file')?.[0];

  const handleFormSubmit = (data: z.infer<typeof fileUploadFormSchema>) => {
    onSubmit({ file: data.file[0] });
  };

  const clearFile = () => {
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* File Upload Section */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <FileAudio className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
                Choose a file
              </span>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".webm,.m4a,.mp4,.wav,.mp3"
                disabled={isLoading}
                {...register('file')}
              />
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Supports WebM, M4A, MP4, WAV, MP3 files
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              ⚠️ Video files may not work in all deployment environments. For best results, use audio files.
            </p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {errors.file && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5" />
            <p className="text-red-800 dark:text-red-200">{errors.file?.message as string}</p>
          </div>
        </div>
      )}

      {/* Selected File Info */}
      {selectedFile && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type}
              </p>
            </div>
            <button
              type="button"
              onClick={clearFile}
              className="text-red-500 hover:text-red-700"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Upload Button */}
      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
              <Loader2 className="animate-spin w-5 h-5" />
            <span>Processing...</span>
          </>
        ) : (
          <span>Transcribe Audio</span>
        )}
      </button>
    </form>
  );
}
