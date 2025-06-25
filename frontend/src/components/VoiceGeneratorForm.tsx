'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { ApiService } from '@/services/api';
import { Loader2, Wand2, Volume2, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const voiceStyles = [
  { id: "natural", name: "Natural", description: "Perfect for casual content", icon: Volume2 },
  { id: "professional", name: "Professional", description: "Ideal for business", icon: Mic },
  { id: "energetic", name: "Energetic", description: "Great for ads", icon: Volume2 },
  { id: "calm", name: "Calm", description: "Perfect for meditation", icon: Volume2 },
];

export default function VoiceGeneratorForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<{
    id: string;
    url: string;
    name: string;
    duration?: number;
    format: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    text: "",
    voiceStyle: "natural",
    speed: 1,
    pitch: 1,
    volume: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await ApiService.generateAudio(formData.text, {
        speed: formData.speed,
        pitch: formData.pitch,
        volume: formData.volume * 100, // Convert to percentage
      });

      setGeneratedAudio(response.data);
      toast({
        title: "Success!",
        description: "Your audio has been generated successfully.",
      });
    } catch (error) {
      console.error("Audio generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate audio. Please try again.",
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
          className="h-32 resize-none"
          required
        />
      </div>

      <div className="space-y-4">
        <Label className="text-base">Voice Style</Label>
        <div className="grid grid-cols-2 gap-3">
          {voiceStyles.map((style) => {
            const Icon = style.icon;
            return (
              <motion.button
                key={style.id}
                type="button"
                onClick={() => setFormData({ ...formData, voiceStyle: style.id })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-lg border transition-all ${
                  formData.voiceStyle === style.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    formData.voiceStyle === style.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{style.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {style.description}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
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
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Slower</span>
            <span className="font-medium">{formData.speed}x</span>
            <span className="text-muted-foreground">Faster</span>
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
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Lower</span>
            <span className="font-medium">{formData.pitch}x</span>
            <span className="text-muted-foreground">Higher</span>
          </div>
        </div>

        <div className="space-y-4">
          <Label htmlFor="volume" className="text-base">Volume</Label>
          <div className="pt-2">
            <Slider
              id="volume"
              min={0}
              max={1}
              step={0.1}
              value={[formData.volume]}
              onValueChange={(value) => setFormData({ ...formData, volume: value[0] })}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Quiet</span>
            <span className="font-medium">{Math.round(formData.volume * 100)}%</span>
            <span className="text-muted-foreground">Loud</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {generatedAudio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-lg border bg-card space-y-4"
          >
            <div className="flex items-center justify-between">
              <Label className="text-base">Generated Audio</Label>
              <span className="text-sm text-muted-foreground">
                {generatedAudio.duration ? `${Math.round(generatedAudio.duration)}s` : 'Processing...'}
              </span>
            </div>
            <audio controls className="w-full">
              <source src={generatedAudio.url} type={`audio/${generatedAudio.format}`} />
              Your browser does not support the audio element.
            </audio>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{generatedAudio.name}</span>
              <span className="uppercase">{generatedAudio.format}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            Generate Audio
          </>
        )}
      </Button>
    </form>
  );
} 