import express from 'express';
import { tmdbService } from '../services/tmdb.js';

const router = express.Router();

// Search movies and TV shows (multi-search)
router.get('/search/multi', async (req, res) => {
  try {
    const { query, language = 'es' } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    const results = await tmdbService.searchMulti(query, language);
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search' });
  }
});

// Search movies and TV shows
router.get('/search', async (req, res) => {
  try {
    const { query, language = 'es' } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    const results = await tmdbService.search(query, language);
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search' });
  }
});

// Get trending content
router.get('/trending', async (req, res) => {
  try {
    const { language = 'es' } = req.query;
    const results = await tmdbService.getTrending(language);
    res.json(results);
  } catch (error) {
    console.error('Trending error:', error);
    res.status(500).json({ error: 'Failed to get trending' });
  }
});

// Get popular movies
router.get('/movies/popular', async (req, res) => {
  try {
    const { language = 'es' } = req.query;
    const results = await tmdbService.getPopularMovies(language);
    res.json(results);
  } catch (error) {
    console.error('Popular movies error:', error);
    res.status(500).json({ error: 'Failed to get popular movies' });
  }
});

// Get popular TV shows
router.get('/tv/popular', async (req, res) => {
  try {
    const { language = 'es' } = req.query;
    const results = await tmdbService.getPopularTV(language);
    res.json(results);
  } catch (error) {
    console.error('Popular TV error:', error);
    res.status(500).json({ error: 'Failed to get popular TV' });
  }
});

// Get movies by genre
router.get('/movies/genre/:genreId', async (req, res) => {
  try {
    const { genreId } = req.params;
    const { language = 'es', page = 1 } = req.query;
    const results = await tmdbService.getMoviesByGenre(genreId, language, page);
    res.json(results);
  } catch (error) {
    console.error('Movies by genre error:', error);
    res.status(500).json({ error: 'Failed to get movies by genre' });
  }
});

// Get TV shows by genre
router.get('/tv/genre/:genreId', async (req, res) => {
  try {
    const { genreId } = req.params;
    const { language = 'es', page = 1 } = req.query;
    const results = await tmdbService.getTVByGenre(genreId, language, page);
    res.json(results);
  } catch (error) {
    console.error('TV by genre error:', error);
    res.status(500).json({ error: 'Failed to get TV by genre' });
  }
});

// Get movie details
router.get('/movie/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { language = 'es' } = req.query;
    const movie = await tmdbService.getMovieDetails(id, language);
    res.json(movie);
  } catch (error) {
    console.error('Movie details error:', error);
    res.status(500).json({ error: 'Failed to get movie details' });
  }
});

// Get TV show details
router.get('/tv/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { language = 'es' } = req.query;
    const tvShow = await tmdbService.getTVShowDetails(id, language);
    res.json(tvShow);
  } catch (error) {
    console.error('TV show details error:', error);
    res.status(500).json({ error: 'Failed to get TV show details' });
  }
});

export default router;
