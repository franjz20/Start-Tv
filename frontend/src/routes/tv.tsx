import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { tmdbService } from '../services/tmdb'
import { useLanguageStore } from '../store/languageStore'
import { MediaCard } from '../components/MediaCard'
import { useSearch } from '../contexts/SearchContext'

export const Route = createFileRoute('/tv')({
  component: TVPage,
})

const genres = [
  { id: 10759, name: 'Acción y Aventura' },
  { id: 16, name: 'Animación' },
  { id: 35, name: 'Comedia' },
  { id: 80, name: 'Crimen' },
  { id: 99, name: 'Documental' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Familia' },
  { id: 10762, name: 'Infantil' },
  { id: 9648, name: 'Misterio' },
  { id: 10763, name: 'Noticias' },
  { id: 10764, name: 'Reality' },
  { id: 10765, name: 'Sci-Fi y Fantasía' },
  { id: 10766, name: 'Soap' },
  { id: 10767, name: 'Talk Show' },
  { id: 10768, name: 'Guerra y Política' },
  { id: 37, name: 'Western' },
]

function TVPage() {
  const { language } = useLanguageStore()
  const { searchQuery, setSearchQuery } = useSearch()
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)
  const [page, setPage] = useState(1)

  const { data: popularTV, isLoading } = useQuery({
    queryKey: ['popular-tv', language],
    queryFn: () => tmdbService.getPopularTV(language),
    enabled: !selectedGenre,
  })

  const { data: genreTV, isLoading: genreLoading } = useQuery({
    queryKey: ['tv-genre', selectedGenre, language, page],
    queryFn: () => tmdbService.getTVByGenre(selectedGenre!, language, page),
    enabled: !!selectedGenre,
  })

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['search-tv', searchQuery, language],
    queryFn: () => tmdbService.search(searchQuery, language),
    enabled: searchQuery.length > 2,
  })

  const displayResults = searchQuery.length > 2 ? searchResults : selectedGenre ? genreTV : popularTV
  const isLoadingResults = searchQuery.length > 2 ? searchLoading : selectedGenre ? genreLoading : isLoading

  const handleGenreSelect = (genreId: number) => {
    setSelectedGenre(genreId)
    setPage(1)
  }

  const handleClearGenre = () => {
    setSelectedGenre(null)
    setPage(1)
  }

  if (isLoadingResults && !searchQuery) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  const selectedGenreObj = genres.find(g => g.id === selectedGenre)

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto p-8">
        {selectedGenre ? (
          <button
            onClick={handleClearGenre}
            className="text-purple-400 hover:text-purple-300 mb-4 inline-block"
          >
            ← {language === 'es' ? 'Volver a Series' : 'Back to TV Shows'}
          </button>
        ) : null}

        <h1 className="text-4xl font-bold mb-8">
          {searchQuery.length > 2
            ? (language === 'es' ? 'Resultados de búsqueda' : 'Search Results')
            : selectedGenre
            ? `${language === 'es' ? 'Series' : 'TV Shows'} - ${selectedGenreObj?.name}`
            : (language === 'es' ? 'Series Populares' : 'Popular TV Shows')}
        </h1>

        {!selectedGenre && !searchQuery && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'es' ? 'Categorías' : 'Categories'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreSelect(genre.id)}
                  className="bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors text-sm sm:text-base"
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {searchLoading ? (
          <div className="text-center py-20">
            <div className="text-xl">Loading...</div>
          </div>
        ) : displayResults && displayResults.results.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {displayResults.results
                .filter((item) => {
                  const mediaType = 'media_type' in item ? item.media_type : null
                  return mediaType === 'tv' || mediaType === null
                })
                .map((tv) => (
                  <MediaCard
                    key={`tv-${tv.id}`}
                    media={tv}
                    mediaType="tv"
                  />
                ))}
            </div>
            {selectedGenre && !searchQuery && displayResults.total_pages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mt-8">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 w-full sm:w-auto"
                >
                  {language === 'es' ? 'Anterior' : 'Previous'}
                </button>
                <span className="text-gray-400 text-sm">
                  {page} / {displayResults.total_pages}
                </span>
                <button
                  onClick={() => setPage(Math.min(displayResults.total_pages, page + 1))}
                  disabled={page === displayResults.total_pages}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 w-full sm:w-auto"
                >
                  {language === 'es' ? 'Siguiente' : 'Next'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              {language === 'es'
                ? 'No se encontraron resultados'
                : 'No results found'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
