import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { tmdbService } from '../services/tmdb'
import { useLanguageStore } from '../store/languageStore'
import { useFavoritesStore } from '../store/favoritesStore'
import { usePlayerStore } from '../store/playerStore'
import { useProgressStore } from '../store/progressStore'
import { videoProviders } from '../services/videoProviders'
import { Button } from '../components/ui/button'
import { Heart, Play } from 'lucide-react'

export const Route = createFileRoute('/movie/$id')({
  component: MovieDetails,
})

function MovieDetails() {
  const { id } = Route.useParams()
  const { language } = useLanguageStore()
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore()
  const { activatePlayer } = usePlayerStore()
  const { loadProgress, progress } = useProgressStore()

  const { data: movie, isLoading } = useQuery({
    queryKey: ['movie', id, language],
    queryFn: () => tmdbService.getMovieDetails(Number(id), language),
  })

  useEffect(() => {
    if (movie) {
      loadProgress('movie', movie.id)
    }
  }, [movie, loadProgress])

  const progressKey = movie ? `movie-${movie.id}` : ''
  const savedProgress = progress[progressKey]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-xl">Movie not found</div>
      </div>
    )
  }

  const favorited = isFavorite(movie.id)
  const handleToggleFavorite = () => {
    const item = {
      id: movie.id,
      title: movie.title || '',
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      releaseDate: movie.release_date || '',
      voteAverage: movie.vote_average,
      overview: movie.overview,
      mediaType: 'movie' as const,
    }

    if (favorited) {
      removeFavorite(movie.id)
    } else {
      addFavorite(item)
    }
  }

  const videoUrl = videoProviders.playlatinsrc.getMovieUrl(movie.imdb_id, movie.id)

  const handlePlay = () => {
    activatePlayer(videoUrl, 'movie', movie.id, undefined, undefined, 'playlatinsrc', window.location.href)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="relative">
        <div className="h-96 w-full overflow-hidden">
          <img
            src={tmdbService.getImageUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-yellow-400">
                ★ {movie.vote_average.toFixed(1)}
              </span>
              <span>{movie.release_date?.split('-')[0]}</span>
              {movie.genres.map((genre) => (
                <span key={genre.id} className="text-gray-400">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {savedProgress && savedProgress.progress > 0 && (
            <Button
              onClick={handlePlay}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Play size={20} />
              <span className="hidden sm:inline">{language === 'es' ? 'Continuar viendo' : 'Continue watching'}</span>
              <span className="sm:hidden">{language === 'es' ? 'Continuar' : 'Continue'}</span>
            </Button>
          )}
          <Button
            onClick={handlePlay}
            className="flex items-center gap-2"
          >
            <Play size={20} />
            <span className="hidden sm:inline">{language === 'es' ? 'Ver en PlayLatinSRC' : 'Watch on PlayLatinSRC'}</span>
            <span className="sm:hidden">{language === 'es' ? 'Ver' : 'Watch'}</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleToggleFavorite}
            className="flex items-center gap-2"
          >
            <Heart
              className={favorited ? 'fill-red-500 text-red-500' : ''}
              size={20}
            />
            <span className="hidden sm:inline">
              {favorited
                ? language === 'es'
                  ? 'Eliminar de favoritos'
                  : 'Remove from favorites'
                : language === 'es'
                ? 'Agregar a favoritos'
                : 'Add to favorites'}
            </span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              {language === 'es' ? 'Sinopsis' : 'Overview'}
            </h2>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{movie.overview}</p>
          </div>
          <div className="flex justify-center">
            <img
              src={tmdbService.getImageUrl(movie.poster_path)}
              alt={movie.title}
              className="rounded-lg shadow-lg max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
