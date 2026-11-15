const Donation = require('../models/Donation');
const User = require('../models/User');

// @desc    Create a new surplus food donation request
// @route   POST /api/donations
// @access  Private (Donor only)
exports.createDonation = async (req, res) => {
  try {
    if (req.user.role !== 'donor') {
      return res.status(403).json({ message: 'Only donors can create food requests.' });
    }

    const {
      foodType,
      foodCategory,
      quantity,
      quantityUnit,
      foodAge,
      imageUrl,
      notes,
      assignedNgoId, // Optional: if donor chooses a specific NGO directly
    } = req.body;

    if (!foodType || !quantity || !foodAge) {
      return res.status(400).json({ message: 'Please provide food type, quantity, and food age.' });
    }

    const donation = await Donation.create({
      donor: req.user.id,
      assignedNgo: assignedNgoId || null,
      foodType,
      foodCategory: foodCategory || 'Cooked Meal',
      quantity: Number(quantity),
      quantityUnit: quantityUnit || 'servings',
      foodAge,
      imageUrl: imageUrl || '',
      notes: notes || '',
      packagingProvidedByNgo: true,
      status: 'pending',
    });

    res.status(201).json({
      message: 'Surplus food request created successfully!',
      donation,
    });
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({ message: 'Server error creating donation request.' });
  }
};

// @desc    Get all donations created by the logged-in donor
// @route   GET /api/donations/my-donations
// @access  Private (Donor only)
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .populate('assignedNgo', 'name email phone address city ngoCapacity')
      .sort({ createdAt: -1 });

    // Privacy rule: Only reveal NGO phone number if the request is 'accepted'
    const sanitized = donations.map((donation) => {
      const doc = donation.toObject();
      if (doc.status !== 'accepted' && doc.assignedNgo) {
        delete doc.assignedNgo.phone;
      }
      return doc;
    });

    res.json(sanitized);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching your donations.' });
  }
};

// @desc    Get food requests visible to the logged-in NGO
// @route   GET /api/donations/ngo-feed
// @access  Private (NGO only)
exports.getNgoFeed = async (req, res) => {
  try {
    if (req.user.role !== 'ngo') {
      return res.status(403).json({ message: 'Only NGOs can access this feed.' });
    }

    // Show requests that are assigned to this NGO or open to all NGOs
    const donations = await Donation.find({
      $or: [{ assignedNgo: req.user.id }, { assignedNgo: null }],
      status: { $in: ['pending', 'accepted'] },
    })
      .populate('donor', 'name email phone address city donorType')
      .sort({ createdAt: -1 });

    // Privacy rule: Only reveal donor's phone number & exact address if status is 'accepted'
    const sanitized = donations.map((donation) => {
      const doc = donation.toObject();
      if (doc.status !== 'accepted' && doc.donor) {
        delete doc.donor.phone;
        // Obscure full street address, only keep city for safety
        doc.donor.address = `${doc.donor.city} (Exact address unlocked upon acceptance)`;
      }
      return doc;
    });

    res.json(sanitized);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching NGO feed.' });
  }
};

// @desc    NGO accepts a food request
// @route   PUT /api/donations/:id/accept
// @access  Private (NGO only)
exports.acceptDonation = async (req, res) => {
  try {
    if (req.user.role !== 'ngo') {
      return res.status(403).json({ message: 'Only NGOs can accept food requests.' });
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation request not found.' });
    }

    if (donation.status === 'accepted') {
      return res.status(400).json({ message: 'This request has already been accepted.' });
    }

    // Assign to this NGO and mark as accepted
    donation.status = 'accepted';
    donation.assignedNgo = req.user.id;
    await donation.save();

    // Now populate full details including phone number
    const updated = await Donation.findById(donation._id)
      .populate('donor', 'name email phone address city donorType')
      .populate('assignedNgo', 'name email phone address city');

    res.json({
      message: 'Request accepted! Contact details are now visible.',
      donation: updated,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error accepting donation.' });
  }
};

// @desc    NGO declines a food request
// @route   PUT /api/donations/:id/decline
// @access  Private (NGO only)
exports.declineDonation = async (req, res) => {
  try {
    if (req.user.role !== 'ngo') {
      return res.status(403).json({ message: 'Only NGOs can decline food requests.' });
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation request not found.' });
    }

    // Set status to declined and release NGO assignment so other NGOs can see it if needed
    donation.status = 'declined';
    donation.assignedNgo = null;
    await donation.save();

    res.json({
      message: 'Request declined successfully.',
      donation,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error declining donation.' });
  }
};

// @desc    Get public map markers (Food Donors / Hostel Messes & NGOs)
// @route   GET /api/donations/public-map
// @access  Public
exports.getPublicMapMarkers = async (req, res) => {
  try {
    // 1. Fetch live donations
    const donations = await Donation.find({ status: { $in: ['pending', 'accepted'] } })
      .populate('donor', 'name city address donorType lat lng')
      .populate('assignedNgo', 'name city address ngoCapacity lat lng')
      .limit(30);

    // 2. Fetch live NGOs
    const ngos = await User.find({ role: 'ngo' }).select(
      'name city address ngoCapacity acceptedFoodTypes lat lng logisticsType'
    ).limit(30);

    // 3. Combine into map markers format
    const markers = [];

    donations.forEach((item) => {
      if (item.donor) {
        markers.push({
          id: item._id,
          type: 'donation',
          title: item.donor.name,
          category: item.donor.donorType || 'Hostel Mess',
          foodType: item.foodType,
          quantity: `${item.quantity} ${item.quantityUnit}`,
          foodAge: item.foodAge,
          city: item.donor.city,
          address: item.status === 'accepted' ? item.donor.address : `${item.donor.city} (Exact Gate Locked)`,
          status: item.status,
          lat: item.donor.lat || 19.0760,
          lng: item.donor.lng || 72.8777,
          notes: item.notes,
          imageUrl: item.imageUrl,
        });
      }
    });

    ngos.forEach((ngo) => {
      markers.push({
        id: ngo._id,
        type: 'ngo',
        title: ngo.name,
        category: 'NGO Shelter Home',
        shelterType: ngo.shelterType || 'Child Care Home & Orphanage',
        residentCount: ngo.residentCount || 'Shelter Inmates',
        capacity: `${ngo.ngoCapacity} meals/day`,
        acceptedFoodTypes: ngo.acceptedFoodTypes,
        city: ngo.city,
        address: ngo.address,
        logisticsType: ngo.logisticsType || 'Own Distribution Van',
        lat: ngo.lat || 19.0825,
        lng: ngo.lng || 72.8850,
      });
    });

    res.json({ markers });
  } catch (error) {
    console.error('Error fetching public map markers:', error);
    res.status(500).json({ message: 'Server error fetching map markers.' });
  }
};
