import { VoiceTransformation, VoiceAnalysis, ProcessedVoiceResult, VoicePreset } from '../types/voice';
import { createDocument, updateDocument, collections } from '../lib/firebase';
import { uploadAudio, transformAudio } from '../lib/cloudinary';
import { analyzeEmotion } from '../lib/emotionAnalysis';
import { applyVoiceEffects } from '../lib/audioEffects';
import { enhanceAudio } from '../lib/audioEnhancement';
import { NotFoundError, BadRequestError } from '../utils/errors';

export class VoiceProcessingService {
  private readonly processedVoicesCollection = collections.processedVoices;
  private readonly presetsCollection = collections.voicePresets;

  async processVoice(
    audioId: string,
    userId: string,
    transformation: VoiceTransformation,
    presetId?: string
  ): Promise<ProcessedVoiceResult> {
    try {
      // Get original audio
      const audioDoc = await collections.audioFiles.doc(audioId).get();
      if (!audioDoc.exists) {
        throw new NotFoundError('Audio not found');
      }

      const audioData = audioDoc.data();
      if (audioData.userId !== userId) {
        throw new NotFoundError('Audio not found');
      }

      // Apply preset if provided
      if (presetId) {
        const preset = await this.getPreset(presetId);
        transformation = this.mergeTransformations(transformation, preset.transformation);
      }

      // 1. Basic Audio Processing
      let processedAudio = await this.applyBasicTransformations(
        audioData.cloudinaryId,
        transformation
      );

      // 2. Apply Advanced Voice Modifications
      if (transformation.formant || transformation.vibrato || transformation.breathiness) {
        processedAudio = await this.applyAdvancedModifications(
          processedAudio.buffer,
          transformation
        );
      }

      // 3. Apply Emotional Modifications
      if (transformation.emotions) {
        processedAudio = await this.applyEmotionalModifications(
          processedAudio.buffer,
          transformation.emotions
        );
      }

      // 4. Apply Voice Characteristics
      if (transformation.characteristics) {
        processedAudio = await this.applyCharacteristics(
          processedAudio.buffer,
          transformation.characteristics
        );
      }

      // 5. Apply Audio Effects
      if (transformation.effects) {
        processedAudio = await applyVoiceEffects(
          processedAudio.buffer,
          transformation.effects
        );
      }

      // 6. Apply Audio Enhancements
      if (transformation.enhancement) {
        processedAudio = await enhanceAudio(
          processedAudio.buffer,
          transformation.enhancement
        );
      }

      // Upload final processed audio
      const uploadResult = await uploadAudio(
        processedAudio.buffer,
        `processed/${userId}`
      );

      // Analyze the processed voice
      const analysis = await this.analyzeVoice(processedAudio.buffer);

      // Store the result
      const result: ProcessedVoiceResult = {
        id: await this.saveProcessedVoice(userId, {
          originalAudioId: audioId,
          url: uploadResult.url,
          duration: uploadResult.duration || 0,
          format: uploadResult.format,
          transformation,
          analysis,
          preset: presetId ? await this.getPreset(presetId) : undefined,
          createdAt: new Date()
        }),
        originalAudioId: audioId,
        url: uploadResult.url,
        duration: uploadResult.duration || 0,
        format: uploadResult.format,
        transformation,
        analysis,
        preset: presetId ? await this.getPreset(presetId) : undefined,
        createdAt: new Date()
      };

      return result;
    } catch (error) {
      console.error('Voice processing error:', error);
      throw error;
    }
  }

  async createPreset(
    userId: string,
    preset: Omit<VoicePreset, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<VoicePreset> {
    const newPreset: VoicePreset = {
      ...preset,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: await createDocument('voicePresets', {
        ...preset,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    };

    return newPreset;
  }

  async getPreset(presetId: string): Promise<VoicePreset> {
    const doc = await this.presetsCollection.doc(presetId).get();
    if (!doc.exists) {
      throw new NotFoundError('Preset not found');
    }
    return { id: doc.id, ...doc.data() } as VoicePreset;
  }

  async getUserPresets(userId: string): Promise<VoicePreset[]> {
    const snapshot = await this.presetsCollection
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as VoicePreset));
  }

  async getPublicPresets(): Promise<VoicePreset[]> {
    const snapshot = await this.presetsCollection
      .where('isPublic', '==', true)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as VoicePreset));
  }

  private async saveProcessedVoice(
    userId: string,
    data: Omit<ProcessedVoiceResult, 'id'>
  ): Promise<string> {
    return createDocument('processedVoices', {
      ...data,
      userId
    });
  }

  private async applyBasicTransformations(
    cloudinaryId: string,
    transformation: VoiceTransformation
  ) {
    const { pitch, speed, volume } = transformation;
    const result = await transformAudio(cloudinaryId, {
      pitch: pitch || 0,
      speed: speed || 1,
      volume: volume || 0
    });

    // Download the transformed audio for further processing
    const response = await fetch(result.url);
    const buffer = await response.arrayBuffer();
    return {
      buffer: Buffer.from(buffer),
      url: result.url
    };
  }

  private async applyAdvancedModifications(
    buffer: Buffer,
    transformation: VoiceTransformation
  ) {
    // Implementation using libraries like sox, ffmpeg, or custom DSP
    return { buffer };
  }

  private async applyEmotionalModifications(
    buffer: Buffer,
    emotions: VoiceTransformation['emotions']
  ) {
    // Implementation using emotion synthesis models
    return { buffer };
  }

  private async applyCharacteristics(
    buffer: Buffer,
    characteristics: VoiceTransformation['characteristics']
  ) {
    // Implementation using voice characteristic models
    return { buffer };
  }

  private async analyzeVoice(buffer: Buffer): Promise<VoiceAnalysis> {
    // Analyze various aspects of the voice
    const emotionAnalysis = await analyzeEmotion(buffer);

    return {
      pitch: {
        mean: 0,
        range: 0,
        variability: 0
      },
      tempo: {
        wordsPerMinute: 0,
        beatRegularity: 0
      },
      energy: {
        overall: 0,
        distribution: []
      },
      emotionalMarkers: emotionAnalysis,
      quality: {
        clarity: 0,
        snr: 0,
        distortion: 0
      }
    };
  }

  private mergeTransformations(
    base: VoiceTransformation,
    preset: VoiceTransformation
  ): VoiceTransformation {
    return {
      ...preset,
      ...base,
      emotions: { ...preset.emotions, ...base.emotions },
      characteristics: { ...preset.characteristics, ...base.characteristics },
      effects: { ...preset.effects, ...base.effects },
      enhancement: { ...preset.enhancement, ...base.enhancement }
    };
  }
} 