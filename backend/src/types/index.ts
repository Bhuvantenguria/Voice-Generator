import { FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
    };
  }
}

export interface VoiceTransformation {
  pitch?: number;
  speed?: number;
  volume?: number;
  effects?: string[];
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

export interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    id: string;
    email: string;
  };
}

export interface GenerateAudioBody {
  text: string;
  transformation: VoiceTransformation;
}

export interface TransformAudioBody {
  name: string;
  transformation: VoiceTransformation;
} 