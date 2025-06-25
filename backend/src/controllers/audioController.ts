import { FastifyRequest, FastifyReply } from 'fastify';
import { AudioService } from '../services/audioService';
import { QuotaService } from '../services/quotaService';
import { BadRequestError } from '../utils/errors';

export class AudioController {
  private audioService: AudioService;
  private quotaService: QuotaService;

  constructor() {
    this.audioService = new AudioService();
    this.quotaService = new QuotaService();
  }

  async generateAudio(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { text, voice, settings } = request.body as any;
      const userId = request.user?.id;

      if (!userId) {
        throw new BadRequestError('User not authenticated');
      }

      // Check quota
      await this.quotaService.checkGenerationQuota(userId);

      // Generate audio
      const audio = await this.audioService.generateAudio(text, voice, settings);

      return reply.send(audio);
    } catch (error) {
      reply.status(400).send({
        error: error instanceof Error ? error.message : 'Failed to generate audio'
      });
    }
  }

  async getAudioList(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      if (!userId) {
        throw new BadRequestError('User not authenticated');
      }

      const audioList = await this.audioService.getAudioList(userId);
      return reply.send(audioList);
    } catch (error) {
      reply.status(400).send({
        error: error instanceof Error ? error.message : 'Failed to get audio list'
      });
    }
  }

  async deleteAudio(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const userId = request.user?.id;

      if (!userId) {
        throw new BadRequestError('User not authenticated');
      }

      await this.audioService.deleteAudio(id, userId);
      return reply.send({ success: true });
    } catch (error) {
      reply.status(400).send({
        error: error instanceof Error ? error.message : 'Failed to delete audio'
      });
    }
  }

  async transformAudio(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { audioId, effects } = request.body as any;
      const userId = request.user?.id;

      if (!userId) {
        throw new BadRequestError('User not authenticated');
      }

      // Check quota
      await this.quotaService.checkTransformationQuota(userId);

      // Transform audio
      const transformedAudio = await this.audioService.transformAudio(audioId, effects, userId);

      return reply.send(transformedAudio);
    } catch (error) {
      reply.status(400).send({
        error: error instanceof Error ? error.message : 'Failed to transform audio'
      });
    }
  }
} 