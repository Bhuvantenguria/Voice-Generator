import { db, storage, collections } from '../lib/firebase';

describe('Firebase Connection', () => {
  test('should connect to Firestore', async () => {
    try {
      const snapshot = await collections.users.limit(1).get();
      expect(snapshot).toBeDefined();
      console.log('✅ Firestore connection successful');
    } catch (error) {
      console.error('❌ Firestore connection failed:', error);
      throw error;
    }
  });

  test('should connect to Storage', async () => {
    try {
      const [files] = await storage.getFiles({ maxResults: 1 });
      expect(files).toBeDefined();
      console.log('✅ Storage connection successful');
    } catch (error) {
      console.error('❌ Storage connection failed:', error);
      throw error;
    }
  });
}); 