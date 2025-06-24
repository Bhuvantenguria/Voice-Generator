'use client';

import { motion } from 'framer-motion';
import { Mic2, Sparkles, Zap, Users, Shield, Code2 } from 'lucide-react';

const features = [
  {
    icon: Mic2,
    title: 'Professional Voice Generation',
    description: 'Create high-quality, natural-sounding voices for your content using advanced AI technology.',
  },
  {
    icon: Sparkles,
    title: 'Voice Cloning',
    description: 'Clone any voice with just a few minutes of sample audio, perfect for personalized content.',
  },
  {
    icon: Zap,
    title: 'Real-time Processing',
    description: 'Generate and edit voices in real-time with our powerful cloud infrastructure.',
  },
  {
    icon: Users,
    title: 'Multiple Languages',
    description: 'Support for multiple languages and accents to reach a global audience.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your voice data is encrypted and protected with enterprise-grade security.',
  },
  {
    icon: Code2,
    title: 'Developer API',
    description: 'Integrate voice generation capabilities into your applications with our robust API.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          About VoiceGen
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Transform your content with AI-powered voice generation technology. Create natural, 
          expressive voices for any project with our cutting-edge platform.
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
              <div className="relative p-8 rounded-3xl border bg-card hover:bg-accent/50 transition-colors duration-300">
                <Icon className="h-12 w-12 text-primary mb-6" />
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center max-w-3xl mx-auto mt-20"
      >
        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Join thousands of content creators, developers, and businesses using VoiceGen 
          to create amazing voice content.
        </p>
        <a
          href="/generate"
          className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300"
        >
          Try VoiceGen Now
          <Zap className="ml-2 h-5 w-5" />
        </a>
      </motion.div>
    </div>
  );
} 