export interface UserProfile {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  autoplay: boolean;
  quality: 'low' | 'medium' | 'high';
  saveHistory: boolean;
  downloadFormat: 'mp3' | 'wav';
}

export interface UserMetrics {
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
} 