import { VoiceTransformation } from '../types/voice';
import ffmpeg from 'fluent-ffmpeg';
import axios from 'axios';
import { promisify } from 'util';
import { writeFile } from 'fs/promises';
import path from 'path';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';

export class TTSService {
  private readonly outputDir: string;
  private readonly VOICE_RSS_KEY = process.env.VOICERSS_API_KEY;
  // Free TTS API endpoints
  private readonly TTS_ENDPOINTS = {
    voiceRSS: 'https://api.voicerss.org/',
    googleTTS: 'https://translate.google.com/translate_tts'
  };

  constructor() {
    this.outputDir = path.join(__dirname, '../../temp');
  }

  async generateSpeech(
    text: string,
    outputPath: string,
    transformation: VoiceTransformation
  ): Promise<{ url: string }> {
    try {
      // Generate base audio using free TTS API
      const baseAudioPath = await this.generateBaseAudio(text);
      
      // Apply transformations
      const transformedAudioPath = await this.applyTransformations(
        baseAudioPath,
        transformation
      );

      // Upload to Cloudinary (you already have this setup)
      const cloudinaryUrl = await this.uploadToCloudinary(transformedAudioPath);

      return { url: cloudinaryUrl };
    } catch (error) {
      console.error('Speech generation error:', error);
      throw error;
    }
  }

  private async generateBaseAudio(text: string): Promise<string> {
    try {
      // First try VoiceRSS (better quality but limited requests)
      if (this.VOICE_RSS_KEY) {
        return await this.generateWithVoiceRSS(text);
      }
      // Fallback to Google TTS (unlimited but basic)
      return await this.generateWithGoogleTTS(text);
    } catch (error) {
      console.error('Base audio generation error:', error);
      throw error;
    }
  }

  private async generateWithVoiceRSS(text: string): Promise<string> {
    const params = new URLSearchParams({
      key: this.VOICE_RSS_KEY!,
      src: text,
      hl: 'en-us',
      v: '1',
      r: '0',
      c: 'mp3',
      f: '44khz_16bit_stereo'
    });

    const response = await axios({
      method: 'POST',
      url: this.TTS_ENDPOINTS.voiceRSS,
      data: params.toString(),
      responseType: 'stream'
    });

    const outputPath = path.join(this.outputDir, `${Date.now()}_base.mp3`);
    await pipeline(response.data, createWriteStream(outputPath));
    
    return outputPath;
  }

  private async generateWithGoogleTTS(text: string): Promise<string> {
    // Google TTS has a character limit, so we need to split long text
    const chunks = this.splitTextIntoChunks(text, 200);
    const outputPath = path.join(this.outputDir, `${Date.now()}_base.mp3`);
    
    for (const chunk of chunks) {
      const params = new URLSearchParams({
        ie: 'UTF-8',
        tl: 'en',
        q: chunk,
        client: 'tw-ob'
      });

      const response = await axios({
        method: 'GET',
        url: `${this.TTS_ENDPOINTS.googleTTS}?${params.toString()}`,
        responseType: 'stream'
      });

      await pipeline(response.data, createWriteStream(outputPath, { flags: 'a' }));
      // Add small pause between chunks
      await this.wait(100);
    }

    return outputPath;
  }

  private async applyTransformations(
    inputPath: string,
    transformation: VoiceTransformation
  ): Promise<string> {
    const outputPath = path.join(this.outputDir, `${Date.now()}_transformed.mp3`);
    
    return new Promise((resolve, reject) => {
      let command = ffmpeg(inputPath);

      // Apply pitch modification
      if (transformation.pitch) {
        command = command.audioFilters(`asetrate=44100*${1 + transformation.pitch/100}`);
      }

      // Apply speed modification
      if (transformation.speed) {
        command = command.audioFilters(`atempo=${transformation.speed}`);
      }

      // Apply volume adjustment
      if (transformation.volume) {
        command = command.audioFilters(`volume=${1 + transformation.volume/100}`);
      }

      // Apply emotional effects
      if (transformation.emotions) {
        command = this.applyEmotionalEffects(command, transformation.emotions);
      }

      // Apply voice characteristics
      if (transformation.characteristics) {
        command = this.applyVoiceCharacteristics(command, transformation.characteristics);
      }

      // Apply audio effects
      if (transformation.effects) {
        command = this.applyAudioEffects(command, transformation.effects);
      }

      command
        .toFormat('mp3')
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .save(outputPath);
    });
  }

  private applyEmotionalEffects(
    command: any,
    emotions: VoiceTransformation['emotions']
  ): any {
    if (!emotions) return command;

    // Find dominant emotion
    const dominantEmotion = Object.entries(emotions)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0];

    switch (dominantEmotion) {
      case 'happiness':
        // Slightly higher pitch, faster tempo
        command = command
          .audioFilters('asetrate=44100*1.1')
          .audioFilters('atempo=1.1');
        break;
      case 'sadness':
        // Lower pitch, slower tempo
        command = command
          .audioFilters('asetrate=44100*0.9')
          .audioFilters('atempo=0.9');
        break;
      case 'anger':
        // Add slight distortion and compression
        command = command
          .audioFilters('acompressor')
          .audioFilters('vibrato=f=4:d=0.2');
        break;
      case 'fear':
        // Add tremolo effect
        command = command
          .audioFilters('tremolo=f=6:d=0.3');
        break;
    }

    return command;
  }

  private applyVoiceCharacteristics(
    command: any,
    characteristics: VoiceTransformation['characteristics']
  ): any {
    if (!characteristics) return command;

    // Age modification
    if (characteristics.age) {
      const ageFactor = characteristics.age / 50; // normalize to 0-2 range
      command = command.audioFilters(`asetrate=44100*${ageFactor}`);
    }

    // Gender modification (pitch shifting)
    if (characteristics.gender) {
      const genderFactor = 1 + (characteristics.gender / 200); // subtle pitch shift
      command = command.audioFilters(`asetrate=44100*${genderFactor}`);
    }

    return command;
  }

  private applyAudioEffects(
    command: any,
    effects: VoiceTransformation['effects']
  ): any {
    if (!effects) return command;

    if (effects.reverb?.enabled) {
      command = command.audioFilters(
        `aecho=0.8:0.9:${effects.reverb.decay || 40}:0.5`
      );
    }

    if (effects.echo?.enabled) {
      command = command.audioFilters(
        `aecho=0.8:0.88:${effects.echo.delay || 60}:${effects.echo.feedback || 0.4}`
      );
    }

    if (effects.chorus?.enabled) {
      command = command.audioFilters(
        `chorus=0.5:0.9:50|60|40:0.4|0.32|0.3:0.25|0.4|0.3:2|2.3|1.3`
      );
    }

    return command;
  }

  private splitTextIntoChunks(text: string, maxLength: number): string[] {
    const words = text.split(' ');
    const chunks: string[] = [];
    let currentChunk = '';

    for (const word of words) {
      if ((currentChunk + ' ' + word).length <= maxLength) {
        currentChunk += (currentChunk ? ' ' : '') + word;
      } else {
        chunks.push(currentChunk);
        currentChunk = word;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks;
  }

  private async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async uploadToCloudinary(filePath: string): Promise<string> {
    // Your existing Cloudinary upload logic
    // This should already be implemented in your cloudinary.ts file
    const { uploadAudio } = await import('../lib/cloudinary');
    return uploadAudio(filePath);
  }
} 