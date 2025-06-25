import { cacheUtils } from '../config/redis';

export class CacheService {
  private readonly defaultTTL: number = 3600; // 1 hour in seconds

  // Cache keys
  private static readonly KEYS = {
    USER_PROFILE: (userId: string) => `user:${userId}:profile`,
    USER_AUDIO_FILES: (userId: string) => `user:${userId}:audio-files`,
    AUDIO_FILE: (fileId: string) => `audio:${fileId}`,
    VOICE_PRESET: (presetId: string) => `preset:${presetId}`,
    USER_PRESETS: (userId: string) => `user:${userId}:presets`
  };

  // Cache user profile
  async cacheUserProfile(userId: string, profileData: any): Promise<void> {
    await cacheUtils.set(
      CacheService.KEYS.USER_PROFILE(userId),
      profileData,
      this.defaultTTL
    );
  }

  async getUserProfile(userId: string): Promise<any | null> {
    return cacheUtils.get(CacheService.KEYS.USER_PROFILE(userId));
  }

  // Cache audio files list
  async cacheUserAudioFiles(userId: string, files: any[]): Promise<void> {
    await cacheUtils.set(
      CacheService.KEYS.USER_AUDIO_FILES(userId),
      files,
      this.defaultTTL
    );
  }

  async getUserAudioFiles(userId: string): Promise<any[] | null> {
    return cacheUtils.get(CacheService.KEYS.USER_AUDIO_FILES(userId));
  }

  // Cache individual audio file
  async cacheAudioFile(fileId: string, fileData: any): Promise<void> {
    await cacheUtils.set(
      CacheService.KEYS.AUDIO_FILE(fileId),
      fileData,
      this.defaultTTL
    );
  }

  async getAudioFile(fileId: string): Promise<any | null> {
    return cacheUtils.get(CacheService.KEYS.AUDIO_FILE(fileId));
  }

  // Cache voice presets
  async cacheVoicePreset(presetId: string, presetData: any): Promise<void> {
    await cacheUtils.set(
      CacheService.KEYS.VOICE_PRESET(presetId),
      presetData,
      this.defaultTTL
    );
  }

  async getVoicePreset(presetId: string): Promise<any | null> {
    return cacheUtils.get(CacheService.KEYS.VOICE_PRESET(presetId));
  }

  async cacheUserPresets(userId: string, presets: any[]): Promise<void> {
    await cacheUtils.set(
      CacheService.KEYS.USER_PRESETS(userId),
      presets,
      this.defaultTTL
    );
  }

  async getUserPresets(userId: string): Promise<any[] | null> {
    return cacheUtils.get(CacheService.KEYS.USER_PRESETS(userId));
  }

  // Clear specific cache
  async invalidateUserCache(userId: string): Promise<void> {
    await Promise.all([
      cacheUtils.del(CacheService.KEYS.USER_PROFILE(userId)),
      cacheUtils.del(CacheService.KEYS.USER_AUDIO_FILES(userId)),
      cacheUtils.del(CacheService.KEYS.USER_PRESETS(userId))
    ]);
  }

  async invalidateAudioCache(fileId: string): Promise<void> {
    await cacheUtils.del(CacheService.KEYS.AUDIO_FILE(fileId));
  }

  async invalidatePresetCache(presetId: string): Promise<void> {
    await cacheUtils.del(CacheService.KEYS.VOICE_PRESET(presetId));
  }

  // Clear all cache
  async clearAllCache(): Promise<void> {
    await cacheUtils.clearCache();
  }
} 