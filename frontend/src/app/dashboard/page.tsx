'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Voiceover {
  id: string
  text: string
  language: string
  voice: string
  createdAt: string
  audioUrl: string
  status: 'completed' | 'processing' | 'failed'
}

const mockVoiceovers: Voiceover[] = [
  {
    id: '1',
    text: "Welcome to our platform! We're excited to have you here.",
    language: 'English (US)',
    voice: 'Emma',
    createdAt: '2024-03-22T10:30:00Z',
    audioUrl: 'https://example.com/audio1.mp3',
    status: 'completed',
  },
  {
    id: '2',
    text: 'This is a sample voiceover for demonstration purposes.',
    language: 'English (US)',
    voice: 'James',
    createdAt: '2024-03-22T09:15:00Z',
    audioUrl: 'https://example.com/audio2.mp3',
    status: 'completed',
  },
]

export default function DashboardPage() {
  const [voiceovers] = useState<Voiceover[]>(mockVoiceovers)
  const [selectedVoiceover, setSelectedVoiceover] = useState<Voiceover | null>(null)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Voiceovers</h1>
        <Link
          href="/generate"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Create New
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {voiceovers.map((voiceover) => (
          <div
            key={voiceover.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm cursor-pointer hover:shadow-md transition"
            onClick={() => setSelectedVoiceover(voiceover)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                  {voiceover.text}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(voiceover.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  voiceover.status === 'completed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : voiceover.status === 'processing'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}
              >
                {voiceover.status.charAt(0).toUpperCase() + voiceover.status.slice(1)}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400 w-20">Language:</span>
                <span className="text-gray-900 dark:text-white">{voiceover.language}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400 w-20">Voice:</span>
                <span className="text-gray-900 dark:text-white">{voiceover.voice}</span>
              </div>
            </div>

            {voiceover.status === 'completed' && (
              <div className="mt-4">
                <audio controls className="w-full">
                  <source src={voiceover.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="px-3 py-1 text-sm bg-gray-100 text-gray-900 rounded hover:bg-gray-200 transition dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                onClick={(e) => {
                  e.stopPropagation()
                  // TODO: Implement download functionality
                }}
              >
                Download
              </button>
              <button
                className="px-3 py-1 text-sm bg-red-100 text-red-900 rounded hover:bg-red-200 transition dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800"
                onClick={(e) => {
                  e.stopPropagation()
                  // TODO: Implement delete functionality
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {voiceovers.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No voiceovers yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first voiceover to get started
          </p>
          <Link
            href="/generate"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-block"
          >
            Create Voiceover
          </Link>
        </div>
      )}
    </div>
  )
} 