import * as admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';
import path from 'path';

const serviceAccount = require('../../firebase-credentials.json');

// Firebase initialization
const initializeFirebase = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: 'shadow-voiceover.appspot.com'
    });
  }

  const db = getFirestore();
  const storage = getStorage().bucket();

  return { db, storage };
};

// Initialize Firebase
const { db, storage } = initializeFirebase();

// Export the instances
export { db, storage };

// Collection references
export const collections = {
  users: db.collection('users'),
  voices: db.collection('voices'),
  audioFiles: db.collection('audioFiles'),
  voiceModels: db.collection('voiceModels'),
};

// Storage paths
export const storagePaths = {
  audioFiles: (userId: string, filename: string) => `audio/${userId}/${filename}`,
  voiceModels: (userId: string, modelId: string) => `models/${userId}/${modelId}`,
  tempFiles: (userId: string, filename: string) => `temp/${userId}/${filename}`,
};

// Firestore helper functions
export const createDocument = async <T extends Record<string, any>>(
  collection: string,
  data: T,
  id?: string
): Promise<string> => {
  const ref = id 
    ? db.collection(collection).doc(id)
    : db.collection(collection).doc();
  
  await ref.set({
    ...data,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return ref.id;
};

export const updateDocument = async <T extends Record<string, any>>(
  collection: string,
  id: string,
  data: Partial<T>
): Promise<void> => {
  await db.collection(collection).doc(id).update({
    ...data,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
};

export const deleteDocument = async (
  collection: string,
  id: string
): Promise<void> => {
  await db.collection(collection).doc(id).delete();
};

// Storage helper functions
export const uploadFile = async (
  buffer: Buffer,
  destination: string,
  metadata?: { [key: string]: string }
): Promise<string> => {
  const file = storage.file(destination);
  
  await file.save(buffer, {
    metadata: {
      contentType: 'audio/mpeg',
      ...metadata,
    },
  });

  return file.publicUrl();
};

export const deleteFile = async (destination: string): Promise<void> => {
  await storage.file(destination).delete();
};

export const getSignedUrl = async (
  destination: string,
  expiresIn = 3600
): Promise<string> => {
  const [url] = await storage.file(destination).getSignedUrl({
    action: 'read',
    expires: Date.now() + expiresIn * 1000,
  });
  return url;
}; 