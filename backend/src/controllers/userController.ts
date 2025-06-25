import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/userService';
import { BadRequestError } from '../utils/errors';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as any)?.id;
      if (!userId) throw new BadRequestError('User not authenticated');
      const profile = await this.userService.getProfile(userId);
      if (!profile) throw new BadRequestError('Profile not found');
      return reply.send(profile);
    } catch (error) {
      reply.status(400).send({ error: error instanceof Error ? error.message : 'Failed to fetch profile' });
    }
  }

  async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as any)?.id;
      const updates = request.body as any;
      if (!userId) throw new BadRequestError('User not authenticated');
      const updatedProfile = await this.userService.updateProfile(userId, updates);
      return reply.send(updatedProfile);
    } catch (error) {
      reply.status(400).send({ error: error instanceof Error ? error.message : 'Failed to update profile' });
    }
  }

  async getSettings(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as any)?.id;
      if (!userId) throw new BadRequestError('User not authenticated');
      const settings = await this.userService.getSettings(userId);
      return reply.send(settings);
    } catch (error) {
      reply.status(400).send({ error: error instanceof Error ? error.message : 'Failed to fetch settings' });
    }
  }

  async updateSettings(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as any)?.id;
      const updates = request.body as any;
      if (!userId) throw new BadRequestError('User not authenticated');
      const updatedSettings = await this.userService.updateSettings(userId, updates);
      return reply.send(updatedSettings);
    } catch (error) {
      reply.status(400).send({ error: error instanceof Error ? error.message : 'Failed to update settings' });
    }
  }

  async getMetrics(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as any)?.id;
      if (!userId) throw new BadRequestError('User not authenticated');
      const metrics = await this.userService.getMetrics(userId);
      return reply.send(metrics);
    } catch (error) {
      reply.status(400).send({ error: error instanceof Error ? error.message : 'Failed to fetch metrics' });
    }
  }

  async createProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as any)?.id;
      const profileData = request.body as any;
      if (!userId) throw new BadRequestError('User not authenticated');
      const profile = await this.userService.createInitialProfile(userId, profileData);
      return reply.status(201).send(profile);
    } catch (error) {
      reply.status(400).send({ error: error instanceof Error ? error.message : 'Failed to create profile' });
    }
  }
} 