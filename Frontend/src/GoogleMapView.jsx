import React, { useState, useEffect } from 'react';
import { api, calculateDistanceKm, CITY_COORDINATES } from './api';

// Icons
const IconMap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" x2="9" y1="3" y2="18" />
    <line x1="15" x2="15" y1="6" y2="21" />
  </svg>
);

const IconNavigation = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);

const IconExternal = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" x2="21" y1="14" y2="3" />
  </svg>
);

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" x2="16.65" y1="21" y2="16.65" />
  </svg>
);

const IconPin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconBuilding = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M8 10h.01" />
    <path d="M16 10h.01" />
  </svg>
);

const IconHotel = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18" />
    <path d="M19 21v-4" />
    <path d="M19 11a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v10" />
    <path d="M9 11h6" />
  </svg>
);

const IconRestaurant = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" />
    <path d="M15 11v11" />
    <path d="M5 2v20" />
    <path d="M2 2h6" />
    <path d="M2 6h6" />
  </svg>
);

const IconHeart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const IconCrosshair = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="22" y1="12" x2="18" y2="12" />
    <line x1="6" y1="12" x2="2" y2="12" />
    <line x1="12" y1="6" x2="12" y2="2" />
    <line x1="12" y1="22" x2="12" y2="18" />
  </svg>
);

