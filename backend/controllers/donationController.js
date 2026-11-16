const Donation = require('../models/Donation');
const User = require('../models/User');
const mongoose = require('mongoose');
const { getDrivingRoute, RouteCheckError } = require('../services/googleRoutes');

const ACTIVE_DONATION_STATUSES = ['pending', 'accepted'];
const DONATION_LOCK_STALE_AFTER_MS = 60 * 1000;

const releaseDonationSlot = (donorId, donationId) => User.updateOne(
  { _id: donorId, activeDonationId: donationId },
  { $set: { activeDonationId: null }, $unset: { activeDonationLockedAt: 1 } }
);

let legacyDeclinesRecovered = false;
let legacyDeclineRecoveryPromise = null;

const recoverLegacyDeclinedRequests = async () => {
  if (legacyDeclinesRecovered) return;
  if (legacyDeclineRecoveryPromise) return legacyDeclineRecoveryPromise;

  legacyDeclineRecoveryPromise = (async () => {
    const donorsWithActiveRequests = await Donation.distinct('donor', {
      status: { $in: ACTIVE_DONATION_STATUSES },
    });
    const query = { status: 'declined' };
    if (donorsWithActiveRequests.length) query.donor = { $nin: donorsWithActiveRequests };

    const oldDeclines = await Donation.find(query)
      .sort({ createdAt: -1 })
      .select('_id donor')
      .lean();
    const donorsSeen = new Set();
    const requestIdsToReopen = [];
    oldDeclines.forEach((request) => {
      const donorId = request.donor.toString();
      if (!donorsSeen.has(donorId)) {
        donorsSeen.add(donorId);
        requestIdsToReopen.push(request._id);
      }
    });

    if (requestIdsToReopen.length) {
      await Donation.updateMany(
        { _id: { $in: requestIdsToReopen }, status: 'declined' },
        {
          $set: { status: 'pending', assignedNgo: null, declinedBy: [] },
          $unset: { acceptanceTravelMinutes: 1 },
        }
      );
    }
    legacyDeclinesRecovered = true;
  })();

  try {
    await legacyDeclineRecoveryPromise;
  } catch (error) {
    legacyDeclineRecoveryPromise = null;
    throw error;
  }
};

