import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { voiceoverRoutes } from './voiceover';
import { voiceCloningRoutes } from './voiceCloning';
import { animeDubRoutes } from './animeDub';
import audioRoutes from './audio';

async function routes(fastify: FastifyInstance) {
  // Register route plugins
  await fastify.register(voiceoverRoutes, { prefix: '/api/voiceover' });
  await fastify.register(voiceCloningRoutes, { prefix: '/api/voice-cloning' });
  await fastify.register(animeDubRoutes, { prefix: '/api/anime-dub' });
  await fastify.register(audioRoutes, { prefix: '/api/audio' });

  // Health check route
  fastify.get('/health', async () => {
    return { status: 'ok' };
  });
}

export const configureRoutes = fastifyPlugin(routes); 