const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  createDonation,
  getMyDonations,
  getNgoFeed,
  acceptDonation,
  declineDonation,
  completeDonation,
  getPublicMapMarkers,
} = require('../controllers/donationController');

// Public endpoints (no authentication required)
router.get('/public-map', getPublicMapMarkers);

// All subsequent donation routes require authentication
router.use(authMiddleware);

// Donor endpoints
router.post('/', createDonation);
router.get('/my-donations', getMyDonations);

// NGO endpoints
router.get('/ngo-feed', getNgoFeed);
router.put('/:id/accept', acceptDonation);
router.put('/:id/decline', declineDonation);
router.put('/:id/complete', completeDonation);

module.exports = router;
