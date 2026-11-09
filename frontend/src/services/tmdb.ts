const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export interface Movie {
  id: number
  title: string
  poster_path: string
  backdrop_path: string
  release_date: string
  vote_average: number
  overview: string
  genre_ids: number[]
}

export interface TVShow {
  id: number
  name: string
  poster_path: string
  backdrop_path: string
  first_air_date: string
  vote_average: number
  overview: string
  genre_ids: number[]
}

export interface MediaDetails {
  id: number
  title?: string
  name?: string
  poster_path: string
  backdrop_path: string
  release_date?: string
  first_air_date?: string
  vote_average: number
  overview: string
  genres: { id: number; name: string }[]
  imdb_id?: string
}

export interface SearchResponse {
  page: number
  results: (Movie | TVShow)[]
  total_pages: number
  total_results: number
}

async function fetchTMDB<T>(endpoint: string, language: string = 'es'): Promise<T> {
  const url = new URL(`${BACKEND_URL}/api/tmdb${endpoint}`)
  url.searchParams.append('language', language)

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`Backend API error: ${response.statusText}`)
  }
  return response.json()
}

export const tmdbService = {
  search: async (query: string, language: string = 'es'): Promise<SearchResponse> => {
    return fetchTMDB<SearchResponse>(`/search/multi?query=${encodeURIComponent(query)}`, language)
  },

  getMovieDetails: async (id: number, language: string = 'es'): Promise<MediaDetails> => {
    return fetchTMDB<MediaDetails>(`/movie/${id}`, language)
  },

  getTVShowDetails: async (id: number, language: string = 'es'): Promise<MediaDetails> => {
    return fetchTMDB<MediaDetails>(`/tv/${id}`, language)
  },

  getTrending: async (language: string = 'es'): Promise<SearchResponse> => {
    return fetchTMDB<SearchResponse>('/trending', language)
  },

  getPopularMovies: async (language: string = 'es'): Promise<SearchResponse> => {
    return fetchTMDB<SearchResponse>('/movies/popular', language)
  },

  getPopularTV: async (language: string = 'es'): Promise<SearchResponse> => {
    return fetchTMDB<SearchResponse>('/tv/popular', language)
  },

  getMoviesByGenre: async (genreId: number, language: string = 'es', page: number = 1): Promise<SearchResponse> => {
    return fetchTMDB<SearchResponse>(`/movies/genre/${genreId}?page=${page}`, language)
  },

  getTVByGenre: async (genreId: number, language: string = 'es', page: number = 1): Promise<SearchResponse> => {
    return fetchTMDB<SearchResponse>(`/tv/genre/${genreId}?page=${page}`, language)
  },

  getImageUrl: (path: string | null, size: string = 'w500'): string => {
    if (!path) return '/placeholder.jpg'
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
  },
}
