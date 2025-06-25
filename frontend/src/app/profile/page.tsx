"use client"

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { ApiService } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Save, RefreshCw, Crown } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProfilePage() {
  const { user } = useUser()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [metrics, setMetrics] = useState<any>(null)

  useEffect(() => {
    if (user) {
      loadProfile()
      loadMetrics()
    }
  }, [user])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const response = await ApiService.getProfile()
      setProfile(response.data)
    } catch (error) {
      console.error('Failed to load profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const loadMetrics = async () => {
    try {
      const response = await ApiService.getMetrics()
      setMetrics(response.data)
    } catch (error) {
      console.error('Failed to load metrics:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    try {
      setSaving(true)
      await ApiService.updateProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        country: profile.country,
        region: profile.region,
        purpose: profile.purpose,
        language: profile.language,
        timezone: profile.timezone,
        preferences: profile.preferences
      })
      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      })
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Profile Not Found</h2>
          <p className="text-muted-foreground">Unable to load your profile information.</p>
          <Button onClick={loadProfile}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={loadProfile}
          className="hover:animate-spin"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={profile.firstName || ''}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={profile.lastName || ''}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={profile.country || ''}
              onChange={(e) => setProfile({ ...profile, country: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Input
              id="region"
              value={profile.region || ''}
              onChange={(e) => setProfile({ ...profile, region: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Input
              id="language"
              value={profile.language || ''}
              onChange={(e) => setProfile({ ...profile, language: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input
              id="timezone"
              value={profile.timezone || ''}
              onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Preferences</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="defaultVoice">Default Voice</Label>
              <Input
                id="defaultVoice"
                value={profile.preferences?.defaultVoice || ''}
                onChange={(e) => setProfile({
                  ...profile,
                  preferences: { ...profile.preferences, defaultVoice: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultLanguage">Default Language</Label>
              <Input
                id="defaultLanguage"
                value={profile.preferences?.defaultLanguage || ''}
                onChange={(e) => setProfile({
                  ...profile,
                  preferences: { ...profile.preferences, defaultLanguage: e.target.value }
                })}
              />
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Subscription</h2>
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-primary" />
                <span className="font-semibold capitalize">{profile.subscription?.plan || 'Free'} Plan</span>
              </div>
              <span className={`capitalize px-2 py-1 rounded-full text-sm ${
                profile.subscription?.status === 'active' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              }`}>
                {profile.subscription?.status || 'inactive'}
              </span>
            </div>
            <div className="space-y-2">
              {profile.subscription?.features?.map((feature: string, index: number) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>•</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Usage Statistics */}
        {metrics && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Usage Statistics</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-lg p-4 border"
              >
                <div className="text-sm text-muted-foreground">Total Generations</div>
                <div className="text-2xl font-bold">{metrics.totalVoiceGenerations || 0}</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-lg p-4 border"
              >
                <div className="text-sm text-muted-foreground">Total Duration</div>
                <div className="text-2xl font-bold">
                  {Math.round((metrics.totalAudioDuration || 0) / 60)} mins
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-lg p-4 border"
              >
                <div className="text-sm text-muted-foreground">Success Rate</div>
                <div className="text-2xl font-bold">
                  {Math.round(metrics.successRate || 0)}%
                </div>
              </motion.div>
            </div>
          </div>
        )}

        <Button type="submit" disabled={saving} className="flex items-center">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </form>
    </div>
  )
} 