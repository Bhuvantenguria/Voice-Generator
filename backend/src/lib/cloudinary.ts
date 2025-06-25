import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export interface AudioTransformation {
  pitch?: number;  // -100 to 100
  speed?: number;  // 0.5 to 2.0
  volume?: number; // -100 to 400
}

export interface UploadResponse {
  url: string;
  public_id: string;
  format: string;
  duration?: number;
  bytes?: number;
}

export const uploadAudio = (buffer: Buffer, folder: string): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'video', // handles both audio and video
        format: 'mp3',
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Upload failed'));
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          duration: result.duration,
          bytes: result.bytes
        });
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export const transformAudio = async (
  public_id: string,
  transformations: AudioTransformation
): Promise<UploadResponse> => {
  const transformation = [];
  
  if (transformations.pitch) {
    transformation.push({ pitch: transformations.pitch });
  }
  
  if (transformations.speed) {
    transformation.push({ speed: transformations.speed });
  }
  
  if (transformations.volume) {
    transformation.push({ volume: transformations.volume });
  }

  try {
    const result = await cloudinary.uploader.explicit(public_id, {
      type: 'upload',
      resource_type: 'video',
      eager: [{
        audio_frequency: 44100,
        audio_codec: 'mp3',
        transformation
      }],
    });

    return {
      url: result.eager[0].secure_url,
      public_id: result.public_id,
      format: result.format,
      duration: result.duration,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Error transforming audio:', error);
    throw error;
  }
};

export const deleteAudio = async (public_id: string): Promise<boolean> => {
  try {
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: 'video'
    });
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting audio:', error);
    return false;
  }
};

export const getAudioInfo = async (public_id: string): Promise<UploadResponse> => {
  try {
    const result = await cloudinary.api.resource(public_id, {
      resource_type: 'video'
    });
    
    return {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      duration: result.duration,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Error getting audio info:', error);
    throw error;
  }
}; 