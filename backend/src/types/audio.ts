export interface AudioTransformation {
  pitch?: number;    // -100 to 100
  speed?: number;    // 0.5 to 2.0
  volume?: number;   // -100 to 400
}

export interface AudioMetadata {
  id?: string;
  userId: string;
  name: string;
  cloudinaryId: string;
  url: string;
  duration?: number;
  format: string;
  bytes?: number;
  transformations?: AudioTransformation;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UploadedFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
}

export interface TransformAudioDTO {
  pitch?: number;
  speed?: number;
  volume?: number;
}

export interface AudioUploadResponse {
  id: string;
  url: string;
  name: string;
  duration?: number;
  format: string;
} 