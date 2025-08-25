import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@deepgram/sdk';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { writeFile, unlink, readFile, access } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { constants } from 'fs';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// FFmpeg binary setup with multiple fallback strategies
let ffmpegPath: string | null = null;

function setupFFmpeg() {
  console.log('Setting up FFmpeg...');
  console.log('FFmpeg static path from package:', ffmpegStatic);
  
  // Strategy 1: Use ffmpeg-static package path
  if (ffmpegStatic) {
    try {
      fs.accessSync(ffmpegStatic, constants.F_OK);
      ffmpegPath = ffmpegStatic;
      ffmpeg.setFfmpegPath(ffmpegStatic);
        console.log(' FFmpeg binary found and validated at:', ffmpegStatic);
      return true;
    } catch {
      console.warn(' FFmpeg binary not accessible at static path:', ffmpegStatic);
    }
  }
  
  // Strategy 2: Try to resolve the path manually
  try {
    const alternativePath = path.join(process.cwd(), 'node_modules', 'ffmpeg-static', 'ffmpeg.exe');
    fs.accessSync(alternativePath, constants.F_OK);
    ffmpegPath = alternativePath;
    ffmpeg.setFfmpegPath(alternativePath);
    console.log(' FFmpeg binary found at alternative path:', alternativePath);
    return true;
  } catch {
    console.warn(' FFmpeg binary not found at alternative path');
  }
  
  // Strategy 3: Try system FFmpeg (if available)
  try {
    const systemFfmpeg = execSync('where ffmpeg', { encoding: 'utf8' }).trim();
    if (systemFfmpeg) {
      ffmpegPath = systemFfmpeg;
      ffmpeg.setFfmpegPath(systemFfmpeg);
      console.log(' Using system FFmpeg at:', systemFfmpeg);
      return true;
    }
  } catch {
    console.warn(' System FFmpeg not found');
  }
  
  console.error(' No working FFmpeg binary found');
  return false;
}

