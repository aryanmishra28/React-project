const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');

router.post('/analyze', resumeController.analyzeResume);

module.exports = router;