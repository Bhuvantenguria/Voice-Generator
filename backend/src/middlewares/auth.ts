import { FastifyRequest, FastifyReply } from 'fastify';
import { BadRequestError } from '../utils/errors';

// Extend FastifyRequest to include user
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      email?: string;
      [key: string]: any;
    };
  }
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      reply.status(401).send({ error: 'No authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      reply.status(401).send({ error: 'No token provided' });
      return;
    }

    // Verify token and get user info
    // This is a placeholder - implement actual token verification
    const user = {
      id: '123',
      email: 'test@example.com'
    };

    // Attach user to request
    request.user = user;
  } catch (error) {
    reply.status(401).send({
      error: error instanceof BadRequestError ? error.message : 'Authentication failed'
    });
  }
} 