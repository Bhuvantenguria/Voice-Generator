import { cacheUtils } from '../config/redis';
import { redis } from '../config/redis';
import { VoiceTransformation } from '../types/voice';

export class VoiceCacheService {
  private static readonly CACHE_KEYS = {
    voiceResult: (userId: string, text: string, transformationHash: string) => 
      `voice:${userId}:${this.hashText(text)}:${transformationHash}`,
    userQuota: (userId: string) => 
      `quota:${userId}`,
    preset: (presetId: string) => 
      `preset:${presetId}`,
    userPresets: (userId: string) => 
      `presets:${userId}`
  };

  private readonly CACHE_TTL = 24 * 60 * 60; // 24 hours in seconds

  private static hashText(text: string): string {
    return Buffer.from(text).toString('base64');
  }

  private static generateTransformationHash(transformation: VoiceTransformation): string {
    return Buffer.from(JSON.stringify(transformation)).toString('base64');
  }

  async get(key: string): Promise<string | null> {
    return redis.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    await redis.set(key, value, 'EX', this.CACHE_TTL);
  }

  async getCachedVoiceResult(
    userId: string,
    text: string,
    transformation: VoiceTransformation
  ): Promise<string | null> {
    const key = this.generateCacheKey(userId, text, transformation);
    return this.get(key);
  }

  async cacheVoiceResult(
    userId: string,
    text: string,
    transformation: VoiceTransformation,
    url: string
  ): Promise<void> {
    const key = this.generateCacheKey(userId, text, transformation);
    await this.set(key, url);
  }

  private generateCacheKey(
    userId: string,
    text: string,
    transformation: VoiceTransformation
  ): string {
    return `voice:${userId}:${text}:${JSON.stringify(transformation)}`;
  }

  async getUserQuota(userId: string): Promise<number | null> {
    const key = VoiceCacheService.CACHE_KEYS.userQuota(userId);
    return cacheUtils.get<number>(key);
  }

  async setUserQuota(userId: string, quota: number): Promise<void> {
    const key = VoiceCacheService.CACHE_KEYS.userQuota(userId);
    await cacheUtils.cacheUserQuota(userId, quota);
  }

  async decrementUserQuota(userId: string): Promise<number | null> {
    const key = VoiceCacheService.CACHE_KEYS.userQuota(userId);
    const quota = await this.getUserQuota(userId);
    
    if (quota === null || quota <= 0) return null;
    
    const newQuota = quota - 1;
    await this.setUserQuota(userId, newQuota);
    return newQuota;
  }

  async getCachedPreset(presetId: string): Promise<any | null> {
    const key = VoiceCacheService.CACHE_KEYS.preset(presetId);
    return cacheUtils.get(key);
  }

  async cachePreset(presetId: string, preset: any): Promise<void> {
    const key = VoiceCacheService.CACHE_KEYS.preset(presetId);
    await cacheUtils.cacheVoicePreset(key, preset);
  }

  async getCachedUserPresets(userId: string): Promise<any[] | null> {
    const key = VoiceCacheService.CACHE_KEYS.userPresets(userId);
    return cacheUtils.get(key);
  }

  async cacheUserPresets(userId: string, presets: any[]): Promise<void> {
    const key = VoiceCacheService.CACHE_KEYS.userPresets(userId);
    await cacheUtils.cacheVoicePreset(key, presets);
  }

  async invalidateUserCache(userId: string): Promise<void> {
    // Get all keys for this user
    const pattern = `*:${userId}:*`;
    const keys = await this.scanKeys(pattern);
    
    // Delete all found keys
    if (keys.length > 0) {
      await Promise.all(keys.map(key => cacheUtils.del(key)));
    }
  }

  private async scanKeys(pattern: string): Promise<string[]> {
    const keys: string[] = [];
    let cursor = '0';
    
    do {
      const [newCursor, scanKeys] = await redis.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100
      );
      
      cursor = newCursor;
      keys.push(...scanKeys);
    } while (cursor !== '0');
    
    return keys;
  }
} 