import { FastifyInstance as BaseFastifyInstance } from 'fastify';

declare module 'fastify' {
  export interface FastifyInstance extends BaseFastifyInstance {
    addHook(name: string, hook: Function): void;
    get(path: string, handler: Function): void;
  }
}