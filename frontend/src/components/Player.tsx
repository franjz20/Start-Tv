import { useRef, useEffect, useState } from 'react'
import { useProgressStore } from '../store/progressStore'

interface PlayerProps {
  url: string
  mediaType: string
  mediaId: number
  season?: number
  episode?: number
  onClose?: () => void
}

export function Player({ url, mediaType, mediaId, season, episode, onClose }: PlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [watchTime, setWatchTime] = useState(0)
  const { saveProgress } = useProgressStore()

  useEffect(() => {
    // Mark as watching when player opens
    saveProgress(mediaType, mediaId, 0, season, episode)
    
    // Track watch time
    const interval = setInterval(() => {
      setWatchTime(prev => prev + 1)
    }, 1000) // Update every second

    return () => {
      clearInterval(interval)
      // Save progress when player closes
      saveProgress(mediaType, mediaId, watchTime, season, episode)
    }
  }, [mediaType, mediaId, season, episode, saveProgress])

  useEffect(() => {
    // Preload the iframe by setting src only when component mounts
    if (iframeRef.current) {
      iframeRef.current.src = url
    }
  }, [url])

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black-70 transition"
        >
          ✕
        </button>
      )}
      <div className="flex-1 w-full h-full">
        <iframe
          ref={iframeRef}
          src={url}
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
