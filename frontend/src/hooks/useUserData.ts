import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { userApi } from '@/services/api'

interface UserProfile {
  defaultLanguage: string
  defaultVoice: string
  emailNotifications: boolean
  credits: number
  subscription: {
    plan: 'free' | 'pro' | 'enterprise'
    status: 'active' | 'inactive'
    nextBilling?: string
  }
}

export function useUserData() {
  const { user } = useUser()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await userApi.getProfile()
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      setError(null)
      const updatedProfile = await userApi.updateProfile(updates)
      setProfile(updatedProfile)
      return updatedProfile
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
      throw err
    }
  }

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refreshProfile: loadProfile,
  }
} 