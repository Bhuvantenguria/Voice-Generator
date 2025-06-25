import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { firestore } from './firebase';
import { logger } from '../utils/logger';

export const initializeDatabase = async () => {
  try {
    // Configure Firestore settings
    firestore.settings({
      ignoreUndefinedProperties: true,
      timestampsInSnapshots: true
    });

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Export collections for easy access
export const collections = {
  users: firestore.collection('users'),
  audioFiles: firestore.collection('audioFiles'),
  processedVoices: firestore.collection('processedVoices'),
  voicePresets: firestore.collection('voicePresets')
};

async function databaseConnector(fastify: FastifyInstance) {
  try {
    await initializeDatabase();
    fastify.log.info('Connected to Firestore');

    // Close connections when the server is shutting down
    fastify.addHook('onClose', async (instance) => {
      // No need to close Firestore connection as it's managed by the SDK
      instance.log.info('Firestore connection closed');
    });

    process.on('SIGINT', async () => {
      try {
        // No need to close Firestore connection as it's managed by the SDK
        logger.info('Firestore connection closed through app termination');
        process.exit(0);
      } catch (error) {
        logger.error('Error while closing Firestore connection:', error);
        process.exit(1);
      }
    });
  } catch (error) {
    fastify.log.error('Error connecting to database:', error);
    throw error;
  }
}

export const configureDatabases = fastifyPlugin(databaseConnector); 