const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    value_props: [
      {
        type: String,
        trim: true,
      },
    ],
    ideal_use_cases: [
      {
        type: String,
        trim: true,
      },
    ],
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const OfferModel = mongoose.model("Offer", offerSchema);
module.exports = OfferModel;
