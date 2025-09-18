const mongoose = require("mongoose");

// Scoring Results Schema
// Stores lead scoring results with rule-based and AI scores
const scoringResultSchema = new mongoose.Schema(
  {
    // Lead information (embedded for quick access)
    lead_data: {
      name: String,
      role: String,
      company: String,
      industry: String,
      location: String,
    },
    // Rule-based scoring result (0-50 points)
    rule_score: {
      type: Number,
      required: true,
    },
    // AI analysis score (0-50 points)
    ai_score: {
      type: Number,
      required: true,
    },
    // Combined total score (0-100 points)
    total_score: {
      type: Number,
      required: true,
    },
    // Intent classification based on score
    intent: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      required: true,
    },
    // Explanation of scoring logic
    reasoning: {
      type: String,
      required: true,
    },
    // Session ID to group scoring runs
    session_id: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const ScoringResultModel = mongoose.model("ScoringResult", scoringResultSchema);
module.exports = ScoringResultModel;
