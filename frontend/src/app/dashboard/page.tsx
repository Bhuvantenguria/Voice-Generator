'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ApiService } from '@/services/api'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Download, Trash2, Plus, RefreshCw, Volume2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AudioFile {
  id: string;
  name: string;
  url: string;
  duration?: number;
  format: string;
  transformations?: {
    pitch?: number;
    speed?: number;
    volume?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export default function DashboardPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([])
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    loadAudioFiles()
  }, [])

  const loadAudioFiles = async () => {
    try {
      setLoading(true)
      const response = await ApiService.getUserAudios()
      setAudioFiles(response.data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load audio files',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id)
      await ApiService.deleteAudio(id)
      setAudioFiles(files => files.filter(file => file.id !== id))
      toast({
        title: 'Success',
        description: 'Audio file deleted successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete audio file',
        variant: 'destructive'
      })
    } finally {
      setDeleting(null)
    }
  }

  const handleDownload = (url: string, filename: string) => {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Volume2 className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">My Audio Files</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={loadAudioFiles}
            className="hover:animate-spin"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Link href="/generate">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Generate New
            </Button>
          </Link>
        </div>
      </div>

      {/* Audio Files Grid */}
      <AnimatePresence>
        {audioFiles.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {audioFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card rounded-lg p-6 border space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-semibold line-clamp-1">{file.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {file.createdAt && new Date(file.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDownload(file.url, file.name)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(file.id)}
                      disabled={deleting === file.id}
                    >
                      {deleting === file.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Audio Details */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{file.duration ? `${Math.round(file.duration)}s` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="uppercase">{file.format}</span>
                  </div>
                  {file.transformations && (
                    <>
                      {file.transformations.pitch && (
                        <div className="flex justify-between">
                          <span>Pitch:</span>
                          <span>{file.transformations.pitch}</span>
                        </div>
                      )}
                      {file.transformations.speed && (
                        <div className="flex justify-between">
                          <span>Speed:</span>
                          <span>{file.transformations.speed}x</span>
                        </div>
                      )}
                      {file.transformations.volume && (
                        <div className="flex justify-between">
                          <span>Volume:</span>
                          <span>{file.transformations.volume}%</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Audio Player */}
                <audio controls className="w-full">
                  <source src={file.url} type={`audio/${file.format}`} />
                  Your browser does not support the audio element.
                </audio>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12 space-y-4"
          >
            <Volume2 className="h-12 w-12 text-muted-foreground" />
            <h2 className="text-xl font-semibold">No audio files yet</h2>
            <p className="text-muted-foreground">
              Generate your first audio file to get started
            </p>
            <Link href="/generate">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Generate Audio
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 