import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useLanguageStore } from '../store/languageStore'
import { tmdbService } from '../services/tmdb'
import { MediaCard } from '../components/MediaCard'
import { useSearch } from '../contexts/SearchContext'

interface MediaItem {
  id: number
  title?: string
  name?: string
  poster_path?: string
  backdrop_path?: string
  release_date?: string
  first_air_date?: string
  vote_average: number
  overview: string
  media_type?: string
  genre_ids?: number[]
}

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { language } = useLanguageStore()
  const { searchQuery, setSearchQuery } = useSearch()

  const { data: trending } = useQuery({
    queryKey: ['trending', language],
    queryFn: () => tmdbService.getTrending(language),
  })

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['search', searchQuery, language],
    queryFn: () => tmdbService.search(searchQuery, language),
    enabled: searchQuery.length > 2,
  })

  const displayResults = searchQuery.length > 2 ? searchResults : trending

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <main className="max-w-7xl mx-auto p-8">
        {searchQuery.length > 2 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'es' ? 'Resultados de búsqueda' : 'Search Results'}
              <span className="text-gray-400">: "{searchQuery}"</span>
            </h2>
          </div>
        )}

        {searchQuery.length <= 2 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'es' ? 'Tendencias' : 'Trending'}
            </h2>
          </div>
        )}

        {searchLoading ? (
          <div className="text-center py-20">
            <div className="text-xl">Loading...</div>
          </div>
        ) : displayResults && displayResults.results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {displayResults.results
              .filter((item) => {
                const mediaType = 'media_type' in item ? item.media_type : null
                return mediaType === 'movie' || mediaType === 'tv'
              })
              .map((item) => {
                const mediaType = 'media_type' in item
                  ? (item.media_type === 'movie' ? 'movie' : 'tv')
                  : 'title' in item
                  ? 'movie'
                  : 'tv'
                return (
                  <MediaCard
                    key={`${mediaType}-${item.id}`}
                    media={item}
                    mediaType={mediaType}
                  />
                )
              })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              {language === 'es'
                ? 'No se encontraron resultados'
                : 'No results found'}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
