'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'

type Subscription = {
  plan: 'free' | 'pro' | 'enterprise'
  status: 'active' | 'inactive'
  nextBilling?: string
  features: string[]
}

export default function ProfilePage() {
  const { user } = useUser()
  
  const [subscription] = useState<Subscription>({
    plan: 'free',
    status: 'active',
    features: [
      '100 minutes per month',
      'Basic voices',
      'Standard quality',
      'Email support'
    ]
  })

  const [settings] = useState({
    emailNotifications: true,
    defaultLanguage: 'en-US',
    defaultVoice: 'professional-female',
  })

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Profile */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Information</h2>
            
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-2xl mr-4">
                {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress[0]?.toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-gray-600">{user?.emailAddresses[0]?.emailAddress}</p>
                <p className="text-sm text-gray-500">Member since {new Date(user?.createdAt || '').toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Language
                </label>
                <select
                  value={settings.defaultLanguage}
                  className="input-field"
                  disabled
                >
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Spanish (Spain)</option>
                  <option value="fr-FR">French (France)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Voice
                </label>
                <select
                  value={settings.defaultVoice}
                  className="input-field"
                  disabled
                >
                  <option value="professional-female">Professional Female</option>
                  <option value="professional-male">Professional Male</option>
                  <option value="casual-female">Casual Female</option>
                  <option value="casual-male">Casual Male</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300"
                  disabled
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Receive email notifications
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Info */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription</h2>
            
            <div className="mb-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {subscription.status === 'active' ? 'Active' : 'Inactive'}
              </span>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan
              </p>
              {subscription.nextBilling && (
                <p className="text-sm text-gray-500">
                  Next billing date: {new Date(subscription.nextBilling).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Features included:</h3>
              <ul className="space-y-2">
                {subscription.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button
              className="mt-6 w-full btn-primary"
              onClick={() => window.alert('Upgrade feature coming soon!')}
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 