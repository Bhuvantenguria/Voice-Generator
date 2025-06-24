'use client'

import { useState } from 'react';
import { Button } from './ui/button';

const PREMIUM_FEATURES = [
  {
    name: 'Advanced Voice Cloning',
    price: 9.99,
    features: [
      'Clone any voice in minutes',
      'Unlimited voice storage',
      'Advanced emotion control',
      'Commercial usage rights'
    ]
  },
  {
    name: 'Professional API Access',
    price: 19.99,
    features: [
      'REST API access',
      '10,000 requests/month',
      'Developer documentation',
      'Technical support'
    ]
  },
  {
    name: 'Enterprise Solutions',
    price: 49.99,
    features: [
      'Custom voice training',
      'Batch processing',
      'Priority support',
      'Custom integrations'
    ]
  }
];

export default function PremiumFeatures() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (priceId: string) => {
    try {
      setLoading(true);
      
      // This will be implemented when we integrate Stripe
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
        }),
      });

      const session = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = session.url;
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to start subscription process. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {PREMIUM_FEATURES.map((tier) => (
        <div key={tier.name} className="bg-white rounded-lg shadow-xl p-6 text-gray-800">
          <h3 className="text-xl font-bold mb-4">{tier.name}</h3>
          <div className="text-3xl font-bold mb-6">
            ${tier.price}
            <span className="text-sm font-normal text-gray-600">/month</span>
          </div>
          <ul className="space-y-3 mb-8">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          <Button
            className="w-full"
            onClick={() => handleSubscribe(tier.name.toLowerCase().replace(' ', '-'))}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Join Waitlist'}
          </Button>
        </div>
      ))}
    </div>
  );
} 