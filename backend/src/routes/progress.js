import express from 'express';
import { dbService } from '../services/database.js';

const router = express.Router();

// Save watch progress
router.post('/', async (req, res) => {
  try {
    const { mediaType, mediaId, userId = 'anonymous', progress, season, episode } = req.body;
    
    if (!mediaType || !mediaId) {
      return res.status(400).json({ error: 'mediaType and mediaId are required' });
    }

    dbService.saveProgress({ mediaType, mediaId, userId, progress, season, episode });
    res.json({ success: true });
  } catch (error) {
    console.error('Save progress error:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// Get watch progress
router.get('/', async (req, res) => {
  try {
    const { mediaType, mediaId, userId = 'anonymous', season, episode } = req.query;
    
    if (!mediaType || !mediaId) {
      return res.status(400).json({ error: 'mediaType and mediaId are required' });
    }

    const progress = dbService.getProgress({ mediaType, mediaId, userId, season, episode });
    res.json(progress || null);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

// Get all progress for a user
router.get('/all', async (req, res) => {
  try {
    const { userId = 'anonymous' } = req.query;
    const allProgress = dbService.getAllProgress(userId);
    res.json(allProgress);
  } catch (error) {
    console.error('Get all progress error:', error);
    res.status(500).json({ error: 'Failed to get all progress' });
  }
});

// Delete progress
router.delete('/', async (req, res) => {
  try {
    const { mediaType, mediaId, userId = 'anonymous', season, episode } = req.query;
    
    if (!mediaType || !mediaId) {
      return res.status(400).json({ error: 'mediaType and mediaId are required' });
    }

    dbService.deleteProgress({ mediaType, mediaId, userId, season, episode });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete progress error:', error);
    res.status(500).json({ error: 'Failed to delete progress' });
  }
});

export default router;
