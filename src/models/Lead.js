const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    linkedin_bio: {
      type: String,
      trim: true,
      default: '',
    },
    upload_batch_id: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const LeadModel = mongoose.model("Lead", leadSchema);
module.exports = LeadModel;
