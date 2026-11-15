const GOOGLE_ROUTES_MATRIX_URL = 'https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix';

class RouteCheckError extends Error {
  constructor(statusCode, publicMessage) {
    super(publicMessage);
    this.statusCode = statusCode;
    this.publicMessage = publicMessage;
  }
}

const getDrivingRoute = async (origin, destination) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new RouteCheckError(503, 'Driving-time verification is unavailable. Please contact support.');
  }

  if (!origin || !destination) {
    throw new RouteCheckError(400, 'Both organizations need a complete address before this request can be accepted.');
  }

  let response;
  try {
    response = await fetch(GOOGLE_ROUTES_MATRIX_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'originIndex,destinationIndex,duration,distanceMeters,status,condition',
      },
      body: JSON.stringify({
        origins: [{ waypoint: { address: origin } }],
        destinations: [{ waypoint: { address: destination } }],
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_AWARE',
        regionCode: 'IN',
      }),
      signal: AbortSignal.timeout(15000),
    });
  } catch (error) {
    console.error('Google Routes request failed:', error.name);
    throw new RouteCheckError(502, 'Could not verify driving time right now. Please try again.');
  }

  if (!response.ok) {
    const details = await response.text();
    console.error('Google Routes returned an error:', response.status, details);
    throw new RouteCheckError(502, 'Could not verify driving time right now. Please try again.');
  }

  const routeRows = await response.json();
  const route = routeRows.find((row) => row.originIndex === 0 && row.destinationIndex === 0);
  if (route?.condition !== 'ROUTE_EXISTS' || !route.duration) {
    throw new RouteCheckError(400, 'No driving route could be found between these locations, so the request cannot be accepted.');
  }

  const durationSeconds = Number.parseFloat(route.duration.replace(/s$/, ''));
  if (!Number.isFinite(durationSeconds)) {
    throw new RouteCheckError(502, 'Could not verify driving time right now. Please try again.');
  }

  return {
    durationSeconds,
    durationMinutes: Math.ceil(durationSeconds / 60),
    distanceMeters: route.distanceMeters,
  };
};

module.exports = { getDrivingRoute, RouteCheckError };
