'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { voiceApi } from '@/services/api';

const voiceStyles = [
  { id: "natural", name: "Natural", description: "Perfect for casual content" },
  { id: "professional", name: "Professional", description: "Ideal for business" },
  { id: "energetic", name: "Energetic", description: "Great for ads" },
  { id: "calm", name: "Calm", description: "Perfect for meditation" },
];

export default function VoiceGeneratorForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    text: "",
    voiceStyle: "natural",
    speed: 1,
    pitch: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await voiceApi.generate({
        text: formData.text,
        voiceStyle: formData.voiceStyle,
        speed: formData.speed,
        pitch: formData.pitch,
      });

      // Poll for status if the generation is async
      let status = await voiceApi.getGenerationStatus(response.id);
      while (status.status === "processing") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        status = await voiceApi.getGenerationStatus(response.id);
      }

      if (status.status === "completed") {
        setGeneratedAudio(status.url);
        toast({
          title: "Success!",
          description: "Your voice has been generated successfully.",
        });
      } else {
        throw new Error("Voice generation failed");
      }
    } catch (error) {
      console.error("Voice generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate voice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="text" className="text-base">Text to Convert</Label>
        <Textarea
          id="text"
          placeholder="Enter the text you want to convert to speech..."
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          className="h-32 resize-none transition-colors focus:border-blue-500 dark:focus:border-blue-400"
          required
        />
      </div>

      <div className="space-y-4">
        <Label className="text-base">Voice Style</Label>
        <div className="grid grid-cols-2 gap-3">
          {voiceStyles.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => setFormData({ ...formData, voiceStyle: style.id })}
              className={`p-3 rounded-lg border-2 transition-all ${
                formData.voiceStyle === style.id
                  ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800"
              }`}
            >
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">
                  {style.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {style.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="speed" className="text-base">Speed</Label>
          <div className="pt-2">
            <Slider
              id="speed"
              min={0.5}
              max={2}
              step={0.1}
              value={[formData.speed]}
              onValueChange={(value) => setFormData({ ...formData, speed: value[0] })}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Slower</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formData.speed}x
            </span>
            <span className="text-gray-500 dark:text-gray-400">Faster</span>
          </div>
        </div>

        <div className="space-y-4">
          <Label htmlFor="pitch" className="text-base">Pitch</Label>
          <div className="pt-2">
            <Slider
              id="pitch"
              min={0.5}
              max={2}
              step={0.1}
              value={[formData.pitch]}
              onValueChange={(value) => setFormData({ ...formData, pitch: value[0] })}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Lower</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formData.pitch}x
            </span>
            <span className="text-gray-500 dark:text-gray-400">Higher</span>
          </div>
        </div>
      </div>

      {generatedAudio && (
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <Label className="text-base mb-2 block">Generated Audio</Label>
          <audio controls className="w-full">
            <source src={generatedAudio} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <Button
        type="submit"
        variant="gradient"
        size="lg"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Generating...</span>
          </div>
        ) : (
          "Generate Voice"
        )}
      </Button>
    </form>
  );
} 