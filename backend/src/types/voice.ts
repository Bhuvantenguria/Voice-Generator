export interface VoiceEmotions {
  happiness?: number;   // 0-100
  sadness?: number;    // 0-100
  anger?: number;      // 0-100
  fear?: number;       // 0-100
  surprise?: number;   // 0-100
  neutral?: number;    // 0-100
}

export interface VoiceCharacteristics {
  age?: number;        // Child, Adult, Elder (0-100)
  gender?: number;     // Masculine to Feminine scale (-100 to 100)
  accent?: string;     // American, British, Australian, etc.
  clarity?: number;    // Voice clarity/crispness (0-100)
}

export interface VoiceEffects {
  reverb?: {
    enabled: boolean;
    amount: number;    // 0-100
    decay: number;     // 0-100
  };
  echo?: {
    enabled: boolean;
    delay: number;     // milliseconds
    feedback: number;  // 0-100
  };
  chorus?: {
    enabled: boolean;
    depth: number;     // 0-100
    rate: number;      // 0-100
  };
}

export interface AudioEnhancement {
  noiseSuppression?: boolean;
  autoGainControl?: boolean;
  dereverberation?: boolean;
  backgroundNoise?: {
    type?: string;     // 'none' | 'ambient' | 'music' | 'crowd' | 'nature'
    volume?: number;   // 0-100
  };
}

export interface VoiceTransformation {
  pitch?: number;
  speed?: number;
  volume?: number;
  effects?: string[];
}

export interface VoiceAnalysis {
  pitch: {
    mean: number;
    range: number;
    variability: number;
  };
  tempo: {
    wordsPerMinute: number;
    beatRegularity: number;
  };
  energy: {
    overall: number;
    distribution: number[];
  };
  emotionalMarkers: {
    dominantEmotion: string;
    confidence: number;
    emotionScores: VoiceEmotions;
  };
  quality: {
    clarity: number;
    snr: number;      // Signal-to-noise ratio
    distortion: number;
  };
}

export interface VoicePreset {
  id: string;
  name: string;
  description?: string;
  transformation: VoiceTransformation;
  tags: string[];
  category: string;
  isPublic: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProcessedVoiceResult {
  id: string;
  originalAudioId: string;
  url: string;
  duration: number;
  format: string;
  transformation: VoiceTransformation;
  analysis: VoiceAnalysis;
  preset?: VoicePreset;
  createdAt: Date;
}

export interface UploadedFile {
  path: string;
  mimetype: string;
  filename: string;
  size: number;
}

export interface AudioFile {
  id: string;
  userId: string;
  url: string;
  name: string;
  duration?: number;
  format: string;
  transformation?: VoiceTransformation;
  createdAt: Date;
  updatedAt: Date;
} 