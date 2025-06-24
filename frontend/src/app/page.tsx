'use client';

import { motion } from 'framer-motion';
import { Mic2, Wand2, Bot, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import FreeTTS from '@/components/FreeTTS';
import PremiumFeatures from '@/components/PremiumFeatures';

const fadeInUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-background blur-3xl" />
        <div className="container relative mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
            >
              Transform Your Voice with AI
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground mb-8"
            >
              Create natural, expressive voices for your content using cutting-edge 
              AI technology. Perfect for content creators, developers, and businesses.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link href="/generate">
                <Button size="lg" className="group">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-accent/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <motion.div
              variants={fadeInUp}
              className="p-6 rounded-2xl bg-card border hover:border-primary/50 transition-colors"
            >
              <Mic2 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Voice Generation</h3>
              <p className="text-muted-foreground">
                Generate natural-sounding voices in multiple languages and accents.
              </p>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="p-6 rounded-2xl bg-card border hover:border-primary/50 transition-colors"
            >
              <Wand2 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Voice Cloning</h3>
              <p className="text-muted-foreground">
                Clone any voice with just a few minutes of sample audio.
              </p>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="p-6 rounded-2xl bg-card border hover:border-primary/50 transition-colors"
            >
              <Bot className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Enhancement</h3>
              <p className="text-muted-foreground">
                Advanced AI processing for clear, emotion-rich voice output.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Free TTS Demo Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <motion.div variants={fadeInUp}>
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Try It Now</h2>
              <p className="text-lg text-muted-foreground">
                Experience the power of our voice generation technology with this free demo.
              </p>
            </motion.div>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <FreeTTS />
          </motion.div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-20 bg-accent/50">
        <div className="container mx-auto px-4">
          <PremiumFeatures />
        </div>
      </section>
    </div>
  );
} 