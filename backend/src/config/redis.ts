import Redis from 'ioredis';
import { config } from 'dotenv';

config();

export const initializeRedis = () => {
  if (!process.env.UPSTASH_REDIS_URL) {
    throw new Error('UPSTASH_REDIS_URL is required');
  }
  return redis;
};

export const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Handle Redis connection events
redis.on('connect', () => {
  console.log('Successfully connected to Upstash Redis');
});

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

// Cache helper functions with TTL management
export const cacheUtils = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  },

  async set(key: string, value: any, expirySeconds: number = 3600): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      await redis.setex(key, expirySeconds, stringValue);
    } catch (error) {
      console.error('Redis set error:', error);
    }
  },

  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Redis del error:', error);
    }
  },

  async clearCache(): Promise<void> {
    try {
      await redis.flushall();
    } catch (error) {
      console.error('Redis clear cache error:', error);
    }
  },

  // Specialized methods for voice generation caching
  async cacheVoiceResult(key: string, value: any): Promise<void> {
    // Cache voice generation results for 24 hours
    await this.set(key, value, 86400);
  },

  async cacheVoicePreset(key: string, value: any): Promise<void> {
    // Cache voice presets for 7 days
    await this.set(key, value, 604800);
  },

  async cacheUserQuota(userId: string, quota: number): Promise<void> {
    // Cache user quotas for 1 hour
    await this.set(`user:${userId}:quota`, quota, 3600);
  }
}; 