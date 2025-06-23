export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About VoiceGenerator
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Transforming the way content creators bring their words to life
        </p>
      </section>

      {/* Mission Section */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Mission</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          At VoiceGenerator, we're passionate about making professional voice content accessible to everyone. 
          Our platform combines cutting-edge AI technology with user-friendly design to help content creators, 
          educators, and businesses create high-quality voiceovers without the need for professional recording equipment or voice talent.
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          We believe that every story deserves to be heard, and we're here to help you tell yours.
        </p>
      </section>

      {/* Technology Section */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Technology</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Advanced AI Models</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We use state-of-the-art machine learning models to generate natural-sounding voices 
              that capture the nuances of human speech.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Multiple Languages</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our platform supports a wide range of languages and accents, making it perfect 
              for creating content for a global audience.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Cloud Infrastructure</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Built on reliable cloud infrastructure to ensure fast processing times and 
              high availability for all our users.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Use Cases</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Content Creators</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Perfect for YouTube videos, TikTok content, and social media posts.
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">E-Learning</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create engaging educational content with natural-sounding voiceovers.
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Business</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Professional voiceovers for presentations, advertisements, and training materials.
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Accessibility</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Make your content accessible to visually impaired audiences.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
} 