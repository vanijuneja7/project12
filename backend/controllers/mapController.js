const GOOGLE_PLACES_SEARCH_URL = 'https://places.googleapis.com/v1/places:searchText';
const GOOGLE_ROUTES_MATRIX_URL = 'https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix';

const googleHeaders = (apiKey, fieldMask) => ({
  'Content-Type': 'application/json',
  'X-Goog-Api-Key': apiKey,
  'X-Goog-FieldMask': fieldMask,
});

exports.findNearbyNgos = async (req, res) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      message: 'Google Maps search is not configured. Add GOOGLE_MAPS_API_KEY to backend/.env and enable Places API (New) and Routes API.',
      code: 'GOOGLE_MAPS_NOT_CONFIGURED',
    });
  }

  const latitude = Number(req.body?.lat);
  const longitude = Number(req.body?.lng);
  const city = String(req.body?.city || '').trim();
  const maxTravelMinutes = Number(req.body?.maxTravelMinutes);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
      ![60, 90].includes(maxTravelMinutes)) {
    return res.status(400).json({ message: 'Provide a valid origin and a 60 or 90 minute travel limit.' });
  }

  try {
    const placeResponse = await fetch(GOOGLE_PLACES_SEARCH_URL, {
      method: 'POST',
      headers: googleHeaders(apiKey, 'places.id,places.displayName,places.formattedAddress,places.location,places.googleMapsUri'),
      body: JSON.stringify({
        textQuery: 'NGO',
        maxResultCount: 20,
        rankPreference: 'DISTANCE',
        locationBias: {
          circle: {
            center: { latitude, longitude },
            radius: 50000,
          },
        },
      }),
    });
    if (!placeResponse.ok) {
      const details = await placeResponse.text();
      console.error('Google Places search failed:', details);
      return res.status(502).json({ message: 'Google Maps could not search for nearby NGOs. Check Places API access and billing.' });
    }

    const { places = [] } = await placeResponse.json();
    const locatedPlaces = places.filter((place) =>
      Number.isFinite(place.location?.latitude) && Number.isFinite(place.location?.longitude)
    );
    if (!locatedPlaces.length) return res.json({ places: [] });

    const routeResponse = await fetch(GOOGLE_ROUTES_MATRIX_URL, {
      method: 'POST',
      headers: googleHeaders(apiKey, 'originIndex,destinationIndex,duration,distanceMeters,status,condition'),
      body: JSON.stringify({
        origins: [{ waypoint: { location: { latLng: { latitude, longitude } } } }],
        destinations: locatedPlaces.map((place) => ({
          waypoint: {
            location: {
              latLng: {
                latitude: place.location.latitude,
                longitude: place.location.longitude,
              },
            },
          },
        })),
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_AWARE',
      }),
    });
    if (!routeResponse.ok) {
      const details = await routeResponse.text();
      console.error('Google Routes matrix failed:', details);
      return res.status(502).json({ message: 'Google Maps found places but could not calculate driving times. Check Routes API access and billing.' });
    }

    const routeRows = await routeResponse.json();
    const routesByIndex = new Map(routeRows
      .filter((route) => route.condition === 'ROUTE_EXISTS' && route.duration)
      .map((route) => [route.destinationIndex, route]));

    const matches = locatedPlaces.map((place, index) => {
      const route = routesByIndex.get(index);
      const seconds = route ? Number.parseFloat(route.duration.replace('s', '')) : null;
      return {
        id: place.id,
        title: place.displayName?.text || 'Nearby NGO or charity',
        address: place.formattedAddress || '',
        lat: place.location.latitude,
        lng: place.location.longitude,
        city,
        type: 'ngo',
        category: 'Google Maps NGO / charity result',
        shelterType: 'Google Maps listing',
        googleMapsUri: place.googleMapsUri,
        distanceKm: route?.distanceMeters ? Math.round(route.distanceMeters / 100) / 10 : null,
        travelTimeMinutes: seconds === null ? null : Math.round(seconds / 60),
      };
    }).filter((place) => place.travelTimeMinutes !== null && place.travelTimeMinutes <= maxTravelMinutes)
      .sort((a, b) => a.travelTimeMinutes - b.travelTimeMinutes);

    res.json({ places: matches, maxTravelMinutes });
  } catch (error) {
    console.error('Nearby NGO lookup failed:', error);
    res.status(500).json({ message: 'Unable to search Google Maps for nearby NGOs right now.' });
  }
};
