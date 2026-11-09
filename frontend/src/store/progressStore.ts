import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { progressService } from '../services/progress'

interface WatchProgress {
  id: number
  media_type: string
  media_id: number
  user_id: string
  progress: number
  season?: number
  episode?: number
  updated_at: string
}

interface ProgressState {
  progress: Record<string, WatchProgress>
  isLoading: boolean
  error: string | null
  loadProgress: (mediaType: string, mediaId: number, season?: number, episode?: number) => Promise<void>
  saveProgress: (mediaType: string, mediaId: number, progress: number, season?: number, episode?: number) => Promise<void>
  clearProgress: (mediaType: string, mediaId: number, season?: number, episode?: number) => Promise<void>
}

const getProgressKey = (mediaType: string, mediaId: number, season?: number, episode?: number) => {
  if (season !== undefined && episode !== undefined) {
    return `${mediaType}-${mediaId}-s${season}e${episode}`
  }
  return `${mediaType}-${mediaId}`
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: {},
      isLoading: false,
      error: null,

      loadProgress: async (mediaType, mediaId, season, episode) => {
        set({ isLoading: true, error: null })
        try {
          const data = await progressService.getProgress(mediaType, mediaId, season, episode)
          const key = getProgressKey(mediaType, mediaId, season, episode)
          
          if (data) {
            set((state) => ({
              progress: { ...state.progress, [key]: data }
            }))
          }
        } catch (error) {
          console.error('Failed to load progress:', error)
          set({ error: 'Failed to load progress' })
        } finally {
          set({ isLoading: false })
        }
      },

      saveProgress: async (mediaType, mediaId, progress, season, episode) => {
        set({ isLoading: true, error: null })
        try {
          await progressService.saveProgress({ mediaType, mediaId, progress, season, episode })
          const key = getProgressKey(mediaType, mediaId, season, episode)
          
          set((state) => ({
            progress: {
              ...state.progress,
              [key]: {
                id: Date.now(),
                media_type: mediaType,
                media_id: mediaId,
                user_id: 'anonymous',
                progress,
                season,
                episode,
                updated_at: new Date().toISOString()
              }
            }
          }))
        } catch (error) {
          console.error('Failed to save progress:', error)
          set({ error: 'Failed to save progress' })
        } finally {
          set({ isLoading: false })
        }
      },

      clearProgress: async (mediaType, mediaId, season, episode) => {
        set({ isLoading: true, error: null })
        try {
          await progressService.deleteProgress(mediaType, mediaId, season, episode)
          const key = getProgressKey(mediaType, mediaId, season, episode)
          
          set((state) => {
            const newProgress = { ...state.progress }
            delete newProgress[key]
            return { progress: newProgress }
          })
        } catch (error) {
          console.error('Failed to clear progress:', error)
          set({ error: 'Failed to clear progress' })
        } finally {
          set({ isLoading: false })
        }
      }
    }),
    {
      name: 'progress-storage'
    }
  )
)
