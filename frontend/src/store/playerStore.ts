import { create } from 'zustand'

interface PlayerStore {
  isActive: boolean
  currentUrl: string | null
  mediaType: string | null
  mediaId: number | null
  season: number | null
  episode: number | null
  provider: string
  returnUrl: string | null
  activatePlayer: (url: string, mediaType?: string, mediaId?: number, season?: number, episode?: number, provider?: string, returnUrl?: string) => void
  deactivatePlayer: () => void
  updateUrl: (url: string) => void
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  isActive: false,
  currentUrl: null,
  mediaType: null,
  mediaId: null,
  season: null,
  episode: null,
  provider: 'playlatinsrc',
  returnUrl: null,
  activatePlayer: (url, mediaType, mediaId, season, episode, provider = 'playlatinsrc', returnUrl) => set({ 
    isActive: true, 
    currentUrl: url,
    mediaType: mediaType || null,
    mediaId: mediaId || null,
    season: season || null,
    episode: episode || null,
    provider,
    returnUrl: returnUrl || '/'
  }),
  deactivatePlayer: () => set({ 
    isActive: false, 
    currentUrl: null,
    mediaType: null,
    mediaId: null,
    season: null,
    episode: null,
    provider: 'playlatinsrc'
  }),
  updateUrl: (url) => set({ currentUrl: url }),
}))
