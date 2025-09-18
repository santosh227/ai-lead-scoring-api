const mongoose = require("mongoose");

const scoringResultSchema = new mongoose.Schema(
  {
    lead_data: {
      name: String,
      role: String,
      company: String,
      industry: String,
      location: String,
    },
    rule_score: {
      type: Number,
      required: true,
    },
    ai_score: {
      type: Number,
      required: true,
    },
    total_score: {
      type: Number,
      required: true,
    },
    intent: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      required: true,
    },
    reasoning: {
      type: String,
      required: true,
    },
    session_id: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const ScoringResultModel = mongoose.model("ScoringResult", scoringResultSchema);
module.exports = ScoringResultModel;
