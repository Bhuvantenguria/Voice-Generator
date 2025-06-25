import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { config } from 'dotenv';

config();

export const initializeFirebase = () => {
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: "shadow-voiceover",
          clientEmail: "firebase-adminsdk-fbsvc@shadow-voiceover.iam.gserviceaccount.com",
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        }),
        storageBucket: "shadow-voiceover.appspot.com"
      });

      // Configure Firestore
      const db = getFirestore();
      db.settings({
        ignoreUndefinedProperties: true,
        timestampsInSnapshots: true
      });

    } catch (error) {
      console.error('Firebase admin initialization error:', error);
      throw new Error('Failed to initialize Firebase Admin');
    }
  }
};

export const firestore = getFirestore();
export const storage = getStorage();

// Collection references
export const collections = {
  users: firestore.collection('users'),
  audioFiles: firestore.collection('audioFiles'),
  processedVoices: firestore.collection('processedVoices'),
  voicePresets: firestore.collection('voicePresets')
};

// Helper functions for common Firestore operations
export const firestoreUtils = {
  async createDocument(collection: string, data: any): Promise<string> {
    try {
      const docRef = await firestore.collection(collection).add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error creating document in ${collection}:`, error);
      throw error;
    }
  },

  async updateDocument(collection: string, docId: string, data: any): Promise<void> {
    try {
      await firestore.collection(collection).doc(docId).update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.error(`Error updating document ${docId} in ${collection}:`, error);
      throw error;
    }
  },

  async getDocument(collection: string, docId: string): Promise<FirebaseFirestore.DocumentData | null> {
    try {
      const doc = await firestore.collection(collection).doc(docId).get();
      return doc.exists ? doc.data() : null;
    } catch (error) {
      console.error(`Error fetching document ${docId} from ${collection}:`, error);
      throw error;
    }
  },

  async deleteDocument(collection: string, docId: string): Promise<void> {
    try {
      await firestore.collection(collection).doc(docId).delete();
    } catch (error) {
      console.error(`Error deleting document ${docId} from ${collection}:`, error);
      throw error;
    }
  },

  async queryDocuments(
    collection: string,
    conditions: Array<[string, FirebaseFirestore.WhereFilterOp, any]>,
    orderBy?: { field: string; direction: 'asc' | 'desc' },
    limit?: number
  ): Promise<FirebaseFirestore.DocumentData[]> {
    try {
      let query: FirebaseFirestore.Query = firestore.collection(collection);

      // Apply where conditions
      conditions.forEach(([field, operator, value]) => {
        query = query.where(field, operator, value);
      });

      // Apply ordering
      if (orderBy) {
        query = query.orderBy(orderBy.field, orderBy.direction);
      }

      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }

      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error querying documents from ${collection}:`, error);
      throw error;
    }
  }
};

// Storage references
export const getStorageFilePath = (userId: string, filename: string) => {
  return `audio/${userId}/${filename}`;
};

export const getVoiceModelPath = (userId: string, modelId: string) => {
  return `models/${userId}/${modelId}`;
}; 