// Initialize FFmpeg setup
const ffmpegAvailable = setupFFmpeg();

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables first
    if (!process.env.DEEPGRAM_API_KEY) {
      console.error('DEEPGRAM_API_KEY environment variable is not set');
      return NextResponse.json({ 
        error: 'Server configuration error: Missing API key' 
      }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Log file information for debugging
    console.log(`Processing file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);

    // Check if file type is supported
    const supportedTypes = ['audio/webm', 'video/webm', 'audio/m4a', 'video/mp4', 'audio/wav', 'audio/mp3'];
    if (!supportedTypes.includes(file.type)) {
      console.error(`Unsupported file type: ${file.type}`);
      return NextResponse.json({ 
        error: `Unsupported file type: ${file.type}. Supported types: ${supportedTypes.join(', ')}` 
      }, { status: 400 });
    }

    // Check file size (limit to 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      console.error(`File too large: ${file.size} bytes (max: ${maxSize} bytes)`);
      return NextResponse.json({ 
        error: `File too large. Maximum size is ${maxSize / 1024 / 1024}MB` 
      }, { status: 400 });
    }

    // Create temporary file paths
    const tempDir = tmpdir();
    const inputPath = join(tempDir, `input_${Date.now()}_${file.name}`);
    const outputPath = join(tempDir, `output_${Date.now()}.wav`);

    try {
      // Save uploaded file to temporary location
      console.log(`Saving uploaded file to: ${inputPath}`);
      const bytes = await file.arrayBuffer();
      await writeFile(inputPath, Buffer.from(bytes));
      console.log(`File saved successfully, size: ${bytes.byteLength} bytes`);

      let audioPath = inputPath;
      const filesToCleanup = [inputPath];

      // Convert video to audio if necessary
      if (file.type.startsWith('video/')) {
        if (!ffmpegAvailable || !ffmpegPath) {
          console.error('FFmpeg not available in deployment environment');
          return NextResponse.json({ 
            error: 'Video processing not supported in deployment environment', 
            details: 'Please upload audio files (.webm, .m4a, .wav, .mp3) instead of video files. Video processing requires FFmpeg which is not available on this deployment platform.',
            supportedFormats: ['audio/webm', 'audio/m4a', 'audio/wav', 'audio/mp3']
          }, { status: 400 });
        }
        
        console.log(`Converting video to audio: ${inputPath} -> ${outputPath}`);
        console.log(`Using FFmpeg binary: ${ffmpegPath}`);
        
        try {
          await convertVideoToAudio(inputPath, outputPath);
          
          // Verify conversion was successful
          await access(outputPath, constants.F_OK);
          console.log('Video conversion successful, output file exists');
          audioPath = outputPath;
          filesToCleanup.push(outputPath);
        } catch (conversionError) {
          console.error('Video conversion failed:', conversionError);
          return NextResponse.json({ 
            error: 'Video conversion failed', 
            details: 'Unable to convert video to audio. Please try uploading an audio file instead (.webm, .m4a, .wav, .mp3).',
            supportedFormats: ['audio/webm', 'audio/m4a', 'audio/wav', 'audio/mp3']
          }, { status: 400 });
        }
      }

      // Transcribe audio using Deepgram
      console.log(`Starting transcription for: ${audioPath}`);
      const transcription = await transcribeAudio(audioPath);
      console.log('Transcription completed successfully');

      // Clean up temporary files
      await cleanupFiles(filesToCleanup);

      return NextResponse.json({ 
        success: true, 
        transcription: transcription.results.channels[0].alternatives[0].transcript,
        confidence: transcription.results.channels[0].alternatives[0].confidence,
        metadata: {
          duration: transcription.metadata.duration,
          channels: transcription.metadata.channels
        }
      });

    } catch (error) {
      // Clean up files in case of error
      console.error('Error during processing:', error);
      await cleanupFiles([inputPath, outputPath]);
      throw error;
    }

  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json({ 
      error: 'Failed to process file', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function convertVideoToAudio(inputPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('Starting FFmpeg conversion...');
    console.log('Input path:', inputPath);
    console.log('Output path:', outputPath);
    console.log('FFmpeg binary path:', ffmpegPath);
    
    // Ensure we're using the correct FFmpeg path
    if (ffmpegPath) {
      ffmpeg.setFfmpegPath(ffmpegPath);
    }
    
    const command = ffmpeg(inputPath)
      .toFormat('wav')
      .audioCodec('pcm_s16le')
      .audioChannels(1)
      .audioFrequency(16000)
      .outputOptions([
        '-y', // Overwrite output file if it exists
      ])
      .on('start', (commandLine) => {
        console.log('FFmpeg command executed:', commandLine);
      })
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`FFmpeg progress: ${Math.round(progress.percent)}%`);
        }
      })
      .on('end', () => {
        console.log(' Video to audio conversion completed successfully');
        resolve();
      })
      .on('error', (err, stdout, stderr) => {
        console.error('FFmpeg conversion failed');
        console.error('Error message:', err.message);
        console.error('Error code:', (err as Error & { code?: string }).code);
        console.error('FFmpeg path used:', ffmpegPath);
        
        if (stdout) console.error('FFmpeg stdout:', stdout);
        if (stderr) console.error('FFmpeg stderr:', stderr);
        
        // Provide specific error messages based on the error type
        if (err.message.includes('ENOENT')) {
          reject(new Error(`FFmpeg binary not found at: ${ffmpegPath}. Please check the installation.`));
        } else if (err.message.includes('spawn')) {
          reject(new Error(`Cannot execute FFmpeg binary at: ${ffmpegPath}. Check permissions and path.`));
        } else if (err.message.includes('Invalid data found')) {
          reject(new Error('Invalid video format. Please upload a valid video file.'));
        } else {
          reject(new Error(`Video conversion failed: ${err.message}`));
        }
      });
      
    // Start the conversion
    command.save(outputPath);
  });
}

async function transcribeAudio(audioPath: string) {
  if (!process.env.DEEPGRAM_API_KEY) {
    throw new Error('DEEPGRAM_API_KEY environment variable is not set');
  }

  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
  
  try {
    console.log(`Reading audio file for transcription: ${audioPath}`);
    
    // Read the audio file as buffer for Deepgram
    const audioBuffer = await readFile(audioPath);
    console.log(`Audio buffer size: ${audioBuffer.length} bytes`);

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        model: 'nova-2',
        language: 'en-US',
        smart_format: true,
        punctuate: true,
        diarize: true,
      }
    );

    if (error) {
      console.error('Deepgram API error:', error);
      throw new Error(`Deepgram transcription failed: ${error.message}`);
    }

    if (!result || !result.results || !result.results.channels || result.results.channels.length === 0) {
      throw new Error('Deepgram returned empty or invalid results');
    }

    console.log('Deepgram transcription successful');
    return result;
    
  } catch (error) {
    console.error('Error in transcribeAudio:', error);
    throw error;
  }
}

async function cleanupFiles(paths: string[]) {
  console.log(`Cleaning up ${paths.length} temporary files...`);
  
  for (const path of paths) {
    try {
      // Check if file exists before trying to delete
      await access(path, constants.F_OK);
      await unlink(path);
      console.log(`Successfully cleaned up: ${path}`);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        console.log(`File already deleted or never existed: ${path}`);
      } else {
        console.warn(`Failed to cleanup file ${path}:`, error instanceof Error ? error.message : String(error));
      }
    }
  }
}
