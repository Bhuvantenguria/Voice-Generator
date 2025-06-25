import { z } from 'zod';

export const UserSchema = {
  // Get Profile Schema
  getProfile: {
    response: {
      200: z.object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        country: z.string(),
        region: z.string(),
        purpose: z.enum(['personal', 'business', 'education', 'other']),
        language: z.string(),
        timezone: z.string(),
        preferences: z.object({
          defaultVoice: z.string(),
          defaultLanguage: z.string(),
          emailNotifications: z.boolean(),
          newsletter: z.boolean()
        }),
        usage: z.object({
          totalGenerations: z.number(),
          totalDuration: z.number(),
          lastUsed: z.date()
        }),
        subscription: z.object({
          plan: z.enum(['free', 'pro', 'enterprise']),
          status: z.enum(['active', 'inactive']),
          nextBilling: z.date().optional(),
          features: z.array(z.string())
        }),
        createdAt: z.date(),
        updatedAt: z.date()
      })
    }
  },

  // Update Profile Schema
  updateProfile: {
    body: z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      country: z.string().optional(),
      region: z.string().optional(),
      purpose: z.enum(['personal', 'business', 'education', 'other']).optional(),
      language: z.string().optional(),
      timezone: z.string().optional(),
      preferences: z.object({
        defaultVoice: z.string().optional(),
        defaultLanguage: z.string().optional(),
        emailNotifications: z.boolean().optional(),
        newsletter: z.boolean().optional()
      }).optional()
    }),
    response: {
      200: z.object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        country: z.string(),
        region: z.string(),
        purpose: z.enum(['personal', 'business', 'education', 'other']),
        language: z.string(),
        timezone: z.string(),
        preferences: z.object({
          defaultVoice: z.string(),
          defaultLanguage: z.string(),
          emailNotifications: z.boolean(),
          newsletter: z.boolean()
        }),
        usage: z.object({
          totalGenerations: z.number(),
          totalDuration: z.number(),
          lastUsed: z.date()
        }),
        subscription: z.object({
          plan: z.enum(['free', 'pro', 'enterprise']),
          status: z.enum(['active', 'inactive']),
          nextBilling: z.date().optional(),
          features: z.array(z.string())
        }),
        createdAt: z.date(),
        updatedAt: z.date()
      })
    }
  },

  // Get Settings Schema
  getSettings: {
    response: {
      200: z.object({
        theme: z.enum(['light', 'dark', 'system']),
        autoplay: z.boolean(),
        quality: z.enum(['low', 'medium', 'high']),
        saveHistory: z.boolean(),
        downloadFormat: z.enum(['mp3', 'wav'])
      })
    }
  },

  // Update Settings Schema
  updateSettings: {
    body: z.object({
      theme: z.enum(['light', 'dark', 'system']).optional(),
      autoplay: z.boolean().optional(),
      quality: z.enum(['low', 'medium', 'high']).optional(),
      saveHistory: z.boolean().optional(),
      downloadFormat: z.enum(['mp3', 'wav']).optional()
    }),
    response: {
      200: z.object({
        theme: z.enum(['light', 'dark', 'system']),
        autoplay: z.boolean(),
        quality: z.enum(['low', 'medium', 'high']),
        saveHistory: z.boolean(),
        downloadFormat: z.enum(['mp3', 'wav'])
      })
    }
  },

  // Get Metrics Schema
  getMetrics: {
    response: {
      200: z.object({
        totalVoiceGenerations: z.number(),
        totalAudioDuration: z.number(),
        averageQuality: z.number(),
        successRate: z.number(),
        mostUsedVoices: z.array(z.object({
          voiceId: z.string(),
          count: z.number()
        })),
        mostUsedEffects: z.array(z.object({
          effect: z.string(),
          count: z.number()
        })),
        usageByDay: z.array(z.object({
          date: z.string(),
          count: z.number(),
          duration: z.number()
        }))
      })
    }
  },

  // Create Profile Schema
  createProfile: {
    body: z.object({
      firstName: z.string(),
      lastName: z.string(),
      country: z.string(),
      region: z.string(),
      purpose: z.enum(['personal', 'business', 'education', 'other']),
      language: z.string(),
      timezone: z.string()
    }),
    response: {
      201: z.object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        country: z.string(),
        region: z.string(),
        purpose: z.enum(['personal', 'business', 'education', 'other']),
        language: z.string(),
        timezone: z.string(),
        preferences: z.object({
          defaultVoice: z.string(),
          defaultLanguage: z.string(),
          emailNotifications: z.boolean(),
          newsletter: z.boolean()
        }),
        usage: z.object({
          totalGenerations: z.number(),
          totalDuration: z.number(),
          lastUsed: z.date()
        }),
        subscription: z.object({
          plan: z.enum(['free', 'pro', 'enterprise']),
          status: z.enum(['active', 'inactive']),
          nextBilling: z.date().optional(),
          features: z.array(z.string())
        }),
        createdAt: z.date(),
        updatedAt: z.date()
      })
    }
  }
}; 