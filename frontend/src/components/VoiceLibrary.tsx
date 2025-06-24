'use client'

import { useState } from 'react';
import { Button } from './ui/button';

interface SavedVoice {
  id: string;
  name: string;
  text: string;
  settings: {
    pitch: number;
    rate: number;
    volume: number;
  };
  createdAt: Date;
}

export default function VoiceLibrary() {
  const [savedVoices, setSavedVoices] = useState<SavedVoice[]>([]);

  // Load saved voices from localStorage on component mount
  useState(() => {
    const saved = localStorage.getItem('savedVoices');
    if (saved) {
      setSavedVoices(JSON.parse(saved));
    }
  });

  const deleteVoice = (id: string) => {
    const updated = savedVoices.filter(voice => voice.id !== id);
    setSavedVoices(updated);
    localStorage.setItem('savedVoices', JSON.stringify(updated));
  };

  if (savedVoices.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No saved voices yet. Create one using the voice generator!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {savedVoices.map((voice) => (
        <div key={voice.id} className="border rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{voice.name}</h3>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteVoice(voice.id)}
            >
              Delete
            </Button>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{voice.text}</p>
          <div className="text-xs text-gray-500">
            Created: {new Date(voice.createdAt).toLocaleDateString()}
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
            <div>Pitch: {voice.settings.pitch}</div>
            <div>Rate: {voice.settings.rate}</div>
            <div>Volume: {voice.settings.volume}</div>
          </div>
        </div>
      ))}
    </div>
  );
} 