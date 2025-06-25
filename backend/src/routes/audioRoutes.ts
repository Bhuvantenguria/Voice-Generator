import { FastifyPluginAsync } from 'fastify';
import { AudioController } from '../controllers/audioController';

const audioRoutes: FastifyPluginAsync = async (fastify) => {
  const audioController = new AudioController();

  fastify.post('/audio/generate', async (request, reply) => {
    return audioController.generateAudio(request, reply);
  });

  fastify.get('/audio/list', async (request, reply) => {
    return audioController.getAudioList(request, reply);
  });

  fastify.delete('/audio/:id', async (request, reply) => {
    return audioController.deleteAudio(request, reply);
  });

  fastify.post('/audio/transform', async (request, reply) => {
    return audioController.transformAudio(request, reply);
  });
};

export default audioRoutes;