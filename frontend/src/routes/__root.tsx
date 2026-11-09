import { createRootRoute, Outlet } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../lib/queryClient'
import { PersistentPlayer } from '../components/PersistentPlayer'
import { Sidebar, Header } from '../components/Navigation'
import { SidebarProvider } from '../contexts/SidebarContext'
import { SearchProvider } from '../contexts/SearchContext'

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <SearchProvider>
          <div className="flex">
            <Sidebar />
            <div className="flex-1 min-h-screen bg-gray-900 text-gray-100">
              <Header />
              <Outlet />
            </div>
          </div>
          <PersistentPlayer />
        </SearchProvider>
      </SidebarProvider>
    </QueryClientProvider>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-gray-400">Page not found</p>
      </div>
    </div>
  ),
})
