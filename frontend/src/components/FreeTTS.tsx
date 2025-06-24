"use client"
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';

interface TTSProps {
  onAudioGenerated?: (audio: Blob) => void;
}

export default function FreeTTS({ onAudioGenerated }: TTSProps) {
  const [text, setText] = useState('');
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Load available voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      // Set default voice to first English voice found
      const englishVoice = availableVoices.find(v => v.lang.includes('en'));
      setVoice(englishVoice || availableVoices[0]);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = () => {
    if (!text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) utterance.voice = voice;
    utterance.pitch = pitch;
    utterance.rate = rate;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  // Record audio using MediaRecorder when browser TTS is playing
  const recordAudio = async () => {
    try {
      const audioContext = new AudioContext();
      const mediaStreamDestination = audioContext.createMediaStreamDestination();
      
      // Create audio element to play TTS
      const audio = new Audio();
      const source = audioContext.createMediaElementSource(audio);
      source.connect(mediaStreamDestination);
      source.connect(audioContext.destination);

      // Record the audio
      const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream);
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        if (onAudioGenerated) {
          onAudioGenerated(audioBlob);
        }
      };

      mediaRecorder.start();
      speak();

      // Stop recording after speech ends
      setTimeout(() => {
        mediaRecorder.stop();
      }, (text.length * 100) + 1000); // Rough estimate of speech duration
    } catch (error) {
      console.error('Error recording audio:', error);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium mb-2">Voice</label>
        <select
          className="w-full p-2 border rounded"
          value={voice?.name || ''}
          onChange={(e) => {
            const selectedVoice = voices.find(v => v.name === e.target.value);
            setVoice(selectedVoice || null);
          }}
        >
          {voices.map((v) => (
            <option key={v.name} value={v.name}>
              {v.name} ({v.lang})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Pitch</label>
        <Slider
          value={[pitch]}
          min={0.5}
          max={2}
          step={0.1}
          onValueChange={(values) => setPitch(values[0])}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Speed</label>
        <Slider
          value={[rate]}
          min={0.5}
          max={2}
          step={0.1}
          onValueChange={(values) => setRate(values[0])}
        />
      </div>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to speak..."
        rows={4}
      />

      <div className="flex space-x-2">
        <Button
          onClick={isPlaying ? stopSpeaking : speak}
          variant={isPlaying ? "destructive" : "default"}
        >
          {isPlaying ? 'Stop' : 'Speak'}
        </Button>

        <Button
          onClick={recordAudio}
          disabled={isPlaying || !text}
          variant="outline"
        >
          Record TTS
        </Button>
      </div>
    </div>
  );
} 