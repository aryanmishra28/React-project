const express = require('express');
const router = express.Router();
const hackathonController = require('../controllers/hackathonController');


router.post('/generate-ideas', hackathonController.generateIdeas);

module.exports = router;