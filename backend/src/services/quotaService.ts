import { redis } from '../config/redis';
import { BadRequestError } from '../utils/errors';

export class QuotaService {
  private static readonly QUOTA_KEYS = {
    dailyVoiceGeneration: (userId: string) => `quota:voice:${userId}:${this.getCurrentDate()}`,
    dailyApiCalls: (userId: string) => `quota:api:${userId}:${this.getCurrentDate()}`,
    storageUsage: (userId: string) => `quota:storage:${userId}`,
    dailyAudioGenerations: (userId: string) => `quota:${userId}:audio:generations:daily`,
    dailyAudioTransformations: (userId: string) => `quota:${userId}:audio:transformations:daily`
  };

  private static readonly LIMITS = {
    // Free tier limits
    DAILY_VOICE_GENERATIONS: 25,      // 25 voice generations per day
    DAILY_API_CALLS: 1000,            // 1000 API calls per day
    DAILY_AUDIO_GENERATIONS: 25,
    DAILY_AUDIO_TRANSFORMATIONS: 50,
    MAX_AUDIO_DURATION: 300,         // 5 minutes in seconds
    MAX_STORAGE_MB: 100,             // 100MB storage limit
    MAX_TEXT_LENGTH: 1000            // 1000 characters per generation
  };

  private readonly FREE_TIER_DAILY_LIMIT = 10;
  private readonly FREE_TIER_TRANSFORM_LIMIT = 5;

  private static getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  async checkVoiceGenerationQuota(userId: string): Promise<void> {
    const key = QuotaService.QUOTA_KEYS.dailyVoiceGeneration(userId);
    const usage = await redis.incr(key);

    // Set expiry if this is the first increment
    if (usage === 1) {
      await redis.expire(key, 86400); // 24 hours
    }

    if (usage > QuotaService.LIMITS.DAILY_VOICE_GENERATIONS) {
      throw new BadRequestError(
        `Daily voice generation limit (${QuotaService.LIMITS.DAILY_VOICE_GENERATIONS}) exceeded. Please try again tomorrow.`
      );
    }
  }

  async checkAudioGenerationQuota(userId: string): Promise<void> {
    const key = QuotaService.QUOTA_KEYS.dailyAudioGenerations(userId);
    const usage = await redis.incr(key);

    if (usage === 1) {
      await redis.expire(key, 86400); // 24 hours
    }

    if (usage > QuotaService.LIMITS.DAILY_AUDIO_GENERATIONS) {
      throw new BadRequestError(
        `Daily audio generation limit (${QuotaService.LIMITS.DAILY_AUDIO_GENERATIONS}) exceeded. Please try again tomorrow.`
      );
    }
  }

  async checkAudioTransformationQuota(userId: string): Promise<void> {
    const key = QuotaService.QUOTA_KEYS.dailyAudioTransformations(userId);
    const usage = await redis.incr(key);

    if (usage === 1) {
      await redis.expire(key, 86400); // 24 hours
    }

    if (usage > QuotaService.LIMITS.DAILY_AUDIO_TRANSFORMATIONS) {
      throw new BadRequestError(
        `Daily audio transformation limit (${QuotaService.LIMITS.DAILY_AUDIO_TRANSFORMATIONS}) exceeded. Please try again tomorrow.`
      );
    }
  }

  async checkApiCallQuota(userId: string): Promise<void> {
    const key = QuotaService.QUOTA_KEYS.dailyApiCalls(userId);
    const usage = await redis.incr(key);

    if (usage === 1) {
      await redis.expire(key, 86400);
    }

    if (usage > QuotaService.LIMITS.DAILY_API_CALLS) {
      throw new BadRequestError(
        `Daily API call limit (${QuotaService.LIMITS.DAILY_API_CALLS}) exceeded. Please try again tomorrow.`
      );
    }
  }

  async checkStorageQuota(userId: string, fileSizeInMB: number): Promise<void> {
    const key = QuotaService.QUOTA_KEYS.storageUsage(userId);
    const currentUsage = parseFloat(await redis.get(key) || '0');
    const newUsage = currentUsage + fileSizeInMB;

    if (newUsage > QuotaService.LIMITS.MAX_STORAGE_MB) {
      throw new BadRequestError(
        `Storage quota (${QuotaService.LIMITS.MAX_STORAGE_MB}MB) exceeded. Please delete some files.`
      );
    }

    await redis.set(key, newUsage.toString());
  }

  async updateStorageUsage(userId: string, fileSizeInMB: number): Promise<void> {
    const key = QuotaService.QUOTA_KEYS.storageUsage(userId);
    await redis.incrBy(key, fileSizeInMB);
  }

  async reduceStorageUsage(userId: string, fileSizeInMB: number): Promise<void> {
    const key = QuotaService.QUOTA_KEYS.storageUsage(userId);
    const currentUsage = parseFloat(await redis.get(key) || '0');
    const newUsage = Math.max(0, currentUsage - fileSizeInMB);
    await redis.set(key, newUsage.toString());
  }

  validateTextLength(text: string): void {
    if (text.length > QuotaService.LIMITS.MAX_TEXT_LENGTH) {
      throw new BadRequestError(
        `Text length exceeds limit of ${QuotaService.LIMITS.MAX_TEXT_LENGTH} characters.`
      );
    }
  }

  validateAudioDuration(durationInSeconds: number): void {
    if (durationInSeconds > QuotaService.LIMITS.MAX_AUDIO_DURATION) {
      throw new BadRequestError(
        `Audio duration exceeds limit of ${QuotaService.LIMITS.MAX_AUDIO_DURATION} seconds.`
      );
    }
  }

  async getRemainingQuota(userId: string): Promise<{
    voiceGenerations: number;
    apiCalls: number;
    storageUsageMB: number;
  }> {
    const [voiceUsage, apiUsage, storageUsage] = await Promise.all([
      redis.get(QuotaService.QUOTA_KEYS.dailyVoiceGeneration(userId)) || '0',
      redis.get(QuotaService.QUOTA_KEYS.dailyApiCalls(userId)) || '0',
      redis.get(QuotaService.QUOTA_KEYS.storageUsage(userId)) || '0'
    ]);

    return {
      voiceGenerations: QuotaService.LIMITS.DAILY_VOICE_GENERATIONS - parseInt(voiceUsage),
      apiCalls: QuotaService.LIMITS.DAILY_API_CALLS - parseInt(apiUsage),
      storageUsageMB: QuotaService.LIMITS.MAX_STORAGE_MB - parseFloat(storageUsage)
    };
  }

  async checkGenerationQuota(userId: string): Promise<void> {
    const usageCount = await this.getDailyUsageCount(userId);
    
    if (usageCount >= this.FREE_TIER_DAILY_LIMIT) {
      throw new BadRequestError('Daily generation quota exceeded');
    }
  }

  async checkTransformationQuota(userId: string): Promise<void> {
    const transformCount = await this.getDailyTransformCount(userId);
    
    if (transformCount >= this.FREE_TIER_TRANSFORM_LIMIT) {
      throw new BadRequestError('Daily transformation quota exceeded');
    }
  }

  private async getDailyUsageCount(userId: string): Promise<number> {
    // TODO: Implement actual quota tracking
    return 0;
  }

  private async getDailyTransformCount(userId: string): Promise<number> {
    // TODO: Implement actual quota tracking
    return 0;
  }
} 