// @desc    Create a new surplus food donation request
// @route   POST /api/donations
// @access  Private (Donor only)
exports.createDonation = async (req, res) => {
  try {
    if (req.user.role !== 'donor') {
      return res.status(403).json({ message: 'Only donors can create food requests.' });
    }

    await recoverLegacyDeclinedRequests();

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

    if (!foodType || !Number.isFinite(Number(quantity)) || Number(quantity) <= 0 || !foodAge) {
      return res.status(400).json({ message: 'Please provide food type, quantity, and food age.' });
    }

    const activeDonation = await Donation.findOne({
      donor: req.user.id,
      status: { $in: ACTIVE_DONATION_STATUSES },
    }).select('_id');
    if (activeDonation) {
      return res.status(409).json({
        message: 'You already have an active request. Complete or decline it before creating another.',
      });
    }

    const user = await User.findById(req.user.id).select('activeDonationId activeDonationLockedAt');
    if (!user) return res.status(404).json({ message: 'Donor account not found.' });

    if (user.activeDonationId) {
      const lockAgeMs = user.activeDonationLockedAt
        ? Date.now() - user.activeDonationLockedAt.getTime()
        : 0;
      if (lockAgeMs < DONATION_LOCK_STALE_AFTER_MS) {
        return res.status(409).json({
          message: 'Your previous request is still being processed. Please wait a moment and try again.',
        });
      }

      const lockedDonation = await Donation.findOne({
        _id: user.activeDonationId,
        donor: req.user.id,
        status: { $in: ACTIVE_DONATION_STATUSES },
      }).select('_id');
      if (lockedDonation) {
        return res.status(409).json({
          message: 'You already have an active request. Complete or decline it before creating another.',
        });
      }

      await releaseDonationSlot(req.user.id, user.activeDonationId);
    }

    const donationId = new mongoose.Types.ObjectId();
    const slot = await User.findOneAndUpdate(
      {
        _id: req.user.id,
        $or: [{ activeDonationId: null }, { activeDonationId: { $exists: false } }],
      },
      { $set: { activeDonationId: donationId, activeDonationLockedAt: new Date() } },
      { new: true }
    ).select('_id');

    if (!slot) {
      return res.status(409).json({
        message: 'You already have an active request. Complete or decline it before creating another.',
      });
    }

    let donation;
    try {
      donation = await Donation.create({
        _id: donationId,
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
    } catch (error) {
      const savedDonation = await Donation.exists({ _id: donationId, status: { $in: ACTIVE_DONATION_STATUSES } });
      if (!savedDonation) await releaseDonationSlot(req.user.id, donationId);
      throw error;
    }

    res.status(201).json({
      message: 'Surplus food request created successfully!',
      donation,
    });
  } catch (error) {
    console.error('Create donation error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ message: 'You already have an active request. Complete or decline it before creating another.' });
    }
    res.status(500).json({ message: 'Server error creating donation request.' });
  }
};

// @desc    Get all donations created by the logged-in donor
// @route   GET /api/donations/my-donations
// @access  Private (Donor only)
exports.getMyDonations = async (req, res) => {
  try {
    await recoverLegacyDeclinedRequests();
    const donations = await Donation.find({ donor: req.user.id })
      .populate('assignedNgo', 'name email phone address city ngoCapacity')
      .populate('declinedBy', 'name')
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

    await recoverLegacyDeclinedRequests();

    // Show requests that are assigned to this NGO or open to all NGOs
    const donations = await Donation.find({
      $and: [
        { $or: [{ assignedNgo: req.user.id }, { assignedNgo: null }] },
        { status: { $in: ['pending', 'accepted'] } },
        { declinedBy: { $ne: req.user.id } },
      ],
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

    if (donation.status !== 'pending') {
      return res.status(409).json({ message: 'This request is no longer available to accept.' });
    }

    if (donation.assignedNgo && donation.assignedNgo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'This request is reserved for another NGO.' });
    }

    const [donor, ngo] = await Promise.all([
      User.findById(donation.donor).select('address city landmark pickupGate'),
      User.findById(req.user.id).select('address city'),
    ]);
    if (!donor || !ngo) {
      return res.status(404).json({ message: 'Donor or NGO account could not be found.' });
    }

    const donorAddress = [donor.address, donor.landmark, donor.pickupGate, donor.city, 'India']
      .filter(Boolean).join(', ');
    const ngoAddress = [ngo.address, ngo.city, 'India'].filter(Boolean).join(', ');
    const route = await getDrivingRoute(ngoAddress, donorAddress);
    if (route.durationSeconds >= 2 * 60 * 60) {
      return res.status(400).json({
        message: 'This request is outside the two-hour driving limit (' + route.durationMinutes + ' minutes).',
      });
    }

    const acceptedDonation = await Donation.findOneAndUpdate(
      {
        _id: donation._id,
        status: 'pending',
        $or: [{ assignedNgo: null }, { assignedNgo: req.user.id }],
      },
      {
        $set: {
          status: 'accepted',
          assignedNgo: req.user.id,
          acceptanceTravelMinutes: route.durationMinutes,
        },
      },
      { new: true }
    );
    if (!acceptedDonation) {
      return res.status(409).json({ message: 'Another NGO accepted this request first.' });
    }

    // Now populate full details including phone number
    const updated = await Donation.findById(acceptedDonation._id)
      .populate('donor', 'name email phone address city donorType')
      .populate('assignedNgo', 'name email phone address city');

    res.json({
      message: 'Request accepted! The estimated drive is ' + route.durationMinutes + ' minutes. Contact details are now visible.',
      donation: updated,
    });
  } catch (error) {
    if (error instanceof RouteCheckError) {
      return res.status(error.statusCode).json({ message: error.publicMessage });
    }
    console.error('Accept donation error:', error);
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

    if (donation.status !== 'pending') {
      return res.status(409).json({ message: 'Only pending requests can be declined.' });
    }
    if (donation.assignedNgo && donation.assignedNgo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'This request is reserved for another NGO.' });
    }

    // Return the request to the open feed for other NGOs and keep it active for the donor.
    const declined = await Donation.findOneAndUpdate(
      { _id: donation._id, status: 'pending' },
      {
        $set: { assignedNgo: null, lastDeclinedAt: new Date() },
        $addToSet: { declinedBy: req.user.id },
      },
      { new: true }
    );
    if (!declined) return res.status(409).json({ message: 'This request has already changed.' });

    res.json({
      message: 'Request declined. It is open for other NGOs and remains active on the donor account.',
      donation: declined,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error declining donation.' });
  }
};

// @desc    Mark an accepted request as completed and release the donor's active-request slot
// @route   PUT /api/donations/:id/complete
// @access  Private (Donor or the accepting NGO)
exports.completeDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation request not found.' });

    const isDonor = donation.donor.toString() === req.user.id;
    const isAssignedNgo = donation.assignedNgo && donation.assignedNgo.toString() === req.user.id;
    if (!isDonor && !isAssignedNgo) {
      return res.status(403).json({ message: 'Only the donor or accepting NGO can complete this request.' });
    }
    if (donation.status !== 'accepted') {
      return res.status(409).json({ message: 'Only an accepted request can be marked completed.' });
    }

    const completed = await Donation.findOneAndUpdate(
      { _id: donation._id, status: 'accepted' },
      { $set: { status: 'completed' } },
      { new: true }
    );
    if (!completed) return res.status(409).json({ message: 'This request has already changed.' });

    await releaseDonationSlot(donation.donor, donation._id);
    res.json({ message: 'Request marked complete. You can create another request now.', donation: completed });
  } catch (error) {
    console.error('Complete donation error:', error);
    res.status(500).json({ message: 'Server error completing donation.' });
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
