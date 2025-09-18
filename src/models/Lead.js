const mongoose = require("mongoose");

// Lead Schema
// Stores uploaded lead information for scoring
const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Job title for role-based scoring
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
    // Industry for alignment scoring
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
    // Professional background for AI analysis
    linkedin_bio: {
      type: String,
      trim: true,
      default: '',
    },
    // Batch ID to track upload sessions
    upload_batch_id: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const LeadModel = mongoose.model("Lead", leadSchema);
module.exports = LeadModel;
