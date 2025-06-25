import { FastifyRequest, FastifyReply } from 'fastify';
import { redis } from '../config/redis';

const WINDOW_SIZE_IN_SECONDS = parseInt(process.env.RATE_LIMIT_WINDOW || '3600');
const MAX_REQUESTS_PER_WINDOW = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');

export async function rateLimiter(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = request.user?.id || request.ip;
    const key = `ratelimit:${userId}`;

    // Get the current count
    const currentCount = await redis.get(key);
    
    if (!currentCount) {
      // First request, set initial count
      await redis.setex(key, WINDOW_SIZE_IN_SECONDS, 1);
      return;
    }

    const count = parseInt(currentCount);
    
    if (count >= MAX_REQUESTS_PER_WINDOW) {
      throw new Error('Rate limit exceeded');
    }

    // Increment the counter
    await redis.incr(key);

  } catch (error) {
    if (error.message === 'Rate limit exceeded') {
      reply.status(429).send({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.'
      });
    } else {
      console.error('Rate limiter error:', error);
      // Continue even if Redis fails
    }
  }
} 