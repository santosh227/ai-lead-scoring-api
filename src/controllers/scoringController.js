const OpenAI = require('openai');
const Offer = require('../models/Offer');
const Lead = require('../models/Lead');
const ScoringResult = require('../models/ScoringResult');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Main lead scoring function (SAME AS BEFORE - NO CHANGES)
const runScoring = async (req, res) => {
  // ... your existing scoring code stays the same
};

// Get latest scoring results - ONLY ADD .maxTimeMS(20000)
const getResults = async (req, res) => {
  try {
    // Add timeout to query - ONLY CHANGE
    const latestResult = await ScoringResult.findOne()
      .sort({ createdAt: -1 })
      .maxTimeMS(20000); // ADD THIS LINE
    
    if (!latestResult) {
      return res.status(404).json({
        error: 'No results found',
        message: 'Run scoring first using POST /api/score'
      });
    }

    // Add timeout to query - ONLY CHANGE
    const results = await ScoringResult.find({ session_id: latestResult.session_id })
      .sort({ total_score: -1 })
      .maxTimeMS(20000); // ADD THIS LINE

    // Rest of your code stays the same
    const formattedResults = results.map(result => ({
      name: result.lead_data.name,
      role: result.lead_data.role,
      company: result.lead_data.company,
      industry: result.lead_data.industry,
      location: result.lead_data.location,
      score: result.total_score,
      intent: result.intent,
      reasoning: result.reasoning
    }));

    res.json({
      results: formattedResults,
      total_count: results.length,
      session_id: latestResult.session_id
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to get results',
      message: error.message
    });
  }
};

// Export results as CSV - ONLY ADD .maxTimeMS(20000)
const exportCSV = async (req, res) => {
  try {
    // Add timeout to query - ONLY CHANGE
    const latestResult = await ScoringResult.findOne()
      .sort({ createdAt: -1 })
      .maxTimeMS(20000); // ADD THIS LINE
    
    if (!latestResult) {
      return res.status(404).json({
        error: 'No results to export',
        message: 'Run scoring first'
      });
    }

    // Add timeout to query - ONLY CHANGE
    const results = await ScoringResult.find({ session_id: latestResult.session_id })
      .sort({ total_score: -1 })
      .maxTimeMS(20000); 

    // Rest of your CSV code stays exactly the same
    const headers = ['name', 'role', 'company', 'industry', 'location', 'score', 'intent', 'reasoning'];
    const csvHeader = headers.join(',') + '\n';
    
    const csvRows = results.map(result => {
      const row = [
        result.lead_data.name,
        result.lead_data.role,
        result.lead_data.company,
        result.lead_data.industry,
        result.lead_data.location,
        result.total_score,
        result.intent,
        `"${result.reasoning.replace(/"/g, '""')}"` // Escape quotes in reasoning
      ];
      return row.join(',');
    }).join('\n');
    
    const csvContent = csvHeader + csvRows;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `lead-scoring-results-${timestamp}.csv`;

    // Set download headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    res.send(csvContent);

  } catch (error) {
    res.status(500).json({
      error: 'Failed to export CSV',
      message: error.message
    });
  }
};

module.exports = {
  runScoring,
  getResults,
  exportCSV
};
