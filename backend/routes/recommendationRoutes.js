const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getSuggestedNgos } = require('../controllers/recommendationController');

// Protected route: donors query suggestions
router.post('/suggest-ngos', authMiddleware, getSuggestedNgos);

module.exports = router;