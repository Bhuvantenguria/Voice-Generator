'use client'

import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';

interface VoiceSettings {
  pitch: number;
  rate: number;
  volume: number;
}

export default function VoiceGenerator() {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [settings, setSettings] = useState<VoiceSettings>({
    pitch: 1,
    rate: 1,
    volume: 1,
  });
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  // Browser's built-in TTS
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  const generateVoice = async () => {
    if (!text) {
      toast({
        title: 'Error',
        description: 'Please enter some text',
        variant: 'destructive',
      });
      return;
    }

    if (!synth) {
      toast({
        title: 'Error',
        description: 'Speech synthesis is not supported in your browser',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Create utterance with settings
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = settings.pitch;
      utterance.rate = settings.rate;
      utterance.volume = settings.volume;

      // Get available voices
      const voices = synth.getVoices();
      if (voices.length) {
        utterance.voice = voices[0]; // Default to first voice
      }

      // Speak the text
      synth.speak(utterance);

      // Handle completion
      utterance.onend = () => {
        setIsGenerating(false);
        toast({
          title: 'Success',
          description: 'Voice generated successfully!',
        });
      };

      // Handle errors
      utterance.onerror = (error) => {
        console.error('TTS Error:', error);
        setIsGenerating(false);
        toast({
          title: 'Error',
          description: 'Failed to generate voice',
          variant: 'destructive',
        });
      };
    } catch (error) {
      console.error('Error:', error);
      setIsGenerating(false);
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  const saveAudio = () => {
    // Implementation for saving audio will be added
    toast({
      title: 'Coming Soon',
      description: 'Save feature will be available soon!',
    });
  };

  const shareAudio = () => {
    // Implementation for sharing audio will be added
    toast({
      title: 'Coming Soon',
      description: 'Share feature will be available soon!',
    });
  };

  return (
    <div className="space-y-6 p-4">
      {/* Text Input */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Enter Text
        </label>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert to speech..."
          className="w-full"
        />
      </div>

      {/* Voice Settings */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Pitch: {settings.pitch}
          </label>
          <Slider
            value={[settings.pitch]}
            min={0.5}
            max={2}
            step={0.1}
            onValueChange={([pitch]) => 
              setSettings(prev => ({ ...prev, pitch }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Speed: {settings.rate}
          </label>
          <Slider
            value={[settings.rate]}
            min={0.5}
            max={2}
            step={0.1}
            onValueChange={([rate]) => 
              setSettings(prev => ({ ...prev, rate }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Volume: {settings.volume}
          </label>
          <Slider
            value={[settings.volume]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={([volume]) => 
              setSettings(prev => ({ ...prev, volume }))
            }
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={generateVoice}
          disabled={isGenerating || !text}
          className="flex-1"
        >
          {isGenerating ? 'Generating...' : 'Generate Voice'}
        </Button>

        <Button
          onClick={saveAudio}
          variant="outline"
          disabled={isGenerating}
        >
          Save
        </Button>

        <Button
          onClick={shareAudio}
          variant="outline"
          disabled={isGenerating}
        >
          Share
        </Button>
      </div>

      {/* Audio Preview */}
      <audio ref={audioRef} controls className="w-full mt-4" />
    </div>
  );
} 