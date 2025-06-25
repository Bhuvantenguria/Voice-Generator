import { Type } from '@sinclair/typebox';
import { z } from 'zod';

export const AudioSchema = {
  // Upload Audio Schema
  upload: {
    consumes: ['multipart/form-data'],
    body: Type.Object({
      file: Type.Any(),
    }),
    response: {
      201: Type.Object({
        id: Type.String(),
        url: Type.String(),
        name: Type.String(),
        duration: Type.Optional(Type.Number()),
        format: Type.String(),
      }),
    },
  },

  // Transform Audio Schema
  transform: {
    params: Type.Object({
      id: Type.String(),
    }),
    body: Type.Object({
      pitch: Type.Optional(Type.Number({
        minimum: -100,
        maximum: 100,
      })),
      speed: Type.Optional(Type.Number({
        minimum: 0.5,
        maximum: 2.0,
      })),
      volume: Type.Optional(Type.Number({
        minimum: -100,
        maximum: 400,
      })),
    }),
    response: {
      200: Type.Object({
        id: Type.String(),
        url: Type.String(),
        name: Type.String(),
        duration: Type.Optional(Type.Number()),
        format: Type.String(),
      }),
    },
  },

  // Delete Audio Schema
  delete: {
    params: Type.Object({
      id: Type.String(),
    }),
    response: {
      204: Type.Null(),
    },
  },

  // List User's Audios Schema
  list: {
    response: {
      200: Type.Array(Type.Object({
        id: Type.String(),
        userId: Type.String(),
        name: Type.String(),
        url: Type.String(),
        duration: Type.Optional(Type.Number()),
        format: Type.String(),
        bytes: Type.Optional(Type.Number()),
        transformations: Type.Optional(Type.Object({
          pitch: Type.Optional(Type.Number()),
          speed: Type.Optional(Type.Number()),
          volume: Type.Optional(Type.Number()),
        })),
        createdAt: Type.Optional(Type.String()),
        updatedAt: Type.Optional(Type.String()),
      })),
    },
  },
};

// Define the effects schema separately for better organization
const effectsSchema = z.object({
  reverb: z.object({
    enabled: z.boolean(),
    decay: z.number().min(0).max(100).nullish()
  })
    .refine(
      (data) => !data.enabled || data.decay !== undefined,
      { message: 'Decay is required when reverb is enabled' }
    )
    .optional(),
  echo: z.object({
    enabled: z.boolean(),
    delay: z.number().min(0).max(1000).nullish(),
    feedback: z.number().min(0).max(1).nullish()
  })
    .refine(
      (data) => !data.enabled || (data.delay !== undefined && data.feedback !== undefined),
      { message: 'Delay and feedback are required when echo is enabled' }
    )
    .optional(),
  chorus: z.object({
    enabled: z.boolean()
  }).optional()
});

export const audioSchema = {
  generateVoice: z.object({
    text: z.string()
      .min(1, 'Text is required')
      .max(1000, 'Text cannot exceed 1000 characters'),
    transformation: z.object({
      pitch: z.number()
        .min(-100, 'Pitch must be between -100 and 100')
        .max(100, 'Pitch must be between -100 and 100')
        .optional(),
      speed: z.number()
        .min(0.1, 'Speed must be between 0.1 and 3')
        .max(3, 'Speed must be between 0.1 and 3')
        .optional(),
      volume: z.number()
        .min(-50, 'Volume must be between -50 and 50')
        .max(50, 'Volume must be between -50 and 50')
        .optional(),
      emotions: z.object({
        happiness: z.number().min(0).max(1),
        sadness: z.number().min(0).max(1),
        anger: z.number().min(0).max(1),
        fear: z.number().min(0).max(1)
      }).optional(),
      characteristics: z.object({
        age: z.number().min(0).max(100).optional(),
        gender: z.number().min(-100).max(100).optional(),
        accent: z.string().optional()
      }).optional(),
      effects: effectsSchema.optional()
    }).optional()
  }),

  updateAudio: z.object({
    name: z.string()
      .min(1, 'Name is required')
      .max(100, 'Name cannot exceed 100 characters')
      .optional(),
    description: z.string()
      .max(500, 'Description cannot exceed 500 characters')
      .optional(),
    tags: z.array(z.string())
      .max(10, 'Cannot have more than 10 tags')
      .optional()
  })
};

// Export types generated from the schema
export type GenerateVoiceInput = z.infer<typeof audioSchema.generateVoice>;
export type UpdateAudioInput = z.infer<typeof audioSchema.updateAudio>; 