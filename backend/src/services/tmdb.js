function getApiKey() {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error('TMDB_API_KEY environment variable is required');
  }
  return key;
}
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

async function fetchTMDB(endpoint, language = 'es') {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', getApiKey());
  url.searchParams.append('language', language);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.statusText}`);
  }
  return response.json();
}

export const tmdbService = {
  searchMulti: async (query, language = 'es') => {
    return fetchTMDB(`/search/multi?query=${encodeURIComponent(query)}`, language);
  },

  search: async (query, language = 'es') => {
    return fetchTMDB(`/search/multi?query=${encodeURIComponent(query)}`, language);
  },

  getMovieDetails: async (id, language = 'es') => {
    return fetchTMDB(`/movie/${id}`, language);
  },

  getTVShowDetails: async (id, language = 'es') => {
    return fetchTMDB(`/tv/${id}`, language);
  },

  getTrending: async (language = 'es') => {
    return fetchTMDB('/trending/all/day', language);
  },

  getMoviesByGenre: async (genreId, language = 'es', page = 1) => {
    return fetchTMDB(`/discover/movie?with_genres=${genreId}&page=${page}`, language);
  },

  getTVByGenre: async (genreId, language = 'es', page = 1) => {
    return fetchTMDB(`/discover/tv?with_genres=${genreId}&page=${page}`, language);
  },

  getPopularMovies: async (language = 'es') => {
    return fetchTMDB('/movie/popular', language);
  },

  getPopularTV: async (language = 'es') => {
    return fetchTMDB('/tv/popular', language);
  },

  getImageUrl: (path, size = 'w500') => {
    if (!path) return '/placeholder.jpg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  },
};
