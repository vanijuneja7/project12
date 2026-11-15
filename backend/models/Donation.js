const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedNgo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // assigned when requested to a specific NGO or accepted
    },
    foodType: {
      type: String,
      enum: ['Veg', 'Non-Veg', 'Vegan', 'Mixed'],
      required: true,
    },
    foodCategory: {
      type: String,
      enum: ['Cooked Meal', 'Raw/Groceries', 'Bakery', 'Packaged'],
      default: 'Cooked Meal',
    },
    quantity: {
      type: Number, // number of servings / people it can feed
      required: true,
    },
    quantityUnit: {
      type: String,
      default: 'servings', // 'servings' or 'kg'
    },
    foodAge: {
      type: String,
      required: true,
      // e.g. 'Fresh (Just prepared)', '1-2 hours ago', '3-4 hours ago', 'More than 4 hours'
    },
    preparedTime: {
      type: Date,
      default: Date.now,
    },
    imageUrl: {
      type: String, // Path or URL to uploaded photo
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    packagingProvidedByNgo: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', DonationSchema);
