import { tmdbService } from '../services/tmdb'
import { useFavoritesStore } from '../store/favoritesStore'
import { Heart } from 'lucide-react'
import { Button } from './ui/button'
import { useNavigate } from '@tanstack/react-router'

interface MediaCardProps {
  media: any
  mediaType: 'movie' | 'tv'
}

export function MediaCard({ media, mediaType }: MediaCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore()
  const navigate = useNavigate()
  const title = 'title' in media ? media.title : 'name' in media ? media.name : media.title
  const date = 'release_date' in media ? media.release_date : 'first_air_date' in media ? media.first_air_date : media.releaseDate
  const posterPath = 'poster_path' in media ? media.poster_path : media.posterPath
  const voteAverage = 'vote_average' in media ? media.vote_average : media.voteAverage
  const favorited = isFavorite(media.id)

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    const item = {
      id: media.id,
      title,
      posterPath: posterPath,
      backdropPath: 'backdrop_path' in media ? media.backdrop_path : media.backdropPath,
      releaseDate: date,
      voteAverage: voteAverage || 0,
      overview: 'overview' in media ? media.overview : media.overview,
      mediaType,
    }

    if (favorited) {
      removeFavorite(media.id)
    } else {
      addFavorite(item)
    }
  }

  const handleClick = () => {
    const path = mediaType === 'movie' ? `/movie/${media.id}` : `/show/${media.id}`
    window.location.href = path
  }

  return (
    <div
      onClick={handleClick}
      className="group relative overflow-hidden rounded-lg bg-gray-800 transition-transform hover:scale-105 cursor-pointer"
    >
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={tmdbService.getImageUrl(posterPath)}
          alt={title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-semibold text-white line-clamp-2">{title}</h3>
          <p className="text-sm text-gray-300">{date?.split('-')[0]}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="flex items-center gap-1 text-sm text-yellow-400">
              ★ {voteAverage ? voteAverage.toFixed(1) : 'N/A'}
            </span>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-10 h-8 w-8 bg-black/50 text-white hover:bg-black-70"
        onClick={handleToggleFavorite}
      >
        <Heart
          className={favorited ? 'fill-red-500 text-red-500' : 'text-white'}
          size={16}
        />
      </Button>
    </div>
  )
}
