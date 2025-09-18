const mongoose = require("mongoose");

// Product/Service Offer Schema
// Stores offer information used for lead scoring criteria
const offerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Value propositions for AI analysis
    value_props: [
      {
        type: String,
        trim: true,
      },
    ],
    // Target market segments for industry matching
    ideal_use_cases: [
      {
        type: String,
        trim: true,
      },
    ],
    // Active status (only one offer can be active)
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const OfferModel = mongoose.model("Offer", offerSchema);
module.exports = OfferModel;
