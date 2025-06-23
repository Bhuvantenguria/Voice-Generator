'use client'

import ErrorDisplay from '@/components/ErrorDisplay'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorDisplay message={error.message} retry={reset} />
} 