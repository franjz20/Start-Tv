export interface VideoProviderConfig {
  name: string
  getMovieUrl: (imdbId: string | null, tmdbId: number, startAt?: number) => string
  getTVUrl: (imdbId: string | null, tmdbId: number, season?: number, episode?: number, startAt?: number) => string
  supportsPicker: boolean
  supportsEvents: boolean
}

export const videoProviders: Record<string, VideoProviderConfig> = {
  playlatinsrc: {
    name: 'PlayLatinSRC',
    getMovieUrl: (imdbId, tmdbId) => {
      return imdbId 
        ? `https://playlatinsrc.co/movie/${imdbId}`
        : `https://playlatinsrc.co/movie/${tmdbId}`
    },
    getTVUrl: (imdbId, tmdbId, season, episode) => {
      if (season !== undefined && episode !== undefined) {
        return imdbId
          ? `https://playlatinsrc.co/custom/serial/${imdbId}/${season}/${episode}?color=%23e50914&lastserver=dropload`
          : `https://playlatinsrc.co/custom/serial/${tmdbId}/${season}/${episode}?color=%23e50914&lastserver=dropload`
      }
      return imdbId
        ? `https://playlatinsrc.co/serial/${imdbId}`
        : `https://playlatinsrc.co/serial/${tmdbId}`
    },
    supportsPicker: false,
    supportsEvents: false,
  },
}
