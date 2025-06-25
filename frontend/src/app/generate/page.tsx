'use client';

import VoiceGeneratorForm from "@/components/VoiceGeneratorForm";
import { Wand2, Lightbulb, Music2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GeneratePage() {
  return (
    <div className="container max-w-6xl py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent"
        >
          Generate Audio
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground"
        >
          Transform your text into natural-sounding voices using our advanced AI technology.
        </motion.p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Generator Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-lg border overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wand2 className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Voice Generator</h2>
            </div>
            <VoiceGeneratorForm />
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Quick Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-lg border p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Lightbulb className="h-6 w-6 text-yellow-500" />
              </div>
              <h2 className="text-2xl font-semibold">Quick Tips</h2>
            </div>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start space-x-3">
                <span className="text-yellow-500">•</span>
                <span>Keep sentences clear and concise for better voice generation</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-yellow-500">•</span>
                <span>Use proper punctuation to help with natural pauses</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-yellow-500">•</span>
                <span>Consider the context and emotion you want to convey</span>
              </li>
            </ul>
          </motion.div>

          {/* Voice Styles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-lg border p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Music2 className="h-6 w-6 text-purple-500" />
              </div>
              <h2 className="text-2xl font-semibold">Voice Styles</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-medium mb-1">Natural</h3>
                <p className="text-sm text-muted-foreground">Perfect for casual content</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-medium mb-1">Professional</h3>
                <p className="text-sm text-muted-foreground">Ideal for business</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-medium mb-1">Energetic</h3>
                <p className="text-sm text-muted-foreground">Great for ads</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-medium mb-1">Calm</h3>
                <p className="text-sm text-muted-foreground">Perfect for meditation</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 