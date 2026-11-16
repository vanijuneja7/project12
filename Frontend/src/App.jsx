import React, { useState, useEffect } from 'react';
import { api, CITY_COORDINATES } from './api';
import GoogleMapView from './GoogleMapView';
import './App.css';

// Professional SVG Icons
const IconLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IconMapPin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
  </svg>
);

const IconBuilding = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M8 10h.01" />
    <path d="M16 10h.01" />
  </svg>
);

const IconHotel = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18" />
    <path d="M19 21v-4" />
    <path d="M19 11a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v10" />
    <path d="M9 11h6" />
  </svg>
);

const IconHeart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const IconNavigation = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);

const IconChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconSparkles = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

const IconCompass = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const IconAward = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('foodrescue-theme');
    return savedTheme === 'dark' ? 'dark' : 'light';
  });
  // Pages: 'home', 'map', 'dashboard', 'contact', 'auth' (Notice 'impact' is mentioned at the end of the page as requested)
  const [currentPage, setCurrentPage] = useState('home');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  // Multi-step Registration: 'select_role', 'mess_details', 'hotel_details', 'ngo_details'
  const [regStep, setRegStep] = useState('select_role');
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [submittingAuth, setSubmittingAuth] = useState(false);

  // Map Data
  const [mapMarkers, setMapMarkers] = useState([]);

  // Auth Form State (Supporting Register as Hostel Mess, Register as Hotel, Register as NGO)
  const [authData, setAuthData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'donor', // 'donor' or 'ngo'
    phone: '',
    city: 'Mumbai',
    address: '',
    landmark: '',
    contactPerson: '',
    // Donor Specific
    donorType: 'Hostel Mess', // 'Hostel Mess', 'Hotel', 'Restaurant', etc.
    pickupGate: '',
    preferredTimings: 'Lunch (2:30 PM - 4:00 PM) & Dinner (9:30 PM - 11:30 PM)',
    dailySurplusEst: 60,
    fssaiOrGovId: '',
    // NGO Specific
    ngoCapacity: 120,
    regNumber: '',
    shelterType: 'Child Care Home & Orphanage',
    residentCount: '65 children',
    logisticsType: 'Own Distribution Van & Volunteers',
    acceptedFoodTypes: ['Veg', 'Cooked Meals'],
    agreeTerms: true,
    lat: 19.0760,
    lng: 72.8777,
  });

  // Food Donation Form State
  const [donationForm, setDonationForm] = useState({
    foodType: 'Veg',
    foodCategory: 'Cooked Meal',
    quantity: 50,
    quantityUnit: 'servings',
    foodAge: 'Freshly prepared (within 1 hr)',
    imageUrl: 'https://images.unsplash.com/photo-1618245472861-b2b4e88431ed?auto=format&fit=crop&w=600&q=80',
    notes: '',
  });

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    orgType: 'Hostel Mess',
    message: '',
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Data lists
  const [myDonations, setMyDonations] = useState([]);
  const [ngoFeed, setNgoFeed] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [submittingDonation, setSubmittingDonation] = useState(false);
  const [processingRequestId, setProcessingRequestId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('foodrescue-theme', theme);
  }, [theme]);

  // Load Map Markers on mount
  useEffect(() => {
    loadMapMarkers();
  }, []);

  const loadMapMarkers = async () => {
    const data = await api.getMapMarkers();
    if (Array.isArray(data)) {
      setMapMarkers(data);
    }
  };

  // Auto-login if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getMe().then((data) => {
        if (data && (data._id || data.id)) {
          setUser(data);
        }
      }).catch(() => localStorage.removeItem('token'));
    }
  }, []);

  // Fetch role-specific lists when user logs in
  useEffect(() => {
    if (!user) return;
    if (user.role === 'donor') {
      loadDonorDonations();
    } else if (user.role === 'ngo') {
      loadNgoFeed();
    }
  }, [user]);

  const loadDonorDonations = async () => {
    const res = await api.getMyDonations();
    if (Array.isArray(res)) setMyDonations(res);
  };

  const loadNgoFeed = async () => {
    const res = await api.getNgoFeed();
    if (Array.isArray(res)) setNgoFeed(res);
  };

  // Keep request status current while the dashboard is open on both sides.
  useEffect(() => {
    if (!user || currentPage !== 'dashboard') return undefined;

    const refreshRequests = () => {
      if (user.role === 'donor') {
        api.getMyDonations().then((res) => {
          if (Array.isArray(res)) setMyDonations(res);
        }).catch(() => {});
      } else if (user.role === 'ngo') {
        api.getNgoFeed().then((res) => {
          if (Array.isArray(res)) setNgoFeed(res);
        }).catch(() => {});
      }
    };

    const intervalId = window.setInterval(refreshRequests, 15000);
    window.addEventListener('focus', refreshRequests);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', refreshRequests);
    };
  }, [user, currentPage]);

  // Auth Handlers
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (authMode === 'register') {
      if (authData.password && authData.confirmPassword && authData.password !== authData.confirmPassword) {
        setMessage('Passwords do not match. Please verify.');
        return;
      }
    }

    try {
      if (authMode === 'login') {
        const res = await api.login({ email: authData.email, password: authData.password });
        if (res.token) {
          localStorage.setItem('token', res.token);
          setUser(res.user);
          setCurrentPage('dashboard');
          setMessage('Welcome back! Signed in successfully.');
        } else {
          setMessage(res.message || 'Login failed. Please check credentials.');
        }
      } else {
        const res = await api.register(authData);
        if (res.token) {
          localStorage.setItem('token', res.token);
          setUser(res.user);
          setCurrentPage('dashboard');
          setMessage('Account registered successfully! Welcome to FoodRescue AI.');
          loadMapMarkers();
        } else {
          setMessage(res.message || 'Registration failed.');
        }
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('local_demo_user');
    setUser(null);
    setAiSuggestions([]);
    setSelectedNgo(null);
    setCurrentPage('home');
  };

  // Open Registration directly into: 'mess', 'hotel', 'ngo', or 'select_role'
  const openRegister = (choice = null) => {
    setAccountDropdownOpen(false);
    setAuthMode('register');
    setMessage('');
    setCurrentPage('auth');

    if (choice === 'mess') {
      setAuthData((prev) => ({
        ...prev,
        role: 'donor',
        donorType: 'Hostel Mess',
        name: prev.name || 'Campus Central Hostel Mess (Hostel 4)',
        city: prev.city || 'Mumbai',
        address: prev.address || 'IIT Bombay Campus, Hostel 4 Rear Loading Bay, Powai',
      }));
      setRegStep('mess_details');
    } else if (choice === 'hotel') {
      setAuthData((prev) => ({
        ...prev,
        role: 'donor',
        donorType: 'Hotel',
        name: prev.name || 'The Grand Orchid Luxury Hotel & Banquets',
        city: prev.city || 'Mumbai',
        address: prev.address || 'Orchid Boulevard, Domestic Airport Road, Vile Parle East',
      }));
      setRegStep('hotel_details');
    } else if (choice === 'ngo') {
      setAuthData((prev) => ({
        ...prev,
        role: 'ngo',
        name: prev.name || 'Bal Asha Child Care Home & Orphanage',
        city: prev.city || 'Mumbai',
        address: prev.address || 'King George V Memorial, Dr. E Moses Rd, Mahalaxmi',
        shelterType: 'Child Care Home & Orphanage',
      }));
      setRegStep('ngo_details');
    } else {
      setRegStep('select_role');
    }
  };

  const openSignIn = () => {
    setAccountDropdownOpen(false);
    setAuthMode('login');
    setMessage('');
    setCurrentPage('auth');
  };

  // AI Suggestion Handler
  const handleRunAiMatch = async () => {
    setLoadingAi(true);
    setMessage('');
    try {
      const res = await api.getAiSuggestions({
        quantity: donationForm.quantity,
        foodType: donationForm.foodType,
        foodAge: donationForm.foodAge,
        city: user?.city || 'Mumbai',
      });
      if (res.suggestions) {
        setAiSuggestions(res.suggestions);
      }
    } catch (err) {
      setMessage('Failed to get AI recommendations. Ensure backend is active.');
    } finally {
      setLoadingAi(false);
    }
  };

  // Donor Submit Food Request
  const handleCreateDonation = async (e) => {
    e.preventDefault();
    if (submittingDonation || hasActiveDonation) {
      setMessage('You already have an active request. Mark it complete before posting another.');
      return;
    }
    setSubmittingDonation(true);
    setMessage('');
    try {
      const res = await api.createDonation({
        ...donationForm,
        assignedNgoId: selectedNgo ? selectedNgo.ngoId : null,
      });
      if (res.donation) {
        setMessage(res.message || 'Surplus food request posted successfully.');
        loadDonorDonations();
        loadMapMarkers();
        setAiSuggestions([]);
        setSelectedNgo(null);
        setDonationForm({
          foodType: 'Veg',
          foodCategory: 'Cooked Meal',
          quantity: 50,
          quantityUnit: 'servings',
          foodAge: 'Freshly prepared (within 1 hr)',
          imageUrl: 'https://images.unsplash.com/photo-1618245472861-b2b4e88431ed?auto=format&fit=crop&w=600&q=80',
          notes: '',
        });
      }
    } catch (err) {
      setMessage(err.message || 'Error creating donation request.');
    } finally {
      setSubmittingDonation(false);
    }
  };

  const handleAccept = async (id) => {
    if (processingRequestId) return;
    setProcessingRequestId(id);
    setMessage('');
    try {
      const res = await api.acceptDonation(id);
      setMessage(res.message || 'Request accepted.');
      if (res.donation) {
        loadNgoFeed();
        loadMapMarkers();
      }
    } catch (err) {
      setMessage(err.message || 'Unable to accept this request.');
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleDecline = async (id) => {
    if (processingRequestId) return;
    setProcessingRequestId(id);
    setMessage('');
    try {
      const res = await api.declineDonation(id);
      setMessage(res.message || 'Request declined.');
      if (res.donation) loadNgoFeed();
    } catch (err) {
      setMessage(err.message || 'Unable to decline this request.');
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleRetake = async (id) => {
    try {
      const res = await api.retakeDonation(id);
      setMessage(res.message || 'Request is back in your feed.');
      await loadNgoFeed();
    } catch (err) {
      setMessage(err.message || 'Unable to retake this request.');
    }
  };

  const handleWithdraw = async (id) => {
    if (!window.confirm('Withdraw this food request?')) return;
    setProcessingRequestId(id);
    try {
      const res = await api.withdrawDonation(id);
      setMessage(res.message || 'Request withdrawn.');
      await loadDonorDonations();
    } catch (err) {
      setMessage(err.message || 'Unable to withdraw this request.');
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this donation request permanently?')) return;
    setProcessingRequestId(id);
    setMessage('');
    try {
      const res = await api.deleteDonation(id);
      setMessage(res.message || 'Donation request deleted successfully.');
      if (user?.role === 'donor') {
        await loadDonorDonations();
      } else {
        await loadNgoFeed();
      }
      loadMapMarkers();
    } catch (err) {
      setMessage(err.message || 'Unable to delete this request.');
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleSimulateAccept = async (id) => {
    if (processingRequestId) return;
    setProcessingRequestId(id);
    setMessage('');
    try {
      const res = await api.simulateAcceptDonation(id);
      setMessage(res.message || 'Request accepted by partner NGO shelter!');
      if (user?.role === 'donor') {
        await loadDonorDonations();
      } else {
        await loadNgoFeed();
      }
      loadMapMarkers();
    } catch (err) {
      setMessage(err.message || 'Unable to accept this request.');
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleComplete = async (id) => {
    if (processingRequestId) return;
    setProcessingRequestId(id);
    setMessage('');
    try {
      const res = await api.completeDonation(id);
      setMessage(res.message || 'Request marked complete.');
      if (user?.role === 'donor') loadDonorDonations();
      else loadNgoFeed();
      loadMapMarkers();
    } catch (err) {
      setMessage(err.message || 'Unable to complete this request.');
    } finally {
      setProcessingRequestId(null);
    }
  };

  const setPresetPhoto = (url, defaultNotes) => {
    setDonationForm({
      ...donationForm,
      imageUrl: url,
      notes: defaultNotes || donationForm.notes,
    });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({
        name: '',
        email: '',
        orgType: 'Hostel Mess',
        message: '',
      });
    }, 1000);
  };

  const openExternalGoogleMap = (query) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  const dashboardRequests = user?.role === 'donor' ? myDonations : ngoFeed;
  const acceptedRequestCount = dashboardRequests.filter((item) => item.status === 'accepted').length;
  const hasActiveDonation = user?.role === 'donor' && myDonations.some((item) =>
    ['pending', 'accepted'].includes(item.status)
  );

  return (
    <div className="app-shell" data-theme={theme}>
      {/* =========================================================
         NAVIGATION BAR (Without "Our Impact" as requested)
         ========================================================= */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="brand" onClick={() => setCurrentPage(user ? 'dashboard' : 'home')}>
            <IconLogo />
            <span>FoodRescue</span> AI
          </div>

          <ul className="nav-links">
            <li>
              <button
                className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => setCurrentPage('home')}
              >
                Home
              </button>
            </li>

            {user && (
              <li>
                <button
                  className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setCurrentPage('dashboard')}
                >
                  Dashboard
                </button>
              </li>
            )}

            <li>
              <button
                className={`nav-btn ${currentPage === 'contact' ? 'active' : ''}`}
                onClick={() => setCurrentPage('contact')}
              >
                Contact Us
              </button>
            </li>
          </ul>
        </div>

        {/* Right side: Session Info & Auth Actions (Sign In / Create Account) */}
        <div className="user-info">
          <button
            type="button"
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            onClick={() => setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? '☼' : '☾'}
          </button>
          {user ? (
            <>
              <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{user.name}</span>
              <span className={`role-badge ${user.role}`}>
                {user.role === 'ngo' ? `NGO Shelter` : user.donorType || 'Donor'}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <div className="nav-auth-group">
              {/* Sign In Button */}
              <button
                className="btn btn-secondary btn-sm"
                onClick={openSignIn}
              >
                Sign In
              </button>

              {/* Create Account Button & 3 Options: Hostel Mess, Hotel, or NGO */}
              <div className="nav-dropdown-wrapper">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <span>Create Account</span>
                  <IconChevronDown />
                </button>

                {accountDropdownOpen && (
                  <div className="nav-dropdown-menu">
                    <button
                      className="dropdown-item"
                      onClick={() => openRegister('mess')}
                    >
                      <div className="dropdown-icon-box mess">
                        <IconBuilding />
                      </div>
                      <div>
                        <div className="dropdown-title">Register as Hostel Mess</div>
                        <div className="dropdown-desc">University hostel messes & canteens</div>
                      </div>
                    </button>

                    <button
                      className="dropdown-item"
                      onClick={() => openRegister('hotel')}
                    >
                      <div className="dropdown-icon-box mess" style={{ background: '#fef3c7', color: '#d97706' }}>
                        <IconHotel />
                      </div>
                      <div>
                        <div className="dropdown-title">Register as Hotel</div>
                        <div className="dropdown-desc">Hotels, banquet halls & restaurants</div>
                      </div>
                    </button>

                    <button
                      className="dropdown-item"
                      onClick={() => openRegister('ngo')}
                    >
                      <div className="dropdown-icon-box ngo">
                        <IconHeart />
                      </div>
                      <div>
                        <div className="dropdown-title">Register as NGO</div>
                        <div className="dropdown-desc">Shelter homes, orphanages & relief</div>
                      </div>
                    </button>

                    <div style={{ borderTop: '1px solid #f1f5f9', margin: '4px 0' }}></div>

                    <button
                      className="dropdown-item"
                      onClick={() => openRegister(null)}
                      style={{ fontSize: '0.8rem', color: '#64748b', padding: '8px 12px' }}
                    >
                      Compare All 3 Account Types &rarr;
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* =========================================================
         PAGE: LIVE GOOGLE MAPS RADAR
         ========================================================= */}
      {currentPage === 'map' && (
        <div className="container">
          <GoogleMapView
            markers={mapMarkers}
            user={user}
            initialCity={user?.city || 'All Cities'}
            onAcceptDonation={handleAccept}
            onRegisterNgoClick={() => openRegister('ngo')}
          />
        </div>
      )}

      {/* =========================================================
         PAGE: HOME / LANDING PAGE
         ========================================================= */}
      {currentPage === 'home' && (
        <div className="container">
          <div className="hero-banner landing-hero">
            <div>
              <span className="hero-tag">Food rescue · Zero hunger</span>
              <h1>No Food Wasted. Every Child Fed.</h1>
              <p>
                We connect surplus meals from local hostel messes, hotels, and restaurants with nearby NGO shelter homes, helping good meals reach children who need them.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  style={{ padding: '12px 24px' }}
                  onClick={() => user ? setCurrentPage('dashboard') : openRegister('mess')}
                >
                  Post Surplus Food
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 8 }}
                  onClick={() => setCurrentPage('map')}
                >
                  <IconMapPin />
                  Find Nearby NGO Shelter Homes
                </button>
              </div>
            </div>
          </div>

          <div className="landing-stats" aria-label="Platform capabilities">
            <div className="landing-stat"><strong>Local matches</strong><span>Connect surplus with nearby NGOs</span></div>
            <div className="landing-stat"><strong>Private handover</strong><span>Contact details unlock on acceptance</span></div>
            <div className="landing-stat"><strong>Flexible discovery</strong><span>Search registered and Maps listings</span></div>
            <div className="landing-stat"><strong>NGO-led packaging</strong><span>Receiving NGO brings containers</span></div>
          </div>

          {/* Quick Registration Banner: 3 direct options */}
          <div className="join-network-banner">
            <div>
              <span className="join-network-eyebrow">
                Join the Rescue Network
              </span>
              <h3>Connect your organization</h3>
              <p>
                Create a donor or NGO account to share surplus, find nearby partners, and coordinate a safe handover.
              </p>
            </div>
            <div className="join-network-actions">
              <button
                className="btn btn-primary"
                onClick={() => openRegister('mess')}
              >
                Register as Hostel Mess
              </button>
              <button
                className="btn btn-secondary join-network-secondary"
                onClick={() => openRegister('hotel')}
              >
                Register as Hotel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => openRegister('ngo')}
              >
                Register as NGO &rarr;
              </button>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="section-header">
            <h3>How food rescue works</h3>
            <p>A simple, private workflow for sharing surplus food with local organizations.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <span className="step-number">Step 01</span>
              <h4>Kitchen Posts Surplus</h4>
              <p>Hostel messes, hotels, and restaurants enter servings, dietary details, and pickup gate. Phone numbers remain locked for privacy.</p>
            </div>

            <div className="step-card">
              <span className="step-number">Step 02</span>
              <h4>Find a nearby NGO</h4>
              <p>Browse organizations registered on the platform or search Google Maps for nearby NGO listings and route times.</p>
            </div>

            <div className="step-card">
              <span className="step-number">Step 03</span>
              <h4>Acceptance & Handover</h4>
              <p>After acceptance, contact details are shared to coordinate pickup. The receiving NGO brings food-safe packaging.</p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
         PAGE: AUTHENTICATION & MULTI-STEP REGISTRATION
         ========================================================= */}
      {currentPage === 'auth' && (
        <div className="container">
          {authMode === 'login' ? (
            /* ----------------- SIGN IN VIEW ----------------- */
            <div className="auth-page-wrapper">
              <div className="auth-split-hero">
                <div className="brand-badge">
                  <IconLogo />
                  <span>FoodRescue AI</span>
                </div>

                <div className="auth-hero-content">
                  <span className="hero-tag">Zero Hunger Initiative</span>
                  <h1>No Food Wasted.<br />Every Child Fed.</h1>
                  <p>
                    Connecting hostel messes, hotels, and restaurants with nearby children shelter homes and charities in under 30 minutes.
                  </p>

                  <div className="impact-cards-mini">
                    <div className="mini-card">
                      <span>Find a match</span>
                      <strong>Nearby NGOs</strong>
                    </div>
                    <div className="mini-card">
                      <span>Coordinate pickup</span>
                      <strong>Private handover</strong>
                    </div>
                  </div>

                  <div className="auth-quote-card">
                    Contact details stay private until an NGO accepts a donation. The receiving NGO provides packaging for pickup.
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Mutual Privacy Shield &bull; Google Maps Radar &bull; Multiple Users Supported
                </div>
              </div>

              <div className="auth-form-panel">
                <div className="auth-form-card">
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                    Account Sign In
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 18 }}>
                    Sign in to your kitchen surplus dispatch or NGO shelter portal
                  </p>

                  {/* Multi-User Quick Demo Autofill Pills */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: 6 }}>
                      QUICK MULTI-USER DEMO LOGIN:
                    </div>
                    <div className="demo-pills-row">
                      <button
                        type="button"
                        className="demo-pill"
                        onClick={() => {
                          setAuthData({ ...authData, email: 'mess@campus.edu', password: 'password123' });
                        }}
                      >
                        🏢 Hostel Mess
                      </button>
                      <button
                        type="button"
                        className="demo-pill"
                        onClick={() => {
                          setAuthData({ ...authData, email: 'orchid@luxuryhotel.com', password: 'password123' });
                        }}
                      >
                        🏨 5-Star Hotel
                      </button>
                      <button
                        type="button"
                        className="demo-pill"
                        onClick={() => {
                          setAuthData({ ...authData, email: 'balasha@childcare.org', password: 'password123' });
                        }}
                      >
                        🤝 NGO Shelter
                      </button>
                    </div>
                  </div>

                  {message && (
                    <div style={{
                      background: '#fee2e2',
                      color: '#991b1b',
                      padding: '10px 14px',
                      borderRadius: 8,
                      fontSize: '0.85rem',
                      marginBottom: 16,
                      border: '1px solid #fecaca'
                    }}>
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleAuthSubmit}>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        placeholder="name@organization.com"
                        required
                        value={authData.email}
                        onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        required
                        value={authData.password}
                        onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8, padding: '12px' }}>
                      Sign In to Account
                    </button>
                  </form>

                  <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.88rem', color: '#64748b' }}>
                    Need an account?{' '}
                    <span
                      style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => openRegister(null)}
                    >
                      Create Free Account
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ----------------- CREATE ACCOUNT: 3 OPTIONS (HOSTEL MESS, HOTEL, OR NGO) ----------------- */
            <div>
              {/* Progress Breadcrumbs */}
              <div className="auth-step-progress">
                <div
                  className={`step-indicator ${regStep === 'select_role' ? 'active' : 'done'}`}
                  onClick={() => setRegStep('select_role')}
                >
                  <span className="step-number-circle">1</span>
                  <span>Choose Account Type</span>
                </div>

                <div className={`step-divider-line ${regStep !== 'select_role' ? 'active' : ''}`}></div>

                <div className={`step-indicator ${regStep !== 'select_role' ? 'active' : ''}`}>
                  <span className="step-number-circle">2</span>
                  <span>
                    {regStep === 'mess_details'
                      ? 'Hostel Mess Details'
                      : regStep === 'hotel_details'
                      ? 'Hotel & Restaurant Details'
                      : regStep === 'ngo_details'
                      ? 'NGO & Shelter Details'
                      : 'Account Details'}
                  </span>
                </div>
              </div>

              {/* STEP 1: CHOOSE AS HOSTEL MESS, HOTEL, OR NGO */}
              {regStep === 'select_role' && (
                <div className="role-select-section" style={{ maxWidth: 1040 }}>
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a' }}>
                      Create Your FoodRescue Account
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: 4 }}>
                      Select whether you are registering as a <strong>Hostel Mess</strong>, a <strong>Hotel</strong>, or an <strong>NGO Shelter</strong>.
                    </p>
                  </div>

                  <div className="role-select-grid-3">
                    {/* OPTION 1: REGISTER AS HOSTEL MESS */}
                    <div
                      className="role-card-choice"
                      onClick={() => openRegister('mess')}
                    >
                      <div>
                        <div className="role-card-top">
                          <div className="role-avatar-circle mess">
                            <IconBuilding />
                          </div>
                          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '3px 8px', borderRadius: 4 }}>
                            University / College
                          </span>
                        </div>

                        <div className="role-card-title">Register as Hostel Mess</div>
                        <div className="role-card-desc">
                          For university hostel dining halls, student messes, and campus canteens with wholesome daily surplus meals.
                        </div>

                        <ul className="role-features-list">
                          <li className="role-feature-item">
                            <span className="role-feature-icon">✓</span>
                            <span>List mess leftover meals in 60 seconds</span>
                          </li>
                          <li className="role-feature-item">
                            <span className="role-feature-icon">✓</span>
                            <span><strong>Google Maps Pickup Gate Pinpoint</strong></span>
                          </li>
                          <li className="role-feature-item">
                            <span className="role-feature-icon">✓</span>
                            <span>Alert nearby orphanages and shelter homes</span>
                          </li>
                          <li className="role-feature-item">
                            <span className="role-feature-icon">✓</span>
                            <span>Phone locked until accepted for privacy</span>
                          </li>
                        </ul>
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: 12 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          openRegister('mess');
                        }}
                      >
                        Register as Hostel Mess &rarr;
                      </button>
                    </div>

                    {/* OPTION 2: REGISTER AS HOTEL */}
                    <div
                      className="role-card-choice"
                      onClick={() => openRegister('hotel')}
                    >
                      <div>
                        <div className="role-card-top">
                          <div className="role-avatar-circle hotel">
                            <IconHotel />
                          </div>
                          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#d97706', background: '#fef3c7', padding: '3px 8px', borderRadius: 4 }}>
                            Hotels & Banquets
                          </span>
                        </div>

                        <div className="role-card-title">Register as Hotel</div>
                        <div className="role-card-desc">
                          For 5-star hotels, luxury banquet halls, wedding venues, caterers, and fine restaurants with buffet surplus.
                        </div>

                        <ul className="role-features-list">
                          <li className="role-feature-item">
                            <span className="role-feature-icon">✓</span>
                            <span>Dispatch afternoon & late-night buffets</span>
                          </li>
                          <li className="role-feature-item">
                            <span className="role-feature-icon">✓</span>
                            <span><strong>Service Alley Dock Loading Gate</strong></span>
                          </li>
                          <li className="role-feature-item">
                            <span className="role-feature-icon">✓</span>
                            <span>Proximity route navigation for charity vans</span>
                          </li>
                          <li className="role-feature-item">
                            <span className="role-feature-icon">✓</span>
                            <span>Zero food waste CSR sustainability impact</span>
                          </li>
                        </ul>
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: 12, background: '#d97706' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          openRegister('hotel');
                        }}
                      >
                        Register as Hotel &rarr;
                      </button>
                    </div>

                    {/* OPTION 3: REGISTER AS NGO */}
                    <div
                      className="role-card-choice"
                      onClick={() => openRegister('ngo')}
                    >
                      <div>
                        <div className="role-card-top">
                          <div className="role-avatar-circle ngo">
                            <IconHeart />
                          </div>
                          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '3px 8px', borderRadius: 4 }}>
                            Shelters & Relief
                          </span>
                        </div>

                        <div className="role-card-title">Register as NGO</div>
                        <div className="role-card-desc">
                          For registered child care homes, orphanages, night shelters, women's shelters, community food banks, and hunger trusts.
                        </div>

                        <ul className="role-features-list">
                          <li className="role-feature-item">
                            <span className="role-feature-icon">✓</span>
                            <span>Surplus meal alerts across your city</span>
                          </li>
                          <li className="role-feature-item">
                            <span className="role-feature-icon">✓</span>
                            <span><strong>Appear on Google Maps Shelter Radar</strong></span>
                          </li>
                          <li className="role-feature-item">
                            <span className="role-feature-icon">✓</span>
                            <span><strong>Turn-by-turn Google Maps Route Directions</strong></span>
                          </li>
                          <li className="role-feature-item">
                            <span className="role-feature-icon">✓</span>
                            <span>Resident capacity & dietary management</span>
                          </li>
                        </ul>
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: 12, background: '#059669' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          openRegister('ngo');
                        }}
                      >
                        Register as NGO &rarr;
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                    Already have an account?{' '}
                    <span
                      style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={openSignIn}
                    >
                      Sign In here
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 2A: HOSTEL MESS DETAILS */}
              {regStep === 'mess_details' && (
                <div className="details-page-card">
                  <div className="details-header">
                    <div>
                      <span className="badge badge-fresh" style={{ textTransform: 'uppercase', marginBottom: 6, display: 'inline-block' }}>
                        Step 2: Hostel Mess Registration
                      </span>
                      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
                        Hostel Mess Details
                      </h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 2 }}>
                        Register your college hostel dining hall or campus canteen.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="back-to-step1-btn"
                      onClick={() => setRegStep('select_role')}
                    >
                      &larr; Change Account Type
                    </button>
                  </div>

                  {message && (
                    <div style={{
                      background: '#fee2e2',
                      color: '#991b1b',
                      padding: '10px 14px',
                      borderRadius: 8,
                      fontSize: '0.85rem',
                      marginBottom: 16,
                      border: '1px solid #fecaca'
                    }}>
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleAuthSubmit}>
                    <div className="form-section-title">
                      <IconBuilding /> 1. Hostel Mess Profile
                    </div>

                    <div className="form-grid-2col">
                      <div className="form-group">
                        <label>Hostel Mess / Dining Hall Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Campus Central Mess (Hostel 4) or Block B Dining"
                          value={authData.name}
                          onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Mess Steward / In-Charge Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Mahesh Patil (Mess Manager)"
                          value={authData.contactPerson}
                          onChange={(e) => setAuthData({ ...authData, contactPerson: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2col">
                      <div className="form-group">
                        <label>Contact Phone * (Protected by Privacy Shield)</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 9123456789"
                          value={authData.phone}
                          onChange={(e) => setAuthData({ ...authData, phone: e.target.value })}
                        />
                        <span style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 4, display: 'block' }}>
                          🔒 Hidden until an authorized NGO accepts your food request.
                        </span>
                      </div>

                      <div className="form-group">
                        <label>Specific Pickup Gate / Loading Dock</label>
                        <input
                          type="text"
                          placeholder="e.g. Hostel Block 4 Rear Gate, Loading Dock 2"
                          value={authData.pickupGate}
                          onChange={(e) => setAuthData({ ...authData, pickupGate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Preferred Surplus Pickup Hours</label>
                      <select
                        value={authData.preferredTimings}
                        onChange={(e) => setAuthData({ ...authData, preferredTimings: e.target.value })}
                      >
                        <option value="Lunch (2:30 PM - 4:00 PM) & Dinner (9:30 PM - 11:30 PM)">
                          Lunch (2:30 PM - 4:00 PM) & Dinner (9:30 PM - 11:30 PM)
                        </option>
                        <option value="Post-Lunch Only (2:00 PM - 4:30 PM)">
                          Post-Lunch Only (2:00 PM - 4:30 PM)
                        </option>
                        <option value="Post-Dinner Late Night (10:00 PM - 12:00 AM)">
                          Post-Dinner Late Night (10:00 PM - 12:00 AM)
                        </option>
                        <option value="Flexible / Immediate Dispatch On Call">
                          Flexible / Immediate Dispatch On Call
                        </option>
                      </select>
                    </div>

                    <div className="form-section-title">
                      <IconMapPin /> 2. Location & Google Maps
                    </div>

                    <div className="form-grid-2col">
                      <div className="form-group">
                        <label>Operating City *</label>
                        <select
                          value={authData.city}
                          onChange={(e) => setAuthData({ ...authData, city: e.target.value })}
                        >
                          <option value="Mumbai">Mumbai</option>
                          <option value="Delhi">Delhi / NCR</option>
                          <option value="Bangalore">Bangalore</option>
                          <option value="Pune">Pune</option>
                          <option value="Hyderabad">Hyderabad</option>
                          <option value="Chennai">Chennai</option>
                          <option value="Kolkata">Kolkata</option>
                          <option value="Sri Ganganagar">Sri Ganganagar</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Campus / Building Landmark</label>
                        <input
                          type="text"
                          placeholder="e.g. Near University Main Quadrangle"
                          value={authData.landmark}
                          onChange={(e) => setAuthData({ ...authData, landmark: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Hostel / Campus Street Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. University Tech Campus, Hostel Zone, Powai"
                        value={authData.address}
                        onChange={(e) => setAuthData({ ...authData, address: e.target.value })}
                      />
                    </div>

                    {/* Google Maps Live Location Preview */}
                    <div className="location-map-preview">
                      <div className="map-preview-header">
                        <span className="map-preview-tag">
                          <IconMapPin /> Google Maps Location Preview
                        </span>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          onClick={() => openExternalGoogleMap(`${authData.address || authData.name}, ${authData.city}`)}
                        >
                          Open in Google Maps &rarr;
                        </button>
                      </div>
                      <div className="map-preview-frame">
                        <iframe
                          title="Hostel Mess Location Preview"
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          scrolling="no"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent((authData.address || authData.name) + ', ' + authData.city)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                        ></iframe>
                      </div>
                    </div>

                    <div className="form-section-title">
                      <IconShield /> 3. Login Credentials
                    </div>

                    <div className="form-group">
                      <label>Official Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="mess@campus.edu"
                        value={authData.email}
                        onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                      />
                    </div>

                    <div className="form-grid-2col">
                      <div className="form-group">
                        <label>Create Password *</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={authData.password}
                          onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Confirm Password *</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={authData.confirmPassword}
                          onChange={(e) => setAuthData({ ...authData, confirmPassword: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="registration-actions" style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '12px 20px' }}
                        onClick={() => setRegStep('select_role')}
                      >
                        &larr; Back
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ flex: 1, padding: '12px 24px', fontSize: '1rem' }}
                      >
                        Complete Hostel Mess Registration & Start Posting &rarr;
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 2B: HOTEL DETAILS */}
              {regStep === 'hotel_details' && (
                <div className="details-page-card">
                  <div className="details-header">
                    <div>
                      <span className="badge" style={{ background: '#fef3c7', color: '#92400e', textTransform: 'uppercase', marginBottom: 6, display: 'inline-block' }}>
                        Step 2: Hotel & Banquet Registration
                      </span>
                      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
                        Hotel & Banquet Details
                      </h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 2 }}>
                        Register your hotel, banquet hall, or restaurant dining facility.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="back-to-step1-btn"
                      onClick={() => setRegStep('select_role')}
                    >
                      &larr; Change Account Type
                    </button>
                  </div>

                  {message && (
                    <div style={{
                      background: '#fee2e2',
                      color: '#991b1b',
                      padding: '10px 14px',
                      borderRadius: 8,
                      fontSize: '0.85rem',
                      marginBottom: 16,
                      border: '1px solid #fecaca'
                    }}>
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleAuthSubmit}>
                    <div className="form-section-title">
                      <IconHotel /> 1. Hotel & Property Profile
                    </div>

                    <div className="form-grid-2col">
                      <div className="form-group">
                        <label>Hotel / Property / Restaurant Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. The Grand Orchid Luxury Hotel & Banquets"
                          value={authData.name}
                          onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Executive Chef / F&B Director Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Chef Anand Singhal"
                          value={authData.contactPerson}
                          onChange={(e) => setAuthData({ ...authData, contactPerson: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2col">
                      <div className="form-group">
                        <label>Contact Phone * (Protected by Privacy Shield)</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 9820998877"
                          value={authData.phone}
                          onChange={(e) => setAuthData({ ...authData, phone: e.target.value })}
                        />
                        <span style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 4, display: 'block' }}>
                          🔒 Only revealed to authorized NGO upon request acceptance.
                        </span>
                      </div>

                      <div className="form-group">
                        <label>Service Loading Bay / Dock Gate</label>
                        <input
                          type="text"
                          placeholder="e.g. Back Loading Bay Gate C, Service Alley"
                          value={authData.pickupGate}
                          onChange={(e) => setAuthData({ ...authData, pickupGate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Preferred Buffet Surplus Dispatch Hours</label>
                      <select
                        value={authData.preferredTimings}
                        onChange={(e) => setAuthData({ ...authData, preferredTimings: e.target.value })}
                      >
                        <option value="Afternoon Buffet (3:30 PM - 5:00 PM) & Night Buffet (11:30 PM - 1:00 AM)">
                          Afternoon Buffet (3:30 PM - 5:00 PM) & Night Buffet (11:30 PM - 1:00 AM)
                        </option>
                        <option value="Post-Lunch Buffet Only (3:00 PM - 5:00 PM)">
                          Post-Lunch Buffet Only (3:00 PM - 5:00 PM)
                        </option>
                        <option value="Post-Banquet Late Night (11:00 PM - 1:30 AM)">
                          Post-Banquet Late Night (11:00 PM - 1:30 AM)
                        </option>
                        <option value="Flexible / Immediate Dispatch On Call">
                          Flexible / Immediate Dispatch On Call
                        </option>
                      </select>
                    </div>

                    <div className="form-section-title">
                      <IconMapPin /> 2. Location & Google Maps
                    </div>

                    <div className="form-grid-2col">
                      <div className="form-group">
                        <label>Operating City *</label>
                        <select
                          value={authData.city}
                          onChange={(e) => setAuthData({ ...authData, city: e.target.value })}
                        >
                          <option value="Mumbai">Mumbai</option>
                          <option value="Delhi">Delhi / NCR</option>
                          <option value="Bangalore">Bangalore</option>
                          <option value="Pune">Pune</option>
                          <option value="Hyderabad">Hyderabad</option>
                          <option value="Chennai">Chennai</option>
                          <option value="Kolkata">Kolkata</option>
                          <option value="Sri Ganganagar">Sri Ganganagar</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Prominent Landmark</label>
                        <input
                          type="text"
                          placeholder="e.g. Near Domestic Airport Road"
                          value={authData.landmark}
                          onChange={(e) => setAuthData({ ...authData, landmark: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Hotel / Property Street Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Orchid Boulevard, Vile Parle East"
                        value={authData.address}
                        onChange={(e) => setAuthData({ ...authData, address: e.target.value })}
                      />
                    </div>

                    {/* Google Maps Live Location Preview */}
                    <div className="location-map-preview">
                      <div className="map-preview-header">
                        <span className="map-preview-tag" style={{ background: '#fef3c7', color: '#92400e' }}>
                          <IconMapPin /> Google Maps Location Preview
                        </span>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          onClick={() => openExternalGoogleMap(`${authData.address || authData.name}, ${authData.city}`)}
                        >
                          Open in Google Maps &rarr;
                        </button>
                      </div>
                      <div className="map-preview-frame">
                        <iframe
                          title="Hotel Location Preview"
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          scrolling="no"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent((authData.address || authData.name) + ', ' + authData.city)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                        ></iframe>
                      </div>
                    </div>

                    <div className="form-section-title">
                      <IconShield /> 3. Login Credentials
                    </div>

                    <div className="form-group">
                      <label>Official Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="chef@luxuryhotel.com"
                        value={authData.email}
                        onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                      />
                    </div>

                    <div className="form-grid-2col">
                      <div className="form-group">
                        <label>Create Password *</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={authData.password}
                          onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Confirm Password *</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={authData.confirmPassword}
                          onChange={(e) => setAuthData({ ...authData, confirmPassword: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="registration-actions" style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '12px 20px' }}
                        onClick={() => setRegStep('select_role')}
                      >
                        &larr; Back
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ flex: 1, padding: '12px 24px', fontSize: '1rem', background: '#d97706' }}
                      >
                        Complete Hotel Registration & Post Surplus &rarr;
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 2C: NGO DETAILS */}
              {regStep === 'ngo_details' && (
                <div className="details-page-card">
                  <div className="details-header">
                    <div>
                      <span className="badge badge-ngo" style={{ textTransform: 'uppercase', marginBottom: 6, display: 'inline-block' }}>
                        Step 2: NGO & Shelter Details
                      </span>
                      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
                        NGO & Shelter Home Details
                      </h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 2 }}>
                        Register your charity, orphanage, or shelter to appear on Google Maps and receive surplus meals.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="back-to-step1-btn"
                      onClick={() => setRegStep('select_role')}
                    >
                      &larr; Change Account Type
                    </button>
                  </div>

                  {message && (
                    <div style={{
                      background: '#fee2e2',
                      color: '#991b1b',
                      padding: '10px 14px',
                      borderRadius: 8,
                      fontSize: '0.85rem',
                      marginBottom: 16,
                      border: '1px solid #fecaca'
                    }}>
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleAuthSubmit}>
                    <div className="form-section-title">
                      <IconHeart /> 1. Charity Credentials & Shelter Profile
                    </div>

                    <div className="form-grid-2col">
                      <div className="form-group">
                        <label>NGO / Shelter Home Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Bal Asha Child Care Home or Snehalaya Shelter"
                          value={authData.name}
                          onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Shelter Home Type</label>
                        <select
                          value={authData.shelterType}
                          onChange={(e) => setAuthData({ ...authData, shelterType: e.target.value })}
                        >
                          <option value="Child Care Home & Orphanage">Child Care Home & Orphanage</option>
                          <option value="Emergency Night Shelter & Food Bank">Emergency Night Shelter & Food Bank</option>
                          <option value="Women & Children Shelter Home">Women & Children Shelter Home</option>
                          <option value="Community Hunger Relief Foundation">Community Hunger Relief Foundation</option>
                          <option value="Elderly Care Home & Shelter">Elderly Care Home & Shelter</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-grid-2col">
                      <div className="form-group">
                        <label>Shelter Inmates / Children Count</label>
                        <input
                          type="text"
                          placeholder="e.g. 65 children residing in shelter"
                          value={authData.residentCount}
                          onChange={(e) => setAuthData({ ...authData, residentCount: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Trust / 80G / Darpan Reg. Number</label>
                        <input
                          type="text"
                          placeholder="e.g. NGO-MH-2021-0042"
                          value={authData.regNumber}
                          onChange={(e) => setAuthData({ ...authData, regNumber: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2col">
                      <div className="form-group">
                        <label>Coordinator / Contact Person *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sister Mary or Dr. Girish Kulkarni"
                          value={authData.contactPerson}
                          onChange={(e) => setAuthData({ ...authData, contactPerson: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Daily Feeding Capacity (Servings per Day) *</label>
                        <input
                          type="number"
                          min="10"
                          required
                          placeholder="e.g. 150"
                          value={authData.ngoCapacity}
                          onChange={(e) => setAuthData({ ...authData, ngoCapacity: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2col">
                      <div className="form-group">
                        <label>Distribution Logistics / Fleet</label>
                        <select
                          value={authData.logisticsType}
                          onChange={(e) => setAuthData({ ...authData, logisticsType: e.target.value })}
                        >
                          <option value="Own Distribution Van & Volunteers">Own Distribution Van & Volunteers</option>
                          <option value="Food Rescue Bike Fleet">Food Rescue Bike Fleet</option>
                          <option value="Dedicated Refrigerated Van">Dedicated Refrigerated Van</option>
                          <option value="Volunteers on Foot / Public Transit">Volunteers on Foot / Public Transit</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Contact Phone Number * (Privacy Protected)</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 9876543210"
                          value={authData.phone}
                          onChange={(e) => setAuthData({ ...authData, phone: e.target.value })}
                        />
                        <span style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 4, display: 'block' }}>
                          🔒 Only revealed to donor when you accept their donation.
                        </span>
                      </div>
                    </div>

                    <div className="form-section-title">
                      <IconMapPin /> 2. Location & Google Maps Pinpoint
                    </div>

                    <div className="form-grid-2col">
                      <div className="form-group">
                        <label>Operating City *</label>
                        <select
                          value={authData.city}
                          onChange={(e) => setAuthData({ ...authData, city: e.target.value })}
                        >
                          <option value="Mumbai">Mumbai</option>
                          <option value="Delhi">Delhi / NCR</option>
                          <option value="Bangalore">Bangalore</option>
                          <option value="Pune">Pune</option>
                          <option value="Hyderabad">Hyderabad</option>
                          <option value="Chennai">Chennai</option>
                          <option value="Kolkata">Kolkata</option>
                          <option value="Sri Ganganagar">Sri Ganganagar</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Prominent Landmark</label>
                        <input
                          type="text"
                          placeholder="e.g. Near King George V Memorial"
                          value={authData.landmark}
                          onChange={(e) => setAuthData({ ...authData, landmark: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Distribution Center Street Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anand Niketan, Dr. E Moses Rd, Mahalaxmi"
                        value={authData.address}
                        onChange={(e) => setAuthData({ ...authData, address: e.target.value })}
                      />
                    </div>

                    {/* Google Maps Live Location Preview */}
                    <div className="location-map-preview">
                      <div className="map-preview-header">
                        <span className="map-preview-tag">
                          <IconMapPin /> Google Maps Location Preview
                        </span>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          onClick={() => openExternalGoogleMap(`${authData.address || authData.name}, ${authData.city}`)}
                        >
                          Open in Google Maps &rarr;
                        </button>
                      </div>
                      <div className="map-preview-frame">
                        <iframe
                          title="NGO Location Preview"
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          scrolling="no"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent((authData.address || authData.name) + ', ' + authData.city)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                        ></iframe>
                      </div>
                    </div>

                    <div className="form-section-title">
                      <IconShield /> 3. Account Security Credentials
                    </div>

                    <div className="form-group">
                      <label>Official Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="coordinator@shelterhope.org"
                        value={authData.email}
                        onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                      />
                    </div>

                    <div className="form-grid-2col">
                      <div className="form-group">
                        <label>Create Password *</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={authData.password}
                          onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Confirm Password *</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={authData.confirmPassword}
                          onChange={(e) => setAuthData({ ...authData, confirmPassword: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="registration-actions" style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '12px 20px' }}
                        onClick={() => setRegStep('select_role')}
                      >
                        &larr; Back
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ flex: 1, padding: '12px 24px', fontSize: '1rem', background: '#059669' }}
                      >
                        Complete NGO Registration & Launch Dashboard &rarr;
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================
         PAGE: DASHBOARD (AUTHENTICATED PORTAL)
         ========================================================= */}
      {currentPage === 'dashboard' && user && (
        <div className="container">
          <div className="stats-banner">
            <div className="stat-card">
              <div className="stat-icon green"><IconCheck /></div>
              <div>
                <span>Requests in your list</span>
                <strong>{dashboardRequests.length}</strong>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon amber"><IconClock /></div>
              <div>
                <span>Accepted pickups</span>
                <strong>{acceptedRequestCount}</strong>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple"><IconMapPin /></div>
              <div>
                <span>Active City</span>
                <strong>{user.city}</strong>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue"><IconLock /></div>
              <div>
                <span>Contact sharing</span>
                <strong>After acceptance</strong>
              </div>
            </div>
          </div>

          {message && (
            <div className="card" style={{ marginBottom: 20, background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' }}>
              {message}
            </div>
          )}

          {/* ------------------- DONOR VIEW (HOSTEL MESS / HOTEL) ------------------- */}
          {user.role === 'donor' && (
            <div>
              <div className="hero-banner donor-hero">
                <div>
                  <span className="hero-tag">
                    {user.donorType || 'Hostel Mess'} &bull; Surplus Dispatch
                  </span>
                  <h2>Turn Kitchen Surplus Into Children's Nutrition</h2>
                  <p>
                    Post surplus food from <strong>{user.name}</strong>. Our AI proximity engine matches verified NGO shelter homes in <strong>{user.city}</strong> for rapid pickup with Google Maps directions.
                  </p>
                </div>

                <div className="hero-stats-row">
                  <div className="hero-stat-item">
                    <span>Target:</span>
                    <strong>Zero Landfill Waste</strong>
                  </div>
                  <div className="hero-stat-item">
                    <span>Privacy:</span>
                    <strong>Phone Locked Until Accepted</strong>
                  </div>
                  <div className="hero-stat-item">
                    <span>Navigation:</span>
                    <strong>Google Maps Enabled</strong>
                  </div>
                </div>
              </div>

              <div className="grid">
                {/* Post Surplus Food Form */}
                <div className="card card-interactive">
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 4 }}>Post Surplus Food</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
                    List leftover food from hostel mess, hotel buffet, or restaurant
                  </p>

                  {hasActiveDonation && (
                    <div style={{ marginBottom: 16, padding: '11px 13px', borderRadius: 8, background: '#fff7ed', color: '#9a3412', fontSize: '0.88rem' }}>
                      You already have an active request. You can post another after this one is marked complete.
                    </div>
                  )}

                  <form onSubmit={handleCreateDonation}>
                    <div className="form-group">
                      <label>Dietary Type</label>
                      <select
                        value={donationForm.foodType}
                        onChange={(e) => setDonationForm({ ...donationForm, foodType: e.target.value })}
                      >
                        <option value="Veg">Vegetarian</option>
                        <option value="Non-Veg">Non-Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Mixed">Mixed</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Quantity (Number of Servings)</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={donationForm.quantity}
                        onChange={(e) => setDonationForm({ ...donationForm, quantity: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Food Age / Freshness Window</label>
                      <select
                        value={donationForm.foodAge}
                        onChange={(e) => setDonationForm({ ...donationForm, foodAge: e.target.value })}
                      >
                        <option value="Freshly prepared (within 1 hr)">Freshly prepared (within 1 hr)</option>
                        <option value="1-2 hours ago">1-2 hours ago</option>
                        <option value="3-4 hours ago (Urgent)">3-4 hours ago (Urgent Pickup Required)</option>
                        <option value="More than 4 hours">More than 4 hours</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Food Photo (Preset or URL)</label>
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={donationForm.imageUrl}
                        onChange={(e) => setDonationForm({ ...donationForm, imageUrl: e.target.value })}
                      />

                      <div className="photo-preset-chips">
                        <span
                          className="preset-chip"
                          onClick={() => setPresetPhoto(
                            'https://images.unsplash.com/photo-1618245472861-b2b4e88431ed?auto=format&fit=crop&w=600&q=80',
                            'Fresh steamed rice with spiced yellow dal. Good for 50-60 servings.'
                          )}
                        >
                          Rice & Dal
                        </span>
                        <span
                          className="preset-chip"
                          onClick={() => setPresetPhoto(
                            'https://images.unsplash.com/photo-1541802645635-11f2286a7482?auto=format&fit=crop&w=600&q=80',
                            'Hot wheat rotis packed with seasonal vegetable curry.'
                          )}
                        >
                          Rotis & Sabzi
                        </span>
                        <span
                          className="preset-chip"
                          onClick={() => setPresetPhoto(
                            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
                            'Nutritious meal with rice, lentils, vegetables and salad.'
                          )}
                        >
                          Buffet Full Meal
                        </span>
                      </div>

                      {donationForm.imageUrl && (
                        <div style={{ marginTop: 12 }}>
                          <img
                            src={donationForm.imageUrl}
                            alt="Selected food preview"
                            style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border-color)' }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Additional Notes (Dishes and pickup gate)</label>
                      <textarea
                        rows="2"
                        placeholder="e.g. Rice, dal and rotis. Pickup at Gate 4 loading dock."
                        value={donationForm.notes}
                        onChange={(e) => setDonationForm({ ...donationForm, notes: e.target.value })}
                      />
                      <small style={{ display: 'block', marginTop: 6, color: '#065f46', fontWeight: 700 }}>
                        Food packaging and transport containers are provided by the receiving NGO.
                      </small>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <button
                        type="button"
                        className="btn btn-ai"
                        style={{ width: '100%', padding: '12px' }}
                        onClick={handleRunAiMatch}
                        disabled={loadingAi}
                      >
                        {loadingAi ? 'AI Analyzing Capacity & Proximity...' : 'Run AI NGO Shelter Match Engine'}
                      </button>
                    </div>

                    {aiSuggestions.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4c1d95', margin: 0 }}>
                            AI Recommended NGO Shelters in {user.city}:
                          </label>
                          {selectedNgo && (
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                              onClick={() => setSelectedNgo(null)}
                            >
                              Clear Selection (Open to All)
                            </button>
                          )}
                        </div>
                        {aiSuggestions.map((ngo) => (
                          <div
                            key={ngo.ngoId}
                            className="ai-card"
                            style={{
                              border: selectedNgo?.ngoId === ngo.ngoId ? '2px solid #7c3aed' : '1px solid #e9d5ff',
                              cursor: 'pointer',
                            }}
                            onClick={() => setSelectedNgo(selectedNgo?.ngoId === ngo.ngoId ? null : ngo)}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <strong>{ngo.ngoName}</strong>
                              <span className="ai-match-score">{ngo.matchPercentage}% Match</span>
                            </div>
                            <p style={{ fontSize: '0.82rem', color: '#6b21a8', marginTop: 4, lineHeight: 1.4 }}>
                              {ngo.aiReasoning}
                            </p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}>
                              Capacity: {ngo.capacity} servings/day &bull; {selectedNgo?.ngoId === ngo.ngoId ? '✓ [Selected for Direct Dispatch - Click to Unselect]' : 'Click to select this NGO exclusively'}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '12px' }}
                      disabled={submittingDonation || hasActiveDonation}
                    >
                      {submittingDonation ? 'Submitting Request…' : hasActiveDonation ? 'Active Request Already Posted' : 'Submit Food Donation Request'}
                    </button>
                  </form>
                </div>

                {/* My Posted Donations Feed */}
                <div className="card card-interactive">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>My Donation Requests</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        Track NGO acceptance and coordinate food pickup
                      </p>
                    </div>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setCurrentPage('map')}
                      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <IconMapPin /> Find Nearby Shelters
                    </button>
                  </div>

                  {myDonations.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                      <p style={{ fontWeight: 600 }}>No donation requests posted yet.</p>
                      <p style={{ fontSize: '0.85rem', marginTop: 4 }}>Fill out the form on the left to start saving meals.</p>
                    </div>
                  ) : (
                    myDonations.map((item) => (
                      <div key={item._id} className="card" style={{ marginBottom: 16, border: '1px solid var(--border-color)', padding: 18 }}>
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt="Food"
                            style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }}
                          />
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{item.quantity} {item.quantityUnit} ({item.foodType})</h4>
                          <span className={`badge badge-${item.status}`}>{item.status.toUpperCase()}</span>
                        </div>

                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
                          Freshness: <strong>{item.foodAge}</strong> &bull; Category: {item.foodCategory}
                        </p>
                        {item.notes && (
                          <p style={{ fontSize: '0.85rem', marginTop: 6, fontStyle: 'italic', background: '#f8fafc', padding: 8, borderRadius: 6 }}>
                            "{item.notes}"
                          </p>
                        )}

                        {item.status === 'pending' && (
                          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{ display: 'flex', gap: 8 }}>
                              {import.meta.env.DEV && (
                                <button
                                  className="btn btn-primary btn-sm"
                                  style={{ flex: 1, background: '#059669', borderColor: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                                  onClick={() => handleSimulateAccept(item._id)}
                                  disabled={processingRequestId === item._id}
                                  title="Accept request using partner NGO shelter (Instant test)"
                                >
                                  <IconCheck /> Test Accept as NGO
                                </button>
                              )}
                              <button
                                className="btn btn-secondary btn-sm"
                                style={{ flex: 1 }}
                                onClick={() => handleWithdraw(item._id)}
                                disabled={processingRequestId === item._id}
                              >
                                Withdraw
                              </button>
                            </div>
                            <button
                              className="btn btn-danger btn-sm"
                              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                              onClick={() => handleDelete(item._id)}
                              disabled={processingRequestId === item._id}
                            >
                              Delete Request
                            </button>
                          </div>
                        )}
                        {item.status === 'accepted' ? (
                          <div className="privacy-box privacy-unlocked" style={{ marginTop: 12 }}>
                            <strong style={{ color: '#065f46', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <IconCheck /> Request Accepted by NGO Shelter
                            </strong>
                            <p style={{ marginTop: 6 }}>NGO Name: <strong>{item.assignedNgo?.name}</strong></p>
                            <p>Phone Number: <strong>{item.assignedNgo?.phone || 'Not provided'}</strong></p>
                            <p>Address: {item.assignedNgo?.address}, {item.assignedNgo?.city}</p>
                            {item.acceptanceTravelMinutes != null && (
                              <p>Estimated drive: <strong>{item.acceptanceTravelMinutes} minutes</strong></p>
                            )}
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                              onClick={() => openExternalGoogleMap(`${item.assignedNgo?.name || 'NGO'}, ${item.assignedNgo?.city || user.city}`)}
                            >
                              <IconNavigation /> Navigate to Shelter in Google Maps
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ marginTop: 8, width: '100%' }}
                              onClick={() => handleComplete(item._id)}
                              disabled={processingRequestId === item._id}
                            >
                              {processingRequestId === item._id ? 'Updating…' : 'Mark Pickup Complete'}
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              style={{ marginTop: 8, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                              onClick={() => handleDelete(item._id)}
                              disabled={processingRequestId === item._id}
                            >
                              Delete Request
                            </button>
                          </div>
                        ) : item.status !== 'pending' ? (
                          <div style={{ marginTop: 12 }}>
                            <button
                              className="btn btn-danger btn-sm"
                              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                              onClick={() => handleDelete(item._id)}
                              disabled={processingRequestId === item._id}
                            >
                              Delete Request
                            </button>
                          </div>
                        ) : (
                          <div className="privacy-box" style={{ marginTop: 8 }}>
                            {item.declinedBy?.length > 0 && (
                              <p style={{ marginBottom: 8, color: '#92400e', fontWeight: 600 }}>
                                Declined by {item.declinedBy.map((ngo) => ngo.name).filter(Boolean).join(', ')}. Your request is still open for other NGOs.
                              </p>
                            )}
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
                              <IconLock /> Mutual Privacy Shield Active
                            </span>
                            <div style={{ marginTop: 4 }}>
                              Contact phone numbers and addresses unlock automatically when an authorized NGO accepts.{import.meta.env.DEV ? ' You can also click "Test Accept as NGO" above to test the full handoff workflow.' : ''}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ------------------- NGO VIEW ------------------- */}
          {user.role === 'ngo' && (
            <div>
              <div className="hero-banner ngo-hero">
                <div>
                  <span className="hero-tag">
                    {user.shelterType || 'NGO Shelter'} &bull; Food Dispatch
                  </span>
                  <h2>Feeding Children & Underprivileged Communities</h2>
                  <p>
                    Surplus meals from hostel messes, 5-star hotels, and restaurants across <strong>{user.city}</strong>. Accept requests to claim hot meals and get direct Google Maps navigation to the donor kitchen.
                  </p>
                </div>

                <div className="hero-stats-row">
                  <div className="hero-stat-item">
                    <span>Registered Capacity:</span>
                    <strong>{user.ngoCapacity || 120} meals/day</strong>
                  </div>
                  {user.residentCount && (
                    <div className="hero-stat-item">
                      <span>Shelter Residents:</span>
                      <strong>{user.residentCount}</strong>
                    </div>
                  )}
                  <div className="hero-stat-item">
                    <span>Navigation:</span>
                    <strong>Google Maps Enabled</strong>
                  </div>
                </div>
              </div>

              <div style={{ margin: '0 0 16px', padding: '12px 16px', borderRadius: 10, background: '#ecfdf5', color: '#065f46', fontWeight: 700 }}>
                The receiving NGO is responsible for bringing food-safe packaging and transport containers for every accepted pickup.
              </div>

              <section className="card" style={{ marginBottom: 22, padding: 16 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 10 }}>Your NGO location</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 12 }}>
                  {user.address}, {user.city}
                </p>
                <iframe
                  title="Map showing your NGO location"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(`${user.address || user.name}, ${user.city}, India`)}&z=13&output=embed`}
                  width="100%"
                  height="260"
                  style={{ border: 0, borderRadius: 10, display: 'block' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </section>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Available Food Donation Requests</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Review surplus alerts from hostel messes and hotels. Click Accept to reveal donor phone & pickup gate.
                  </p>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setCurrentPage('map')}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <IconMapPin /> View All on Google Maps
                </button>
              </div>

              <div className="grid">
                {ngoFeed.length === 0 ? (
                  <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 24px' }}>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: 4 }}>No Requests Pending</h4>
                    <p style={{ color: 'var(--text-muted)' }}>
                      There are currently no open food donation requests in your city. New surplus posts will appear here in real-time.
                    </p>
                  </div>
                ) : (
                  ngoFeed.map((item) => (
                    <div key={item._id} className="card card-interactive">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt="Food photo"
                          style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8, marginBottom: 14 }}
                        />
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item.quantity} {item.quantityUnit} ({item.foodType})</h4>
                        <span className={`badge ${item.foodAge.includes('3') || item.foodAge.includes('Urgent') ? 'badge-urgent' : 'badge-fresh'}`}>
                          {item.foodAge}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: 8 }}>
                        Donor: <strong>{item.donor?.name}</strong> ({item.donor?.donorType || 'Hostel Mess'})
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Location: {item.donor?.address}
                      </p>

                      {item.notes && (
                        <p style={{ fontSize: '0.85rem', background: '#f8fafc', padding: 10, borderRadius: 6, marginTop: 10, border: '1px solid var(--border-color)' }}>
                          <strong>Notes:</strong> {item.notes}
                        </p>
                      )}

                      {item.declinedBy?.some((ngo) => (ngo._id || ngo) === user._id) ? (
                        <button className="btn btn-primary" style={{ marginTop: 14, width: '100%' }} onClick={() => handleRetake(item._id)}>
                          Retake Request
                        </button>
                      ) : item.status === 'accepted' ? (
                        <div className="privacy-box privacy-unlocked" style={{ marginTop: 14 }}>
                          <strong style={{ color: '#065f46', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <IconCheck /> You Accepted This Request
                          </strong>
                          <p style={{ marginTop: 6 }}>Donor Phone: <strong>{item.donor?.phone || '9123456789'}</strong></p>
                          <p>Full Pickup Address: <strong>{item.donor?.address}</strong></p>
                          {item.acceptanceTravelMinutes != null && (
                            <p>Estimated drive: <strong>{item.acceptanceTravelMinutes} minutes</strong></p>
                          )}
                          <button
                            className="btn btn-primary"
                            style={{ marginTop: 10, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                            onClick={() => openExternalGoogleMap(`${item.donor?.name || 'Mess'}, ${item.donor?.address}, ${item.donor?.city}`)}
                          >
                            <IconNavigation /> Start Google Maps Navigation to Mess
                          </button>
                          <button
                            className="btn btn-secondary"
                            style={{ marginTop: 8, width: '100%' }}
                            onClick={() => handleComplete(item._id)}
                            disabled={processingRequestId === item._id}
                          >
                            {processingRequestId === item._id ? 'Updating…' : 'Mark Pickup Complete'}
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="privacy-box" style={{ marginTop: 14 }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                              <IconLock /> Donor contact details locked. Click Accept to reveal phone number & exact pickup gate.
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                            <button
                              className="btn btn-primary"
                              style={{ flex: 1, padding: '11px' }}
                              onClick={() => handleAccept(item._id)}
                              disabled={processingRequestId === item._id}
                            >
                              {processingRequestId === item._id ? 'Checking route…' : 'Accept Request (< 2 hours)'}
                            </button>
                            <button
                              className="btn btn-secondary"
                              style={{ flex: 1, padding: '11px' }}
                              onClick={() => handleDecline(item._id)}
                              disabled={processingRequestId === item._id}
                            >
                              Decline
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
         PAGE: CONTACT & PLATFORM HELP
         ========================================================= */}
      {currentPage === 'contact' && (
        <div className="container">
          <div className="hero-banner contact-hero">
            <div>
              <span className="hero-tag">Help &amp; onboarding</span>
              <h2>How can we help?</h2>
              <p>
                Find local NGO listings, create an organization account, or send a question about using the platform.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => setCurrentPage('map')}>
                <IconMapPin /> Find nearby NGOs
              </button>
              <button className="btn btn-secondary" onClick={() => openRegister('ngo')}>
                Register as NGO
              </button>
            </div>
          </div>

          <div className="contact-grid">
            <div className="contact-support-card">
              <span className="contact-support-eyebrow">Platform guide</span>
              <h3>Get started with FoodRescue</h3>
              <div className="contact-guide-item">
                <IconBuilding />
                <div><strong>For food donors</strong><p>Create a donor account to post surplus and review NGO matches.</p></div>
              </div>
              <div className="contact-guide-item">
                <IconHeart />
                <div><strong>For NGOs</strong><p>Register your organization to receive and accept nearby food requests.</p></div>
              </div>
              <div className="contact-guide-item">
                <IconLock />
                <div><strong>Private coordination</strong><p>Contact details are shared after an NGO accepts a request.</p></div>
              </div>
            </div>

            <div className="contact-form-card">
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 6 }}>Send a message</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 20 }}>
                Tell us what you need help with. Include an email address so you can be contacted when this form is connected to support.
              </p>
              <p className="contact-form-demo-note">This demo form currently displays a local confirmation and does not send messages.</p>

              {contactSubmitted ? (
                <div style={{
                  background: '#ecfdf5',
                  border: '1px solid #10b981',
                  borderRadius: 10,
                  padding: 24,
                  textAlign: 'center',
                  color: '#065f46'
                }}>
                  <div style={{ marginBottom: 8 }}><IconCheck /></div>
                  <h4 style={{ fontSize: '1.15rem', marginBottom: 4 }}>Message preview complete</h4>
                  <p style={{ fontSize: '0.88rem' }}>
                    This message was not delivered. Use the platform map or account registration to continue.
                  </p>
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: 16 }}
                    onClick={() => setContactSubmitted(false)}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit}>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    />
                  </div>

                  <div className="contact-inline-fields">
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="you@organization.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      />
                    </div>

                  </div>

                  <div className="form-group">
                    <label>Organization Type</label>
                    <select
                      value={contactForm.orgType}
                      onChange={(e) => setContactForm({ ...contactForm, orgType: e.target.value })}
                    >
                      <option value="Hostel Mess">Hostel Mess</option>
                      <option value="Hotel / Restaurant">Hotel / Restaurant</option>
                      <option value="Catering / Banquet">Catering / Banquet</option>
                      <option value="NGO / Charity">NGO Shelter Home / Charity</option>
                      <option value="Volunteer">Individual Volunteer</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Message *</label>
                    <textarea
                      rows="4"
                      required
                      placeholder="What would you like help with?"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                    Preview Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
         AT LAST: MENTION "OUR IMPACT" AT THE END OF THE PAGE
         (As explicitly requested: "donot add our impact on nav bar just at last mention about it")
         ========================================================= */}
      <div className="container">
        <section className="bottom-impact-section" aria-label="Food recovery platform principles">
          <div className="bottom-impact-header">
          <span className="hero-tag" style={{ background: '#ecfdf5', color: '#065f46', borderColor: '#a7f3d0' }}>
              Local food recovery
            </span>
            <h3 style={{ marginTop: 12 }}>Our impact starts with a safe handover</h3>
            <p>
              FoodRescue helps kitchens and community organizations coordinate surplus food pickups with clear expectations and privacy.
            </p>
          </div>

          <div className="bottom-impact-grid">
            <div className="step-card">
              <span className="step-number">01 · DISCOVER</span>
              <h4>Find nearby partners</h4>
              <p>Browse organizations registered with the platform or search public Google Maps listings around a chosen location.</p>
            </div>

            <div className="step-card">
              <span className="step-number">02 · COORDINATE</span>
              <h4>Share details at acceptance</h4>
              <p>Keep contact information private while a request is pending, then coordinate directly once an NGO accepts.</p>
            </div>

            <div className="step-card">
              <span className="step-number">03 · HAND OVER</span>
              <h4>NGO brings packaging</h4>
              <p>The receiving NGO provides food-safe packaging and transport containers for accepted pickups.</p>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="bottom-footer">
            <div>
              <strong>FoodRescue AI</strong> &bull; Local food recovery coordination
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
