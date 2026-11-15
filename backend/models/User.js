const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['donor', 'ngo'],
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    // Specific fields for Donors (Hostel, Hotel, Mess, Restaurant)
    donorType: {
      type: String,
      enum: ['Hostel Mess', 'Hotel', 'Restaurant', 'Event/Caterer', 'Other'],
      default: 'Hostel Mess',
    },
    contactPerson: {
      type: String,
      default: '',
    },
    landmark: {
      type: String,
      default: '',
    },
    pickupGate: {
      type: String,
      default: '',
    },
    preferredTimings: {
      type: String,
      default: 'Lunch (2-4 PM) & Dinner (9-11 PM)',
    },
    fssaiOrGovId: {
      type: String,
      default: '',
    },
    // Specific fields for NGOs
    ngoCapacity: {
      type: Number, // max servings or people they can feed per day
      default: 0,
    },
    regNumber: {
      type: String,
      default: '',
    },
    shelterType: {
      type: String,
      default: 'Child Care Home & Orphanage',
    },
    residentCount: {
      type: String,
      default: '',
    },
    logisticsType: {
      type: String,
      default: 'Own Distribution Van',
    },
    acceptedFoodTypes: {
      type: [String], // e.g. ['Veg', 'Non-Veg', 'Cooked', 'Packaged']
      default: ['Veg', 'Cooked'],
    },
    // Map Coordinates
    lat: {
      type: Number,
      default: 19.0760, // Default Mumbai lat
    },
    lng: {
      type: Number,
      default: 72.8777, // Default Mumbai lng
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);