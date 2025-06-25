import { AudioMetadata, AudioTransformation, UploadedFile, AudioUploadResponse } from '../types/audio';
import { uploadAudio, transformAudio, deleteAudio } from '../lib/cloudinary';
import { createDocument, updateDocument, deleteDocument, collections } from '../lib/firebase';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../utils/errors';
import { VoiceTransformation, AudioFile } from '../types/voice';
import { firestore } from '../config/firebase';
import { TTSService } from './ttsService';
import { v4 as uuidv4 } from 'uuid';
import { VoiceProcessingService } from './voiceProcessingService';
import { VoiceCacheService } from './voiceCacheService';

export class AudioService {
  private readonly collection = collections.audioFiles;
  private ttsService: TTSService;
  private voiceProcessor: VoiceProcessingService;
  private cacheService: VoiceCacheService;

  constructor() {
    this.ttsService = new TTSService();
    this.voiceProcessor = new VoiceProcessingService();
    this.cacheService = new VoiceCacheService();
  }

  async generateAudio(text: string, voice: string, settings: any) {
    if (!text || !voice) {
      throw new BadRequestError('Text and voice are required');
    }

    // Check cache first
    const cachedAudio = await this.cacheService.getFromCache(text, voice, settings);
    if (cachedAudio) {
      return cachedAudio;
    }

    // Generate new audio
    const audio = await this.voiceProcessor.generateAudio(text, voice, settings);

    // Cache the result
    await this.cacheService.cacheAudio(text, voice, settings, audio);

    return audio;
  }

  async uploadAudio(file: UploadedFile, userId: string): Promise<AudioFile> {
    try {
      const audioId = uuidv4();
      
      // Upload to cloud storage and get URL
      // This is a placeholder - implement actual cloud storage upload
      const url = `https://storage.example.com/${audioId}`;

      const audioFile: AudioFile = {
        id: audioId,
        userId,
        url,
        name: file.filename,
        format: file.mimetype.split('/')[1],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await firestore.collection('audioFiles').doc(audioId).set(audioFile);

      return audioFile;
    } catch (error) {
      console.error('Error uploading audio:', error);
      throw error;
    }
  }

  async transformAudio(audioId: string, effects: any[], userId: string) {
    if (!audioId || !effects || effects.length === 0) {
      throw new BadRequestError('Audio ID and effects are required');
    }

    // Get original audio
    const originalAudio = await this.getAudio(audioId, userId);
    if (!originalAudio) {
      throw new BadRequestError('Audio not found');
    }

    // Apply effects
    const transformedAudio = await this.voiceProcessor.applyEffects(originalAudio, effects);

    return transformedAudio;
  }

  async deleteAudio(audioId: string, userId: string): Promise<void> {
    try {
      const audioDoc = await firestore.collection('audioFiles').doc(audioId).get();
      
      if (!audioDoc.exists) {
        throw new BadRequestError('Audio file not found');
      }

      const audioData = audioDoc.data() as AudioFile;
      if (audioData.userId !== userId) {
        throw new BadRequestError('Not authorized to delete this file');
      }

      // Delete from cloud storage
      // This is a placeholder - implement actual cloud storage deletion

      // Delete from Firestore
      await audioDoc.ref.delete();
    } catch (error) {
      console.error('Error deleting audio:', error);
      throw error;
    }
  }

  async getAudioList(userId: string): Promise<AudioFile[]> {
    try {
      const snapshot = await firestore
        .collection('audioFiles')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => doc.data() as AudioFile);
    } catch (error) {
      console.error('Error getting audio list:', error);
      throw error;
    }
  }

  private validateTransformations(transformations: AudioTransformation): void {
    const { pitch, speed, volume } = transformations;

    if (pitch !== undefined && (pitch < -100 || pitch > 100)) {
      throw new BadRequestError('Pitch must be between -100 and 100');
    }

    if (speed !== undefined && (speed < 0.5 || speed > 2.0)) {
      throw new BadRequestError('Speed must be between 0.5 and 2.0');
    }

    if (volume !== undefined && (volume < -100 || volume > 400)) {
      throw new BadRequestError('Volume must be between -100 and 400');
    }
  }

  private async getAudio(audioId: string, userId: string) {
    // Implement fetching audio from storage
    return null;
  }
} 