export default function GoogleMapView({
  markers = [],
  user = null,
  onAcceptDonation = null,
  initialCity = 'All Cities',
  onRegisterNgoClick = null,
}) {
  const [selectedCity, setSelectedCity] = useState(initialCity || 'All Cities');
  // 'all', 'mess', 'hotel', 'restaurant', 'ngo_shelter', 'nearby_shelters'
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapZoom, setMapZoom] = useState(13);
  const [mapType, setMapType] = useState('m'); // 'm' for roadmap, 'k' for satellite

  // Proximity "Find Nearby NGO Shelters" state
  const [userCoords, setUserCoords] = useState(
    user?.lat && user?.lng
      ? { lat: user.lat, lng: user.lng, label: user.address || user.city }
      : { lat: 19.0760, lng: 72.8777, label: 'Mumbai Centre' }
  );
  const [nearbyRadiusKm, setNearbyRadiusKm] = useState(10);
  const [locatingUser, setLocatingUser] = useState(false);
  const [geoNotice, setGeoNotice] = useState('');
  const [googlePlaces, setGooglePlaces] = useState([]);
  const [mapsSearchBusy, setMapsSearchBusy] = useState(false);
  const [travelTimeLimit, setTravelTimeLimit] = useState(60);

  useEffect(() => {
    if (markers.length > 0 && !selectedLocation) {
      setSelectedLocation(markers[0]);
    }
  }, [markers]);

  // Handle GPS Geolocation
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoNotice('Geolocation is not supported by your browser.');
      return;
    }
    setLocatingUser(true);
    setGeoNotice('Detecting your GPS location...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: 'Your Current GPS Location',
        });
        setLocatingUser(false);
        setActiveFilter('nearby_shelters');
        setGeoNotice(`Located! Finding nearby NGO shelter homes within ${nearbyRadiusKm} km.`);
        setTimeout(() => setGeoNotice(''), 4000);
      },
      (err) => {
        setLocatingUser(false);
        setGeoNotice('Location access denied. Using city coordinates instead.');
        setTimeout(() => setGeoNotice(''), 3000);
      },
      { timeout: 10000 }
    );
  };

  // Filter markers and compute real distances
  const processedMarkers = [...markers, ...googlePlaces].map((m) => {
    let distance = null;
    if (userCoords?.lat && userCoords?.lng && m.lat && m.lng) {
      distance = m.distanceKm ?? calculateDistanceKm(userCoords.lat, userCoords.lng, m.lat, m.lng);
    }
    return { ...m, distanceKm: distance };
  });

  const filteredMarkers = processedMarkers.filter((m) => {
    // City filter
    const matchesCity =
      selectedCity === 'All Cities' || m.city?.toLowerCase() === selectedCity.toLowerCase();

    // Type filter
    let matchesType = true;
    if (activeFilter === 'mess') {
      matchesType = m.type === 'donation' && m.donorType === 'Hostel Mess';
    } else if (activeFilter === 'hotel') {
      matchesType = m.type === 'donation' && m.donorType === 'Hotel';
    } else if (activeFilter === 'restaurant') {
      matchesType = m.type === 'donation' && m.donorType === 'Restaurant';
    } else if (activeFilter === 'ngo_shelter') {
      matchesType = m.type === 'ngo';
    } else if (activeFilter === 'nearby_shelters') {
      // Must be an NGO / Shelter home and within radius
      const isShelter = m.type === 'ngo';
      const withinRadius = m.googleMapsUri ? true : m.distanceKm === null || m.distanceKm <= nearbyRadiusKm;
      matchesType = isShelter && withinRadius;
    }

    // Search term
    const matchesSearch =
      !searchTerm ||
      m.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.shelterType?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCity && matchesType && matchesSearch;
  });

  // Sort by distance if in "nearby_shelters" mode
  if (activeFilter === 'nearby_shelters') {
    filteredMarkers.sort((a, b) => {
      if (a.travelTimeMinutes != null || b.travelTimeMinutes != null) {
        return (a.travelTimeMinutes ?? Infinity) - (b.travelTimeMinutes ?? Infinity);
      }
      return (a.distanceKm || 999) - (b.distanceKm || 999);
    });
  }

  // Google Maps Embed Query logic
  const getMapEmbedUrl = () => {
    let query = 'NGO shelter homes India';

    if (selectedLocation?.googleMapsUri) {
      query = `${selectedLocation.title}, ${selectedLocation.address}, ${selectedLocation.city}`;
    } else if (activeFilter === 'nearby_shelters') {
      query = `NGO shelter homes orphanage near ${userCoords.lat},${userCoords.lng}`;
    } else if (selectedLocation) {
      query = `${selectedLocation.title}, ${selectedLocation.address}, ${selectedLocation.city}`;
    } else if (selectedCity !== 'All Cities') {
      query = `NGO shelter homes hostel mess in ${selectedCity}, India`;
    }

    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=${mapType}&z=${mapZoom}&ie=UTF8&iwloc=&output=embed`;
  };

  const openGoogleMapsDirections = (loc) => {
    if (!loc) return;
    if (loc.googleMapsUri) {
      window.open(loc.googleMapsUri, '_blank', 'noopener,noreferrer');
      return;
    }
    const dest = encodeURIComponent(`${loc.title}, ${loc.address}, ${loc.city}`);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank');
  };

  const openGoogleMapsSearch = (query) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
  };

  const findNgosByTravelTime = async (minutes = travelTimeLimit) => {
    setTravelTimeLimit(minutes);
    setActiveFilter('nearby_shelters');
    setMapsSearchBusy(true);
    setGeoNotice(`Searching Google Maps for NGOs within ${minutes === 60 ? '1 hour' : '1.5 hours'} driving time...`);
    try {
      const result = await api.findNearbyNgosOnGoogleMaps({
        lat: userCoords.lat,
        lng: userCoords.lng,
        city: selectedCity !== 'All Cities'
          ? selectedCity
          : userCoords.label?.includes('GPS')
            ? ''
            : userCoords.label?.replace(/ Centre$/, '') || '',
        maxTravelMinutes: minutes,
      });
      setGooglePlaces(result.places || []);
      setGeoNotice(result.places?.length
        ? `Google Maps found ${result.places.length} listing(s) within ${minutes} minutes by car (traffic-aware estimate at search time).`
        : `No Google Maps listings with a driving route within ${minutes} minutes. Try the 1.5 hour search.`);
      if (result.places?.length) setSelectedLocation(result.places[0]);
    } catch (error) {
      if (error.code === 'GOOGLE_MAPS_NOT_CONFIGURED') {
        setGeoNotice('In-app travel-time filtering needs a Google Maps API key. Use the Google Maps search button to browse nearby listings.');
      } else {
        setGeoNotice(error.message || 'Google Maps search could not be completed.');
      }
      setGooglePlaces([]);
    } finally {
      setMapsSearchBusy(false);
    }
  };

  const cities = ['All Cities', 'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Sri Ganganagar'];

  return (
    <div className="google-map-container">
      {/* NGO Registration Callout Banner */}
      <div className="ngo-register-callout">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 800 }}>
            NGO SHELTER ONBOARDING
          </span>
          <span style={{ fontSize: '0.88rem' }}>
            Are you a registered <strong>NGO, Orphanage, or Relief Shelter Home</strong>? Register now to appear on the Google Maps radar.
          </span>
        </div>
        <button
          className="btn btn-secondary btn-sm"
          style={{ background: '#ffffff', color: '#065f46', fontWeight: 800, padding: '7px 16px', borderRadius: 8 }}
          onClick={onRegisterNgoClick}
        >
          Register Your NGO / Shelter &rarr;
        </button>
      </div>

      {/* Map Header & Proximity Radar Controls */}
      <div className="map-top-bar">
        <div className="map-title-area">
          <div className="map-badge">
            <span className="live-dot"></span>
            GOOGLE MAPS LIVE RADAR &bull; MULTI-TENANT NETWORK
          </div>
          <h2>Live Surplus Food & Nearby NGO Shelter Radar</h2>
          <p>
            Find nearby NGO shelter homes, orphanages, and food distribution charities around university hostel messes, 5-star hotels, and restaurants.
          </p>
        </div>

        {/* City Filter Pills */}
        <div className="map-city-pills">
          {cities.map((city) => (
            <button
              key={city}
              className={`city-pill ${selectedCity === city ? 'active' : ''}`}
              onClick={() => {
                setSelectedCity(city);
                if (CITY_COORDINATES[city]) {
                  setUserCoords({
                    ...CITY_COORDINATES[city],
                    label: city + ' Centre',
                  });
                }
                const firstInCity = markers.find(
                  (m) => city === 'All Cities' || m.city?.toLowerCase() === city.toLowerCase()
                );
                if (firstInCity) setSelectedLocation(firstInCity);
              }}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Proximity "Find Nearby NGO Shelters" Action Bar */}
      <div className="map-discovery-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button
            className={`btn ${activeFilter === 'nearby_shelters' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px' }}
            onClick={() => setActiveFilter('nearby_shelters')}
          >
            <IconPin />
            <strong>Find Nearby NGO Shelter Homes</strong>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px' }}
            onClick={handleUseMyLocation}
            disabled={locatingUser}
          >
            <IconCrosshair />
            {locatingUser ? 'Locating...' : 'Use My GPS Location'}
          </button>

          {activeFilter === 'nearby_shelters' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#475569' }}>
                <span>Registered NGOs:</span>
              {[3, 5, 10, 25].map((r) => (
                <button
                  key={r}
                  className={`city-pill ${nearbyRadiusKm === r ? 'active' : ''}`}
                  style={{ padding: '3px 10px', fontSize: '0.75rem' }}
                  onClick={() => setNearbyRadiusKm(r)}
                >
                  {r} km
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="map-discovery-actions">
          <button
            className="btn btn-primary btn-sm"
            style={{ marginRight: 8, fontSize: '0.8rem' }}
            onClick={onRegisterNgoClick}
          >
            <IconHeart /> Register as NGO
          </button>
          <button
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}
            onClick={() => findNgosByTravelTime()}
            disabled={mapsSearchBusy}
          >
            <IconExternal /> {mapsSearchBusy ? 'Searching Google Maps...' : 'Find NGOs within 1 hour'}
          </button>
          <button
            className="btn btn-secondary btn-sm"
            style={{ marginLeft: 8, fontSize: '0.8rem' }}
            onClick={() => findNgosByTravelTime(90)}
            disabled={mapsSearchBusy}
          >
            Find within 1.5 hours
          </button>
          <button
            className="btn btn-secondary btn-sm"
            style={{ marginLeft: 8, fontSize: '0.8rem' }}
            onClick={() => openGoogleMapsSearch(`NGO near ${userCoords.lat},${userCoords.lng}`)}
          >
            Open Google Maps Search
          </button>
        </div>
      </div>

      {geoNotice && (
        <div style={{ background: '#ecfdf5', color: '#065f46', padding: '8px 28px', fontSize: '0.82rem', borderBottom: '1px solid #a7f3d0' }}>
          {geoNotice}
        </div>
      )}

      {/* Main Map + Sidebar Split View */}
      <div className="map-split-view">
        {/* Left Side: Locations Feed */}
        <div className="map-sidebar">
          {/* Search Box */}
          <div className="map-search-box">
            <div className="search-input-wrapper">
              <IconSearch />
              <input
                type="text"
                placeholder="Search shelter, orphanage, mess, hotel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-btn" onClick={() => setSearchTerm('')}>
                  &times;
                </button>
              )}
            </div>

            {/* Multi-Tenant Filter Row */}
            <div className="type-toggle-row" style={{ flexWrap: 'wrap' }}>
              <button
                className={`type-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All ({markers.length + googlePlaces.length})
              </button>
              <button
                className={`type-btn ${activeFilter === 'mess' ? 'active' : ''}`}
                onClick={() => setActiveFilter('mess')}
              >
                <IconBuilding /> Messes ({markers.filter((m) => m.donorType === 'Hostel Mess').length})
              </button>
              <button
                className={`type-btn ${activeFilter === 'hotel' ? 'active' : ''}`}
                onClick={() => setActiveFilter('hotel')}
              >
                <IconHotel /> Hotels ({markers.filter((m) => m.donorType === 'Hotel').length})
              </button>
              <button
                className={`type-btn ${activeFilter === 'restaurant' ? 'active' : ''}`}
                onClick={() => setActiveFilter('restaurant')}
              >
                <IconRestaurant /> Restaurants ({markers.filter((m) => m.donorType === 'Restaurant').length})
              </button>
              <button
                className={`type-btn ${activeFilter === 'ngo_shelter' ? 'active' : ''}`}
                onClick={() => setActiveFilter('ngo_shelter')}
                style={{ color: '#059669', borderColor: '#a7f3d0' }}
              >
                <IconHeart /> NGOs & Shelters ({markers.filter((m) => m.type === 'ngo').length + googlePlaces.length})
              </button>
            </div>
          </div>

          {/* List of Hubs */}
          <div className="hubs-list">
            {filteredMarkers.length === 0 ? (
              <div className="no-hubs-found">
                <IconPin />
                <p style={{ fontWeight: 700, color: '#0f172a' }}>No locations found in this radius.</p>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Try increasing your search radius or switching to All Hubs.
                </p>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setSelectedCity('All Cities');
                    setActiveFilter('all');
                    setSearchTerm('');
                    setNearbyRadiusKm(25);
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredMarkers.map((loc) => {
                const isSelected = selectedLocation?.id === loc.id;
                const isNGO = loc.type === 'ngo';
                const isHostel = loc.donorType === 'Hostel Mess';
                const isHotel = loc.donorType === 'Hotel';
                const isRestaurant = loc.donorType === 'Restaurant';

                return (
                  <div
                    key={loc.id}
                    className={`hub-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setMapZoom(15);
                    }}
                  >
                    <div className="hub-card-header">
                      <div
                        className="hub-icon-badge"
                        style={{
                          background: isNGO
                            ? '#ecfdf5'
                            : isHotel
                            ? '#fef3c7'
                            : isRestaurant
                            ? '#ffedd5'
                            : '#eff6ff',
                          color: isNGO
                            ? '#059669'
                            : isHotel
                            ? '#d97706'
                            : isRestaurant
                            ? '#ea580c'
                            : '#2563eb',
                        }}
                      >
                        {isNGO ? (
                          <IconHeart />
                        ) : isHotel ? (
                          <IconHotel />
                        ) : isRestaurant ? (
                          <IconRestaurant />
                        ) : (
                          <IconBuilding />
                        )}
                      </div>
                      <div className="hub-meta">
                        <span
                          className="hub-tag"
                          style={{
                            background: isNGO
                              ? '#ecfdf5'
                              : isHotel
                              ? '#fef3c7'
                              : isRestaurant
                              ? '#ffedd5'
                              : '#eff6ff',
                            color: isNGO
                              ? '#065f46'
                              : isHotel
                              ? '#92400e'
                              : isRestaurant
                              ? '#9a3412'
                              : '#1e40af',
                          }}
                        >
                          {isNGO ? (loc.shelterType || 'NGO Shelter Home') : loc.donorType}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {loc.distanceKm !== null && (
                            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#059669', background: '#ecfdf5', padding: '2px 6px', borderRadius: 4 }}>
                              📍 {loc.distanceKm} km
                            </span>
                          )}
                          {loc.travelTimeMinutes !== undefined && loc.travelTimeMinutes !== null && (
                            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#1d4ed8', background: '#eff6ff', padding: '2px 6px', borderRadius: 4 }}>
                              🚗 {loc.travelTimeMinutes} min
                            </span>
                          )}
                          <span className="hub-city">{loc.city}</span>
                        </div>
                      </div>
                    </div>

                    <h4 className="hub-title">{loc.title}</h4>
                    <p className="hub-address">{loc.address}</p>

                    <div className="hub-stats">
                      {isNGO ? (
                        <>
                          {loc.capacity ? (
                            <span className="hub-stat-item">
                              ❤️ Daily Capacity: <strong>{loc.capacity}</strong>
                            </span>
                          ) : (
                            <span className="hub-stat-item">📍 Public Google Maps listing; confirm services and capacity directly.</span>
                          )}
                      {isNGO && loc.travelTimeMinutes !== undefined && loc.travelTimeMinutes !== null && (
                        <span className="hub-stat-badge" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                          🚗 Google Maps drive: {loc.travelTimeMinutes} min
                        </span>
                      )}
                          {loc.residentCount && (
                            <span className="hub-stat-badge" style={{ background: '#ecfdf5', color: '#065f46' }}>
                              🏠 {loc.residentCount}
                            </span>
                          )}
                          {loc.logisticsType && (
                            <span className="hub-stat-badge">🚚 {loc.logisticsType}</span>
                          )}
                        </>
                      ) : (
                        <>
                          <span className="hub-stat-item">
                            🍲 Surplus: <strong>{loc.quantity}</strong> ({loc.foodType})
                          </span>
                          <span className="hub-stat-badge">
                            ⏱️ {loc.foodAge}
                          </span>
                        </>
                      )}
                    </div>

                    {loc.pickupGate && (
                      <div className="hub-gate-note">
                        🚪 <strong>Pickup Bay:</strong> {loc.pickupGate}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Interactive Google Map */}
        <div className="map-view-panel">
          <div className="map-toolbar">
            <div className="map-view-controls">
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 6 }}>
                <IconMap /> Google Maps View
              </span>
              <div className="map-type-buttons">
                <button
                  className={`btn-toggle-type ${mapType === 'm' ? 'active' : ''}`}
                  onClick={() => setMapType('m')}
                  title="Roadmap View"
                >
                  Map
                </button>
                <button
                  className={`btn-toggle-type ${mapType === 'k' ? 'active' : ''}`}
                  onClick={() => setMapType('k')}
                  title="Satellite View"
                >
                  Satellite
                </button>
              </div>
            </div>

            <div className="zoom-controls">
              <button
                className="btn-zoom"
                onClick={() => setMapZoom((prev) => Math.min(prev + 1, 19))}
                title="Zoom In"
              >
                +
              </button>
              <button
                className="btn-zoom"
                onClick={() => setMapZoom((prev) => Math.max(prev - 1, 8))}
                title="Zoom Out"
              >
                -
              </button>
            </div>
          </div>

          {/* Embedded Google Maps Frame */}
          <div className="google-map-iframe-wrapper">
            <iframe
              title="Food Rescue Google Map"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src={getMapEmbedUrl()}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            {/* Floating Location Overlay Card */}
            {selectedLocation && (
              <div className="map-floating-card">
                <div className="floating-card-top">
                  <div>
                    <span
                      className="badge"
                      style={{
                        background: selectedLocation.type === 'ngo' ? '#ecfdf5' : '#eff6ff',
                        color: selectedLocation.type === 'ngo' ? '#065f46' : '#1e40af',
                      }}
                    >
                      {selectedLocation.type === 'ngo'
                        ? (selectedLocation.shelterType || 'NGO Shelter Home')
                        : selectedLocation.donorType}
                    </span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: 4 }}>
                      {selectedLocation.title}
                    </h3>
                  </div>
                  <div className="floating-actions">
                    <button
                      className="btn-icon-map"
                      onClick={() => openGoogleMapsDirections(selectedLocation)}
                      title="Navigate via Google Maps"
                    >
                      <IconNavigation />
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4 }}>
                  📍 {selectedLocation.address}, <strong>{selectedLocation.city}</strong>
                  {selectedLocation.distanceKm !== null && (
                    <strong style={{ color: '#059669', marginLeft: 8 }}>
                      ({selectedLocation.distanceKm} km from you)
                    </strong>
                  )}
                </p>

                {selectedLocation.type === 'ngo' ? (
                  <div className="floating-details-grid">
                    <div>
                      <span>{selectedLocation.capacity ? 'Daily Capacity:' : 'Listing source:'}</span>
                      <strong>{selectedLocation.capacity || 'Google Maps; confirm directly'}</strong>
                    </div>
                    <div>
                      <span>Logistics Fleet:</span>
                      <strong>{selectedLocation.logisticsType || 'Confirm with NGO'}</strong>
                    </div>
                    {selectedLocation.residentCount && (
                      <div>
                        <span>Shelter Residents:</span>
                        <strong>{selectedLocation.residentCount}</strong>
                      </div>
                    )}
                    {selectedLocation.contactPerson && (
                      <div>
                        <span>Coordinator:</span>
                        <strong>{selectedLocation.contactPerson}</strong>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="floating-details-grid">
                    <div>
                      <span>Surplus Available:</span>
                      <strong>{selectedLocation.quantity} ({selectedLocation.foodType})</strong>
                    </div>
                    <div>
                      <span>Freshness Window:</span>
                      <strong>{selectedLocation.foodAge}</strong>
                    </div>
                    {selectedLocation.pickupGate && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <span>Pickup Gate:</span>
                        <strong>{selectedLocation.pickupGate}</strong>
                      </div>
                    )}
                  </div>
                )}

                {/* Direct Google Maps Action Buttons */}
                <div className="floating-card-buttons">
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    onClick={() => openGoogleMapsDirections(selectedLocation)}
                  >
                    <IconNavigation />
                    Navigate via Google Maps
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    onClick={() => openGoogleMapsSearch(`${selectedLocation.title}, ${selectedLocation.address}`)}
                    title="Open Full Place in Google Maps"
                  >
                    <IconExternal />
                    View on Google Maps
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
