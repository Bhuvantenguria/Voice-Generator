import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface VoiceSample {
  file: File;
  text: string;
  emotion?: string;
}

interface VoiceGenerationParams {
  text: string;
  voiceProfileId: string;
}

interface VoiceProfile {
  _id: string;
  userId: string;
  baselinePitch: number;
  baselineSpeed: number;
  emotionalRange: {
    [key: string]: {
      pitch: number;
      speed: number;
      emotions: Array<{ emotion: string; confidence: number }>;
      pauses: number[];
    };
  };
}

class VoiceService {
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    headers?: any
  ): Promise<T> {
    try {
      const response = await axios({
        method,
        url: `${API_URL}${endpoint}`,
        data,
        headers: {
          ...headers,
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async createVoiceProfile(
    voiceSamples: VoiceSample[],
    voiceName: string
  ): Promise<VoiceProfile> {
    const formData = new FormData();
    formData.append('voiceName', voiceName);

    voiceSamples.forEach((sample, index) => {
      formData.append('audioFiles', sample.file);
      formData.append(`text_${sample.file.name}`, sample.text);
      if (sample.emotion) {
        formData.append(`emotion_${sample.file.name}`, sample.emotion);
      }
    });

    return this.request<VoiceProfile>('POST', '/voice-clone/clone', formData, {
      'Content-Type': 'multipart/form-data'
    });
  }

  async generateVoiceover(params: VoiceGenerationParams): Promise<{ audioUrl: string }> {
    return this.request<{ audioUrl: string }>('POST', '/voice-clone/generate', params);
  }

  async getVoiceProfiles(): Promise<VoiceProfile[]> {
    return this.request<VoiceProfile[]>('GET', '/voice-clone/profiles');
  }

  async deleteVoiceProfile(profileId: string): Promise<void> {
    return this.request<void>('DELETE', `/voice-clone/profiles/${profileId}`);
  }

  async updateVoiceProfile(
    profileId: string,
    updates: Partial<VoiceProfile>
  ): Promise<VoiceProfile> {
    return this.request<VoiceProfile>(
      'PATCH',
      `/voice-clone/profiles/${profileId}`,
      updates
    );
  }

  // Helper method to get the full URL for an audio file
  getAudioUrl(path: string): string {
    if (path.startsWith('http')) {
      return path;
    }
    return `${API_URL}${path}`;
  }
}

export const voiceService = new VoiceService(); 