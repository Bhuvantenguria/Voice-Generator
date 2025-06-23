'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const voiceSchema = z.object({
  text: z.string().min(1, 'Text is required').max(5000, 'Text must be less than 5000 characters'),
  language: z.string().min(1, 'Language is required'),
  voice: z.string().min(1, 'Voice is required'),
  speed: z.number().min(0.5).max(2),
  pitch: z.number().min(-20).max(20),
})

type VoiceFormData = z.infer<typeof voiceSchema>

const languages = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'es-ES', label: 'Spanish' },
  { value: 'fr-FR', label: 'French' },
  { value: 'de-DE', label: 'German' },
]

const voices = [
  { value: 'voice1', label: 'Emma (Female)' },
  { value: 'voice2', label: 'James (Male)' },
  { value: 'voice3', label: 'Sophie (Female)' },
  { value: 'voice4', label: 'Michael (Male)' },
]

export default function GeneratePage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<VoiceFormData>({
    resolver: zodResolver(voiceSchema),
    defaultValues: {
      speed: 1,
      pitch: 0,
    },
  })

  const onSubmit = async (data: VoiceFormData) => {
    setIsGenerating(true)
    try {
      // TODO: Implement API call to generate voice
      console.log('Generating voice with data:', data)
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulated delay
      setAudioUrl('https://example.com/sample.mp3') // Replace with actual generated audio URL
    } catch (error) {
      console.error('Error generating voice:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Generate Voice
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Text Input */}
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Text to Convert
            </label>
            <textarea
              id="text"
              rows={5}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter the text you want to convert to speech..."
              {...register('text')}
            />
            {errors.text && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.text.message}</p>
            )}
          </div>

          {/* Language Selection */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                id="language"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...register('language')}
              >
                <option value="">Select Language</option>
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
              {errors.language && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.language.message}</p>
              )}
            </div>

            {/* Voice Selection */}
            <div>
              <label htmlFor="voice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Voice
              </label>
              <select
                id="voice"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...register('voice')}
              >
                <option value="">Select Voice</option>
                {voices.map(voice => (
                  <option key={voice.value} value={voice.value}>
                    {voice.label}
                  </option>
                ))}
              </select>
              {errors.voice && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.voice.message}</p>
              )}
            </div>
          </div>

          {/* Speed and Pitch Controls */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="speed" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Speed (0.5x - 2x)
              </label>
              <input
                type="range"
                id="speed"
                min="0.5"
                max="2"
                step="0.1"
                className="w-full"
                {...register('speed', { valueAsNumber: true })}
              />
            </div>
            <div>
              <label htmlFor="pitch" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pitch (-20 to +20)
              </label>
              <input
                type="range"
                id="pitch"
                min="-20"
                max="20"
                className="w-full"
                {...register('pitch', { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : 'Generate Voice'}
            </button>
          </div>
        </form>

        {/* Audio Preview */}
        {audioUrl && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Preview</h2>
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </div>
  )
} 