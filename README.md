# Audio & Video Transcription App

A Next.js web application that accepts audio or video recordings and converts speech to text using Deepgram's AI-powered transcription service.

## Features

- 🎵 **Audio Support**: WebM, M4A, WAV, MP3 formats
- 🎬 **Video Support**: WebM, MP4 formats (automatically converts to audio)
- 🚀 **Fast Processing**: Uses FFmpeg for efficient video-to-audio conversion
- 🎯 **Accurate Transcription**: Powered by Deepgram's Nova-2 model
- 📊 **Detailed Results**: Shows confidence scores, duration, and channel information
- 🌙 **Dark Mode**: Beautiful UI with dark/light mode support
- 📋 **Copy to Clipboard**: Easy copying of transcription results

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Audio Processing**: fluent-ffmpeg, ffmpeg-static
- **Speech-to-Text**: Deepgram SDK
- **File Handling**: Native FormData API

## Prerequisites

- Node.js 18+ 
- Deepgram API Key ([Get one here](https://console.deepgram.com/))

## Setup Instructions

1. **Clone and Install**
   ```bash
   cd skitreai
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Deepgram API key:
   ```
   DEEPGRAM_API_KEY=your_actual_api_key_here
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How It Works

1. **File Upload**: Users can drag & drop or select audio/video files
2. **Format Detection**: App automatically detects file type and format
3. **Video Conversion**: If video file, converts to audio using FFmpeg
4. **Speech Processing**: Sends audio to Deepgram for transcription
5. **Results Display**: Shows transcription with confidence scores and metadata

## Supported File Types

- **Audio**: `.webm`, `.m4a`, `.wav`, `.mp3`
- **Video**: `.webm`, `.mp4` (converted to audio automatically)

## API Endpoints

### POST `/api/transcribe`

Uploads and transcribes audio/video files.

**Request**: FormData with `file` field
**Response**:
```json
{
  "success": true,
  "transcription": "Your transcribed text here...",
  "confidence": 0.95,
  "metadata": {
    "duration": 30.5,
    "channels": 1
  }
}
```

## Error Handling

The application includes comprehensive error handling for:
- Unsupported file types
- Missing API keys
- FFmpeg conversion failures
- Deepgram API errors
- Network issues

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add `DEEPGRAM_API_KEY` environment variable
4. Deploy

### Other Platforms

Ensure your deployment platform supports:
- Node.js 18+
- FFmpeg binary execution
- File system write access for temporary files

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
