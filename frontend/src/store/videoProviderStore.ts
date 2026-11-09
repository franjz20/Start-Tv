import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface VideoProviderState {
  provider: string
  setProvider: (provider: string) => void
}

export const useVideoProviderStore = create<VideoProviderState>()(
  persist(
    (set) => ({
      provider: 'playlatinsrc', // Default to PlayLatinSRC
      setProvider: (provider) => set({ provider }),
    }),
    {
      name: 'video-provider-storage',
    }
  )
)
