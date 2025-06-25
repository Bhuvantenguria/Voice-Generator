import { FastifyPluginAsync } from 'fastify';
import { UserController } from '../controllers/userController';
import { authenticate } from '../middlewares/auth';

const userController = new UserController();

const userRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/user/profile', userController.getProfile.bind(userController));
  fastify.patch('/user/profile', userController.updateProfile.bind(userController));
  fastify.get('/user/settings', userController.getSettings.bind(userController));
  fastify.patch('/user/settings', userController.updateSettings.bind(userController));
  fastify.get('/user/metrics', userController.getMetrics.bind(userController));
  fastify.post('/user/profile', userController.createProfile.bind(userController));
};

export default userRoutes;