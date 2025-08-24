# Audio & Video Interview Analysis App

A Next.js web application that accepts audio or video recordings and converts speech to text using Deepgram's AI-powered transcription service and analyzes interview with AI.

## Features

-  **Audio Support**: WebM, M4A, WAV, MP3 formats
-  **Video Support**: WebM, MP4 formats (automatically converts to audio)
-  **Fast Processing**: Uses FFmpeg for efficient video-to-audio conversion
-  **Accurate Transcription**: Powered by Deepgram's Nova-2 model
-  **Detailed Results**: Shows confidence scores, duration and AI analysis
-  **Copy to Clipboard**: Easy copying of transcription results

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Audio Processing**: fluent-ffmpeg, ffmpeg-static
- **Speech-to-Text**: Deepgram SDK
- **AI model**:Sonar pro

## How It Works

1. **File Upload**: Users can drag & drop or select audio/video files
2. **Format Detection**: App automatically detects file type and format
3. **Video Conversion**: If video file, converts to audio using FFmpeg
4. **Speech Processing**: Sends audio to Deepgram for transcription
5. **Results Display**: Shows transcription with confidence scores,metadata and AI analysis 


## Supported File Types

- **Audio**: `.webm`, `.m4a`, `.wav`, `.mp3`
- **Video**: `.webm`, `.mp4` (converted to audio automatically)
