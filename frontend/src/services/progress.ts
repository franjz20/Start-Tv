const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

export interface WatchProgress {
  id: number
  media_type: string
  media_id: number
  user_id: string
  progress: number
  season?: number
  episode?: number
  updated_at: string
}

export const progressService = {
  saveProgress: async (data: {
    mediaType: string
    mediaId: number
    userId?: string
    progress: number
    season?: number
    episode?: number
  }): Promise<void> => {
    const response = await fetch(`${BACKEND_URL}/api/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mediaType: data.mediaType,
        mediaId: data.mediaId,
        userId: data.userId || 'anonymous',
        progress: data.progress,
        season: data.season,
        episode: data.episode
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save progress');
    }
  },

  getProgress: async (mediaType: string, mediaId: number, season?: number, episode?: number): Promise<WatchProgress | null> => {
    const params = new URLSearchParams({
      mediaType,
      mediaId: mediaId.toString(),
      userId: 'anonymous'
    })
    
    if (season !== undefined) params.append('season', season.toString())
    if (episode !== undefined) params.append('episode', episode.toString())
    
    const response = await fetch(`${BACKEND_URL}/api/progress?${params}`)
    
    if (!response.ok) {
      throw new Error('Failed to get progress');
    }
    
    return response.json()
  },

  getAllProgress: async (userId: string = 'anonymous'): Promise<WatchProgress[]> => {
    const response = await fetch(`${BACKEND_URL}/api/progress/all?userId=${userId}`)
    
    if (!response.ok) {
      throw new Error('Failed to get all progress')
    }
    
    return response.json()
  },

  deleteProgress: async (mediaType: string, mediaId: number, season?: number, episode?: number): Promise<void> => {
    const params = new URLSearchParams({
      mediaType,
      mediaId: mediaId.toString(),
      userId: 'anonymous'
    })
    
    if (season !== undefined) params.append('season', season.toString())
    if (episode !== undefined) params.append('episode', episode.toString())
    
    const response = await fetch(`${BACKEND_URL}/api/progress?${params}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete progress')
    }
  }
}
