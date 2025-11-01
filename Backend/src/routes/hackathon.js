const express = require('express');
const router = express.Router();
const hackathonController = require('../controllers/hackathonController');

// Generate project ideas for hackathons (uses OpenAI)
router.post('/generate-ideas', hackathonController.generateIdeas);

// Fetch actual hackathon events (from MongoDB database)
router.get('/list', hackathonController.getHackathons);

// Sync hackathons from external sources (Devpost, etc.) - Optional
router.post('/sync', hackathonController.syncFromDevpost);

module.exports = router;