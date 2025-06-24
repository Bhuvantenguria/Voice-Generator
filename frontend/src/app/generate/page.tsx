import VoiceGeneratorForm from "@/components/VoiceGeneratorForm";

export const metadata = {
  title: "Generate Voice | Voice Generator",
  description: "Generate AI voiceovers with custom voice cloning and script optimization",
};

export default function GeneratePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Generate Voice
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Transform your text into natural-sounding voices using our advanced AI technology.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Voice Generator</h2>
            </div>
            <VoiceGeneratorForm />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Quick Tips</h2>
            </div>
            <ul className="space-y-4 text-gray-600 dark:text-gray-300">
              <li className="flex items-start space-x-3">
                <span className="text-green-500">•</span>
                <span>Keep sentences clear and concise for better voice generation</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-500">•</span>
                <span>Use proper punctuation to help with natural pauses</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-500">•</span>
                <span>Consider the context and emotion you want to convey</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Voice Styles</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Natural</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Perfect for casual content</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Professional</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ideal for business</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Energetic</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Great for ads</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Calm</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Perfect for meditation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 