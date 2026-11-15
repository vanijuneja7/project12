const express = require('express');
const router = express.Router();
const { findNearbyNgos } = require('../controllers/mapController');

router.post('/nearby-ngos', findNearbyNgos);

module.exports = router;
