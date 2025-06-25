const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

export class ApiService {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized access
          window.location.href = '/sign-in';
          throw new Error('Unauthorized access');
        }

        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Audio Generation Endpoints
  static async generateAudio(text: string, options: {
    pitch?: number;
    speed?: number;
    volume?: number;
  }): Promise<ApiResponse<{
    id: string;
    url: string;
    name: string;
    duration?: number;
    format: string;
  }>> {
    return this.request('/audio/generate', {
      method: 'POST',
      body: JSON.stringify({ text, ...options }),
    });
  }

  static async transformAudio(audioId: string, transformations: {
    pitch?: number;
    speed?: number;
    volume?: number;
  }): Promise<ApiResponse<{
    id: string;
    url: string;
    name: string;
    duration?: number;
    format: string;
  }>> {
    return this.request(`/audio/${audioId}/transform`, {
      method: 'PATCH',
      body: JSON.stringify(transformations),
    });
  }

  static async deleteAudio(audioId: string): Promise<void> {
    await this.request(`/audio/${audioId}`, {
      method: 'DELETE',
    });
  }

  static async getUserAudios(): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    url: string;
    duration?: number;
    format: string;
    transformations?: {
      pitch?: number;
      speed?: number;
      volume?: number;
    };
    createdAt?: string;
    updatedAt?: string;
  }>>> {
    return this.request('/audio/list');
  }

  // User Profile Endpoints
  static async getProfile(): Promise<ApiResponse<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    region: string;
    purpose: 'personal' | 'business' | 'education' | 'other';
    language: string;
    timezone: string;
    preferences: {
      defaultVoice: string;
      defaultLanguage: string;
      emailNotifications: boolean;
      newsletter: boolean;
    };
    usage: {
      totalGenerations: number;
      totalDuration: number;
      lastUsed: Date;
    };
    subscription: {
      plan: 'free' | 'pro' | 'enterprise';
      status: 'active' | 'inactive';
      nextBilling?: Date;
      features: string[];
    };
  }>> {
    return this.request('/user/profile');
  }

  static async updateProfile(updates: {
    firstName?: string;
    lastName?: string;
    country?: string;
    region?: string;
    purpose?: 'personal' | 'business' | 'education' | 'other';
    language?: string;
    timezone?: string;
    preferences?: {
      defaultVoice?: string;
      defaultLanguage?: string;
      emailNotifications?: boolean;
      newsletter?: boolean;
    };
  }): Promise<ApiResponse<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    region: string;
    purpose: 'personal' | 'business' | 'education' | 'other';
    language: string;
    timezone: string;
    preferences: {
      defaultVoice: string;
      defaultLanguage: string;
      emailNotifications: boolean;
      newsletter: boolean;
    };
  }>> {
    return this.request('/user/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  static async getSettings(): Promise<ApiResponse<{
    theme: 'light' | 'dark' | 'system';
    autoplay: boolean;
    quality: 'low' | 'medium' | 'high';
    saveHistory: boolean;
    downloadFormat: 'mp3' | 'wav';
  }>> {
    return this.request('/user/settings');
  }

  static async updateSettings(updates: {
    theme?: 'light' | 'dark' | 'system';
    autoplay?: boolean;
    quality?: 'low' | 'medium' | 'high';
    saveHistory?: boolean;
    downloadFormat?: 'mp3' | 'wav';
  }): Promise<ApiResponse<{
    theme: 'light' | 'dark' | 'system';
    autoplay: boolean;
    quality: 'low' | 'medium' | 'high';
    saveHistory: boolean;
    downloadFormat: 'mp3' | 'wav';
  }>> {
    return this.request('/user/settings', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  static async getMetrics(): Promise<ApiResponse<{
    totalVoiceGenerations: number;
    totalAudioDuration: number;
    averageQuality: number;
    successRate: number;
    mostUsedVoices: Array<{
      voiceId: string;
      count: number;
    }>;
    mostUsedEffects: Array<{
      effect: string;
      count: number;
    }>;
    usageByDay: Array<{
      date: string;
      count: number;
      duration: number;
    }>;
  }>> {
    return this.request('/user/metrics');
  }
}

export const api = new ApiService(); 