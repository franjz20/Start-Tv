import { createFileRoute } from '@tanstack/react-router'
import { useFavoritesStore } from '../store/favoritesStore'
import { useLanguageStore } from '../store/languageStore'
import { MediaCard } from '../components/MediaCard'
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/favorites')({
  component: Favorites,
})

function Favorites() {
  const { favorites } = useFavoritesStore()
  const { language } = useLanguageStore()

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-8">
          {language === 'es' ? 'Mis Favoritos' : 'My Favorites'}
        </h1>
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              {language === 'es'
                ? 'No tienes favoritos aún'
                : 'No favorites yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favorites.map((item) => (
              <MediaCard
                key={`${item.mediaType}-${item.id}`}
                media={item}
                mediaType={item.mediaType}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
