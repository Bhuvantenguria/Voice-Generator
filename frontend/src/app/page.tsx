import Link from 'next/link'
import { SignedIn, SignedOut } from '@clerk/nextjs'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-6">
        🎙️ AI Voiceover Generator
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Create professional voiceovers for your Reels & Shorts in seconds using advanced AI technology.
        Multiple languages, voices, and styles available.
      </p>
      
      <div className="flex gap-4">
        <SignedIn>
          <Link 
            href="/generate" 
            className="btn-primary"
          >
            Start Generating
          </Link>
          <Link 
            href="/dashboard" 
            className="btn-secondary"
          >
            View Dashboard
          </Link>
        </SignedIn>
        <SignedOut>
          <Link 
            href="/sign-up" 
            className="btn-primary"
          >
            Get Started
          </Link>
          <Link 
            href="/about" 
            className="btn-secondary"
          >
            Learn More
          </Link>
        </SignedOut>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <FeatureCard
          title="Multiple Languages"
          description="Generate voiceovers in various languages and accents for global reach."
          icon="🌍"
        />
        <FeatureCard
          title="Expressive Tones"
          description="Choose from different emotional styles and tones to match your content."
          icon="🎭"
        />
        <FeatureCard
          title="Quick Export"
          description="Download your voiceovers instantly in high-quality audio formats."
          icon="⚡"
        />
      </div>

      <div className="mt-16 bg-primary-50 w-full py-12 rounded-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <StepCard
            number={1}
            title="Sign Up"
            description="Create your account in seconds"
          />
          <StepCard
            number={2}
            title="Write Text"
            description="Enter or paste your script"
          />
          <StepCard
            number={3}
            title="Choose Voice"
            description="Select language and style"
          />
          <StepCard
            number={4}
            title="Generate"
            description="Get your voiceover instantly"
          />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
} 