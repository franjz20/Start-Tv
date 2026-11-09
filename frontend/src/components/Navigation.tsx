import { Link } from '@tanstack/react-router'
import { useLanguageStore } from '../store/languageStore'
import { Button } from './ui/button'
import { Heart, Menu, X } from 'lucide-react'
import { useSidebar } from '../contexts/SidebarContext'
import { useSearch } from '../contexts/SearchContext'

interface HeaderProps {
  showSearch?: boolean
}

export function Header({ showSearch = true }: HeaderProps) {
  const { language } = useLanguageStore()
  const { toggleSidebar } = useSidebar()
  const { searchQuery, setSearchQuery } = useSearch()

  return (
    <header className="border-b border-gray-800 p-4 sticky top-0 bg-gray-900/95 backdrop-blur z-40">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <Menu size={24} />
          </Button>
          <Link to="/" className="text-2xl font-bold hover:text-purple-400 transition">
            StartTv
          </Link>
        </div>

        {showSearch && (
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder={language === 'es' ? 'Buscar...' : 'Search...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <Link to="/favorites">
            <Button variant="ghost" size="icon">
              <Heart size={20} />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              useLanguageStore.setState({
                language: language === 'es' ? 'en' : 'es',
              })
            }
          >
            {language === 'es' ? '🇺🇸' : '🇪🇸'}
          </Button>
        </div>
      </div>
    </header>
  )
}

export function Sidebar() {
  const { language } = useLanguageStore()
  const { isOpen, closeSidebar } = useSidebar()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-gray-800 border-r border-gray-700 z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64 overflow-y-auto`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4 lg:hidden">
            <span className="text-xl font-bold">StartTv</span>
            <Button variant="ghost" size="icon" onClick={closeSidebar}>
              <X size={24} />
            </Button>
          </div>
          <nav className="space-y-2">
            <Link
              to="/"
              className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              activeProps={{ className: 'bg-purple-600' }}
              onClick={closeSidebar}
            >
              {language === 'es' ? 'Inicio' : 'Home'}
            </Link>

            <Link
              to="/movies"
              className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              activeProps={{ className: 'bg-purple-600' }}
              onClick={closeSidebar}
            >
              {language === 'es' ? 'Películas' : 'Movies'}
            </Link>

            <Link
              to="/tv"
              className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              activeProps={{ className: 'bg-purple-600' }}
              onClick={closeSidebar}
            >
              {language === 'es' ? 'Series' : 'TV Shows'}
            </Link>

            <Link
              to="/favorites"
              className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              activeProps={{ className: 'bg-purple-600' }}
              onClick={closeSidebar}
            >
              {language === 'es' ? 'Favoritos' : 'Favorites'}
            </Link>
          </nav>
        </div>
      </aside>
    </>
  )
}
