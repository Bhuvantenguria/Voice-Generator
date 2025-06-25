import { firestore } from '../config/firebase';
import { redis } from '../config/redis';
import { UserProfile, UserSettings, UserMetrics } from '../types/user';
import { BadRequestError } from '../utils/errors';

export class UserService {
  private readonly CACHE_TTL = 3600; // 1 hour
  private readonly METRICS_TTL = 86400; // 24 hours

  private readonly CACHE_KEYS = {
    profile: (userId: string) => `user:${userId}:profile`,
    settings: (userId: string) => `user:${userId}:settings`,
    metrics: (userId: string) => `user:${userId}:metrics`
  };

  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      // Check cache first
      const cachedProfile = await redis.get(this.CACHE_KEYS.profile(userId));
      if (cachedProfile) {
        return JSON.parse(cachedProfile);
      }

      // Get from Firestore
      const doc = await firestore.collection('users').doc(userId).get();
      if (!doc.exists) {
        return null;
      }

      const profile = doc.data() as UserProfile;
      
      // Cache the result
      await redis.set(
        this.CACHE_KEYS.profile(userId),
        JSON.stringify(profile),
        'EX',
        this.CACHE_TTL
      );

      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const userRef = firestore.collection('users').doc(userId);
      const doc = await userRef.get();

      if (!doc.exists) {
        throw new BadRequestError('User profile not found');
      }

      const updatedProfile = {
        ...doc.data(),
        ...updates,
        updatedAt: new Date()
      } as UserProfile;

      await userRef.update(updatedProfile);

      // Update cache
      await redis.set(
        this.CACHE_KEYS.profile(userId),
        JSON.stringify(updatedProfile),
        'EX',
        this.CACHE_TTL
      );

      return updatedProfile;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async getSettings(userId: string): Promise<UserSettings> {
    try {
      // Check cache first
      const cachedSettings = await redis.get(this.CACHE_KEYS.settings(userId));
      if (cachedSettings) {
        return JSON.parse(cachedSettings);
      }

      // Get from Firestore
      const doc = await firestore.collection('userSettings').doc(userId).get();
      if (!doc.exists) {
        // Return default settings
        return {
          theme: 'system',
          autoplay: true,
          quality: 'high',
          saveHistory: true,
          downloadFormat: 'mp3'
        };
      }

      const settings = doc.data() as UserSettings;
      
      // Cache the result
      await redis.set(
        this.CACHE_KEYS.settings(userId),
        JSON.stringify(settings),
        'EX',
        this.CACHE_TTL
      );

      return settings;
    } catch (error) {
      console.error('Error fetching user settings:', error);
      throw error;
    }
  }

  async updateSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings> {
    try {
      const settingsRef = firestore.collection('userSettings').doc(userId);
      const doc = await settingsRef.get();

      const currentSettings = doc.exists ? doc.data() as UserSettings : {
        theme: 'system',
        autoplay: true,
        quality: 'high',
        saveHistory: true,
        downloadFormat: 'mp3'
      };

      const updatedSettings = {
        ...currentSettings,
        ...updates
      };

      await settingsRef.set(updatedSettings);

      // Update cache
      await redis.set(
        this.CACHE_KEYS.settings(userId),
        JSON.stringify(updatedSettings),
        'EX',
        this.CACHE_TTL
      );

      return updatedSettings;
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  }

  async getMetrics(userId: string): Promise<UserMetrics> {
    try {
      // Check cache first
      const cachedMetrics = await redis.get(this.CACHE_KEYS.metrics(userId));
      if (cachedMetrics) {
        return JSON.parse(cachedMetrics);
      }

      // Calculate metrics from Firestore
      const audioFiles = await firestore
        .collection('audioFiles')
        .where('userId', '==', userId)
        .get();

      const metrics: UserMetrics = {
        totalVoiceGenerations: audioFiles.size,
        totalAudioDuration: 0,
        averageQuality: 0,
        successRate: 0,
        mostUsedVoices: [],
        mostUsedEffects: [],
        usageByDay: []
      };

      const voiceUsage = new Map<string, number>();
      const effectsUsage = new Map<string, number>();
      const dailyUsage = new Map<string, { count: number; duration: number }>();
      let totalSuccessful = 0;

      audioFiles.forEach(doc => {
        const audio = doc.data();
        
        // Calculate total duration
        if (audio.duration) {
          metrics.totalAudioDuration += audio.duration;
        }

        // Track successful generations
        if (audio.status === 'completed') {
          totalSuccessful++;
        }

        // Track voice usage
        if (audio.voice) {
          voiceUsage.set(audio.voice, (voiceUsage.get(audio.voice) || 0) + 1);
        }

        // Track effects usage
        if (audio.transformation?.effects) {
          Object.keys(audio.transformation.effects).forEach(effect => {
            if (audio.transformation.effects[effect]?.enabled) {
              effectsUsage.set(effect, (effectsUsage.get(effect) || 0) + 1);
            }
          });
        }

        // Track daily usage
        const date = new Date(audio.createdAt).toISOString().split('T')[0];
        const current = dailyUsage.get(date) || { count: 0, duration: 0 };
        dailyUsage.set(date, {
          count: current.count + 1,
          duration: current.duration + (audio.duration || 0)
        });
      });

      // Calculate success rate
      metrics.successRate = (totalSuccessful / audioFiles.size) * 100;

      // Sort and limit voice usage
      metrics.mostUsedVoices = Array.from(voiceUsage.entries())
        .map(([voiceId, count]) => ({ voiceId, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Sort and limit effects usage
      metrics.mostUsedEffects = Array.from(effectsUsage.entries())
        .map(([effect, count]) => ({ effect, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Format daily usage
      metrics.usageByDay = Array.from(dailyUsage.entries())
        .map(([date, { count, duration }]) => ({ date, count, duration }))
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 30); // Last 30 days

      // Cache the result
      await redis.set(
        this.CACHE_KEYS.metrics(userId),
        JSON.stringify(metrics),
        'EX',
        this.METRICS_TTL
      );

      return metrics;
    } catch (error) {
      console.error('Error calculating user metrics:', error);
      throw error;
    }
  }

  async createInitialProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const profile: UserProfile = {
        id: userId,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        country: data.country || '',
        region: data.region || '',
        purpose: data.purpose || 'personal',
        language: data.language || 'en',
        timezone: data.timezone || 'UTC',
        preferences: {
          defaultVoice: 'neutral',
          defaultLanguage: 'en-US',
          emailNotifications: true,
          newsletter: true
        },
        usage: {
          totalGenerations: 0,
          totalDuration: 0,
          lastUsed: new Date()
        },
        subscription: {
          plan: 'free',
          status: 'active',
          features: [
            '25 voice generations per day',
            'Basic voice effects',
            'Standard quality',
            'Community support'
          ]
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await firestore.collection('users').doc(userId).set(profile);

      // Cache the profile
      await redis.set(
        this.CACHE_KEYS.profile(userId),
        JSON.stringify(profile),
        'EX',
        this.CACHE_TTL
      );

      return profile;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }
} 