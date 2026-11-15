/**
 * Intelligent AI Matchmaking Engine for Food Surplus Distribution
 */

function calculateMatchScore({ ngo, foodDetails }) {
  let score = 0;
  let reasons = [];

  const { quantity, foodType, foodAge, city } = foodDetails;

  // 1. Capacity Compatibility (40 points)
  if (ngo.ngoCapacity >= quantity) {
    score += 40;
    const buffer = ngo.ngoCapacity - quantity;
    if (buffer <= 50) {
      reasons.push(`Optimal capacity fit (NGO capacity: ${ngo.ngoCapacity}, food: ${quantity} servings)`);
    } else {
      reasons.push(`Easily handles quantity with ${ngo.ngoCapacity} capacity`);
    }
  } else {
    // Partial capacity penalty
    const ratio = ngo.ngoCapacity / quantity;
    score += Math.round(ratio * 20);
    reasons.push(`NGO capacity (${ngo.ngoCapacity}) is less than requested quantity (${quantity})`);
  }

  // 2. Food Type Compatibility (25 points)
  const acceptsDiet = ngo.acceptedFoodTypes && ngo.acceptedFoodTypes.some(
    (type) => type.toLowerCase() === foodType.toLowerCase() || type.toLowerCase() === 'all'
  );

  if (acceptsDiet) {
    score += 25;
    reasons.push(`Accepts ${foodType} meals`);
  } else {
    score += 5;
    reasons.push(`Primary preference differs from ${foodType}`);
  }

  // 3. Location & Proximity (20 points)
  if (ngo.city && city && ngo.city.toLowerCase() === city.toLowerCase()) {
    score += 20;
    reasons.push(`Located locally in ${ngo.city} for rapid dispatch`);
  } else {
    score += 5;
  }

  // 4. Freshness & Urgency Handling (15 points)
  const isUrgent = foodAge.toLowerCase().includes('3') || 
                   foodAge.toLowerCase().includes('4') || 
                   foodAge.toLowerCase().includes('more');

  if (isUrgent) {
    if (ngo.ngoCapacity >= quantity * 1.2) {
      score += 15;
      reasons.push(`High distribution readiness for urgent food consumption (${foodAge})`);
    } else {
      score += 8;
    }
  } else {
    // Food is very fresh
    score += 15;
    reasons.push(`Food is fresh (${foodAge}); standard pickup suitable`);
  }

  // Normalize final match score out of 100
  const matchPercentage = Math.min(Math.max(score, 10), 99);

  return {
    matchPercentage,
    aiReasoning: reasons.join(' • '),
    urgencyLevel: isUrgent ? 'High - Immediate Pickup Recommended' : 'Normal',
  };
}

module.exports = { calculateMatchScore };