const User = require('../models/User');
const { calculateMatchScore } = require('../services/aiMatchingService');

// @desc    Get AI-recommended NGOs for a food donation
// @route   POST /api/recommendations/suggest-ngos
// @access  Private (Donor)
exports.getSuggestedNgos = async (req, res) => {
  try {
    const { quantity, foodType, foodAge, city } = req.body;

    if (!quantity || !foodType) {
      return res.status(400).json({ message: 'Quantity and food type are required for AI recommendation.' });
    }

    // 1. Fetch all registered NGOs
    const ngos = await User.find({ role: 'ngo' }).select(
      'name email city address ngoCapacity acceptedFoodTypes'
    );

    if (ngos.length === 0) {
      return res.json({
        message: 'No registered NGOs found yet.',
        suggestions: [],
      });
    }

    // 2. Score and rank NGOs using AI logic
    const donorCity = city || (req.user && req.user.city) || '';
    const foodDetails = {
      quantity: Number(quantity),
      foodType,
      foodAge: foodAge || 'Fresh',
      city: donorCity,
    };

    const scoredNgos = ngos.map((ngo) => {
      const matchResult = calculateMatchScore({
        ngo,
        foodDetails,
      });

      return {
        ngoId: ngo._id,
        ngoName: ngo.name,
        city: ngo.city,
        capacity: ngo.ngoCapacity,
        acceptedFoodTypes: ngo.acceptedFoodTypes,
        matchPercentage: matchResult.matchPercentage,
        aiReasoning: matchResult.aiReasoning,
        urgencyLevel: matchResult.urgencyLevel,
      };
    });

    // 3. Sort by highest match percentage first
    scoredNgos.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json({
      message: 'AI matched top NGOs successfully!',
      suggestions: scoredNgos,
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ message: 'Server error generating NGO recommendations.' });
  }
};