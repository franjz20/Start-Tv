import { useRef, useEffect, useState } from 'react'
import { usePlayerStore } from '../store/playerStore'
import { useProgressStore } from '../store/progressStore'

export function PersistentPlayer() {
  const { isActive, currentUrl, deactivatePlayer, mediaType, mediaId, season, episode } = usePlayerStore()
  const { saveProgress } = useProgressStore()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [watchTime, setWatchTime] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isActive && mediaType && mediaId) {
      setError(null)
      // Mark as watching when player opens
      saveProgress(mediaType, mediaId, 0, season || undefined, episode || undefined)
      
      // Track watch time
      const interval = setInterval(() => {
        setWatchTime(prev => prev + 1)
      }, 1000)

      // Handle iframe load errors
      const handleError = () => {
        setError('Error loading player')
      }

      const iframe = iframeRef.current
      if (iframe) {
        iframe.addEventListener('error', handleError)
      }

      return () => {
        clearInterval(interval)
        if (iframe) {
          iframe.removeEventListener('error', handleError)
        }
        // Save progress when player closes
        saveProgress(mediaType, mediaId, watchTime, season || undefined, episode || undefined)
      }
    }
  }, [isActive, mediaType, mediaId, season, episode, saveProgress])

  useEffect(() => {
    // Update iframe src when URL changes, but don't recreate the iframe
    if (iframeRef.current && currentUrl) {
      if (iframeRef.current.src !== currentUrl) {
        iframeRef.current.src = currentUrl
      }
    }
  }, [currentUrl])

  const handleClose = () => {
    deactivatePlayer()
  }

  if (!isActive || !currentUrl) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black-70 transition"
      >
        ✕
      </button>
      {error && (
        <div className="absolute top-4 left-4 z-10 p-4 bg-red-500/90 text-white rounded-lg">
          {error}
        </div>
      )}
      <div className="flex-1 w-full h-full">
        <iframe
          ref={iframeRef}
          src={currentUrl}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          loading="eager"
          title="Video Player"
          sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
        />
      </div>
    </div>
  )
}
