const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Register a new user (Donor or NGO)
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role, // 'donor' or 'ngo'
      phone,
      address,
      city,
      donorType, // for donors: 'Hostel Mess', 'Hotel', 'Restaurant', etc.
      contactPerson,
      landmark,
      pickupGate,
      preferredTimings,
      fssaiOrGovId,
      ngoCapacity, // for NGOs: daily serving capacity (e.g., 100)
      regNumber,
      shelterType,
      residentCount,
      logisticsType,
      acceptedFoodTypes, // for NGOs: ['Veg', 'Non-Veg', etc.]
      lat,
      lng,
    } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user object based on role
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
      city,
      contactPerson: contactPerson || '',
      landmark: landmark || '',
      fssaiOrGovId: fssaiOrGovId || '',
      lat: lat ? Number(lat) : 19.0760,
      lng: lng ? Number(lng) : 72.8777,
    };

    if (role === 'donor') {
      userData.donorType = donorType || 'Hostel Mess';
      userData.pickupGate = pickupGate || '';
      userData.preferredTimings = preferredTimings || 'Lunch (2-4 PM) & Dinner (9-11 PM)';
    } else if (role === 'ngo') {
      if (!ngoCapacity || Number(ngoCapacity) <= 0) {
        return res.status(400).json({ message: 'Please specify a valid food capacity for the NGO.' });
      }
      userData.ngoCapacity = Number(ngoCapacity);
      userData.regNumber = regNumber || '';
      userData.shelterType = shelterType || 'Child Care Home & Orphanage';
      userData.residentCount = residentCount || '';
      userData.logisticsType = logisticsType || 'Own Distribution Van';
      if (acceptedFoodTypes) {
        userData.acceptedFoodTypes = acceptedFoodTypes;
      }
    }

    const newUser = await User.create(userData);

    // 4. Create JWT Token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account registered successfully!',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        address: newUser.address,
        city: newUser.city,
        contactPerson: newUser.contactPerson,
        landmark: newUser.landmark,
        fssaiOrGovId: newUser.fssaiOrGovId,
        ngoCapacity: newUser.ngoCapacity,
        regNumber: newUser.regNumber,
        shelterType: newUser.shelterType,
        residentCount: newUser.residentCount,
        logisticsType: newUser.logisticsType,
        donorType: newUser.donorType,
        pickupGate: newUser.pickupGate,
        preferredTimings: newUser.preferredTimings,
        lat: newUser.lat,
        lng: newUser.lng,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // 3. Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        city: user.city,
        ngoCapacity: user.ngoCapacity,
        donorType: user.donorType,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user profile.' });
  }
};