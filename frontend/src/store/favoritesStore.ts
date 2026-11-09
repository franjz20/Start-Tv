import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface MediaItem {
  id: number
  title: string
  posterPath: string
  backdropPath: string
  releaseDate: string
  voteAverage: number
  overview: string
  mediaType: 'movie' | 'tv'
}

interface FavoritesStore {
  favorites: MediaItem[]
  addFavorite: (item: MediaItem) => void
  removeFavorite: (id: number) => void
  isFavorite: (id: number) => boolean
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (item) => {
        set((state) => {
          if (state.favorites.some((fav) => fav.id === item.id)) {
            return state
          }
          return { favorites: [...state.favorites, item] }
        })
      },
      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav.id !== id),
        }))
      },
      isFavorite: (id) => {
        return get().favorites.some((fav) => fav.id === id)
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
)
