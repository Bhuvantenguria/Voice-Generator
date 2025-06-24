import { createContainer, asClass, asFunction, asValue, InjectionMode } from 'awilix';
import { createClient } from '@supabase/supabase-js';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { Analytics, getAnalytics } from 'firebase/analytics';
import { Performance, getPerformance } from 'firebase/performance';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { VoiceProcessingService } from '@/services/voiceProcessing';
import { AudioAnalysisService } from '@/services/audioAnalysis';
import { QualityAssuranceService } from '@/services/qualityAssurance';
import { MetricsService } from '@/services/metrics';

// Advanced Dependency Injection Container
export const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

// Firebase Configuration with Performance Monitoring
const initializeFirebase = (): { app: FirebaseApp; analytics: Analytics; performance: Performance } => {
  const app = initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  });

  const analytics = getAnalytics(app);
  const performance = getPerformance(app);

  return { app, analytics, performance };
};

// Advanced Redux Store with RTK Query
export const store = configureStore({
  reducer: {
    // Add reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: true,
    }),
});

setupListeners(store.dispatch);

// Service Registration
container.register({
  // Core Services
  firebase: asFunction(initializeFirebase).singleton(),
  supabase: asFunction(() => 
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  ).singleton(),

  // Business Logic Services
  voiceProcessing: asClass(VoiceProcessingService).scoped(),
  audioAnalysis: asClass(AudioAnalysisService).scoped(),
  qualityAssurance: asClass(QualityAssuranceService).scoped(),
  metrics: asClass(MetricsService).singleton(),

  // Configuration
  config: asValue({
    processing: {
      maxConcurrent: 3,
      chunkSize: 1024 * 1024, // 1MB
      supportedFormats: ['mp4', 'mkv', 'webm'],
      maxDuration: 60 * 60, // 1 hour
    },
    audio: {
      sampleRate: 48000,
      channels: 2,
      bitDepth: 16,
    },
    ml: {
      batchSize: 32,
      epochs: 100,
      learningRate: 0.001,
    },
    cache: {
      ttl: 60 * 60 * 24, // 24 hours
      maxSize: 1000,
    },
  }),
});

// Type definitions for dependency injection
export type AppContainer = typeof container;
export type AppServices = {
  firebase: ReturnType<typeof initializeFirebase>;
  voiceProcessing: VoiceProcessingService;
  audioAnalysis: AudioAnalysisService;
  qualityAssurance: QualityAssuranceService;
  metrics: MetricsService;
};

// Export typed hooks for service access
export const useService = <K extends keyof AppServices>(
  service: K
): AppServices[K] => {
  return container.resolve(service);
}; 