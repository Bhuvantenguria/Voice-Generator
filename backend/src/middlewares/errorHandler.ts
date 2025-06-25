import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { BadRequestError } from '../utils/errors';

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  // Log the error
  request.log.error(error);

  // Handle different types of errors
  if (error.statusCode) {
    return reply.status(error.statusCode).send({
      error: error.message
    });
  }

  // Default error response
  return reply.status(500).send({
    error: 'Internal Server Error'
  });
}; 