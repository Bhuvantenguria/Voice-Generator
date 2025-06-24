const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class ApiService {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      return { success: true, data };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Voice Generation Endpoints
  static async generateVoice(text: string, settings: {
    pitch: number;
    rate: number;
    volume: number;
  }): Promise<ApiResponse<{ audioUrl: string }>> {
    return this.request('/voiceover/generate', {
      method: 'POST',
      body: JSON.stringify({ text, settings }),
    });
  }

  static async saveVoice(audioUrl: string, name: string): Promise<ApiResponse<{ id: string }>> {
    return this.request('/voiceover/save', {
      method: 'POST',
      body: JSON.stringify({ audioUrl, name }),
    });
  }

  // Anime Dubbing Endpoints
  static async createDubProject(data: {
    projectName: string;
    trainingEpisodes: File[];
    targetEpisode: File;
    subtitles: File[];
    characters: string[];
  }): Promise<ApiResponse<{ projectId: string }>> {
    const formData = new FormData();
    formData.append('projectName', data.projectName);
    
    data.trainingEpisodes.forEach((episode, index) => {
      formData.append(`trainingEpisode${index + 1}`, episode);
    });
    
    formData.append('targetEpisode', data.targetEpisode);
    
    data.subtitles.forEach((subtitle, index) => {
      formData.append(`subtitle${index + 1}`, subtitle);
    });
    
    data.characters.forEach(character => {
      formData.append('characters[]', character);
    });

    return this.request('/anime-dub/create', {
      method: 'POST',
      body: formData,
      headers: {},
    });
  }

  static async getDubProgress(projectId: string): Promise<ApiResponse<{
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    error?: string;
  }>> {
    return this.request(`/anime-dub/progress/${projectId}`);
  }

  static async getVoiceList(): Promise<ApiResponse<{
    id: string;
    name: string;
    type: 'tts' | 'anime-dub';
    createdAt: string;
  }[]>> {
    return this.request('/voiceover/list');
  }

  static async deleteVoice(id: string): Promise<ApiResponse<void>> {
    return this.request(`/voiceover/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService();

export interface VoiceGenerationRequest {
  text: string;
  voiceStyle: string;
  speed: number;
  pitch: number;
}

export interface VoiceGenerationResponse {
  id: string;
  url: string;
  duration: number;
}

export const voiceApi = {
  generate: async (data: VoiceGenerationRequest): Promise<VoiceGenerationResponse> => {
    const response = await api.post('/api/voiceover/generate', data);
    return response.data;
  },
  
  getVoiceStyles: async () => {
    const response = await api.get('/api/voiceover/styles');
    return response.data;
  },

  getGenerationStatus: async (id: string) => {
    const response = await api.get(`/api/voiceover/status/${id}`);
    return response.data;
  },
}; 