const OpenAI = require('openai');
const Offer = require('../models/Offer');
const Lead = require('../models/Lead');
const ScoringResult = require('../models/ScoringResult');

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const runScoring = async (req, res) => {
  try {
    // Get active offer
    const offer = await Offer.findOne({ is_active: true });
    if (!offer) {
      return res.status(400).json({
        error: 'No active offer found',
        message: 'Create an offer first using POST /api/offer'
      });
    }

    // Get latest leads batch
    const latestLead = await Lead.findOne().sort({ createdAt: -1 });
    if (!latestLead) {
      return res.status(400).json({
        error: 'No leads found',
        message: 'Upload leads first using POST /api/leads/upload'
      });
    }

    const leads = await Lead.find({ upload_batch_id: latestLead.upload_batch_id });
    

    const sessionId = new Date().getTime().toString();
    const results = [];

    // Score each lead
    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i];
     

      try {
        // Rule-based scoring (max 50 points)
        let ruleScore = 0;

        // Role scoring (20 points)
        const role = lead.role.toLowerCase();
        if (role.includes('ceo') || role.includes('founder') || role.includes('director')) {
          ruleScore += 20;
        } else if (role.includes('head') || role.includes('manager') || role.includes('lead')) {
          ruleScore += 10;
        }

        // Industry scoring (20 points)
        const industry = lead.industry.toLowerCase();
        const useCases = offer.ideal_use_cases.join(' ').toLowerCase();
        if (industry.includes('saas') && useCases.includes('saas')) {
          ruleScore += 20;
        } else if (industry.includes('tech') || industry.includes('software')) {
          ruleScore += 10;
        }

        // Completeness scoring (10 points)
        const fields = [lead.name, lead.role, lead.company, lead.industry, lead.location];
        if (fields.every(f => f && f.trim())) {
          ruleScore += 10;
        }

        // AI scoring (max 50 points)
        let aiScore = 30; // default
        let aiReasoning = 'Standard scoring applied';

        try {
          const prompt = `
Analyze this lead for buying intent:

LEAD: ${lead.name}, ${lead.role} at ${lead.company} (${lead.industry})
PRODUCT: ${offer.name}
VALUE PROPS: ${offer.value_props.join(', ')}
TARGET: ${offer.ideal_use_cases.join(', ')}

Classify as High, Medium, or Low intent and explain briefly.
Format: "Intent: [High/Medium/Low]. Reasoning: [explanation]"
          `.trim();

          const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are a B2B sales expert. Analyze leads and classify their buying intent.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 100,
            temperature: 0.3
          });

          const aiText = response.choices[0].message.content;
          aiReasoning = aiText;

          // Parse AI response
          if (aiText.toLowerCase().includes('high')) {
            aiScore = 50;
          } else if (aiText.toLowerCase().includes('low')) {
            aiScore = 10;
          } else {
            aiScore = 30;
          }

        } catch (aiError) {
          console.log(`AI scoring failed for ${lead.name}, using default`);
        }

        // Calculate final score and intent
        const totalScore = Math.min(100, ruleScore + aiScore);
        const intent = totalScore >= 70 ? 'High' : totalScore >= 40 ? 'Medium' : 'Low';

        // Create result
        const result = new ScoringResult({
          lead_data: {
            name: lead.name,
            role: lead.role,
            company: lead.company,
            industry: lead.industry,
            location: lead.location
          },
          rule_score: ruleScore,
          ai_score: aiScore,
          total_score: totalScore,
          intent: intent,
          reasoning: `Rule: ${ruleScore}pts, AI: ${aiScore}pts. ${aiReasoning}`,
          session_id: sessionId
        });

        await result.save();
        results.push(result);

      } catch (error) {
        console.error(`Error scoring ${lead.name}:`, error);
        // Create fallback result
        const fallbackResult = new ScoringResult({
          lead_data: {
            name: lead.name,
            role: lead.role,
            company: lead.company,
            industry: lead.industry,
            location: lead.location
          },
          rule_score: 25,
          ai_score: 25,
          total_score: 50,
          intent: 'Medium',
          reasoning: 'Scoring failed - used fallback',
          session_id: sessionId
        });

        await fallbackResult.save();
        results.push(fallbackResult);
      }
    }

   

    // Generate summary
    const summary = {
      total_leads: results.length,
      high_intent: results.filter(r => r.intent === 'High').length,
      medium_intent: results.filter(r => r.intent === 'Medium').length,
      low_intent: results.filter(r => r.intent === 'Low').length,
      average_score: Math.round(
        results.reduce((sum, r) => sum + r.total_score, 0) / results.length
      )
    };

    res.status(200).json({
      message: 'Scoring completed successfully',
      session_id: sessionId,
      summary: summary,
      next_step: 'Get results using GET /api/results'
    });

  } catch (error) {
    
    res.status(500).json({
      error: 'Scoring failed',
      message: error.message
    });
  }
};

const getResults = async (req, res) => {
  try {
    // Get latest session results
    const latestResult = await ScoringResult.findOne().sort({ createdAt: -1 });
    
    if (!latestResult) {
      return res.status(404).json({
        error: 'No results found',
        message: 'Run scoring first using POST /api/score'
      });
    }

    const results = await ScoringResult.find({ session_id: latestResult.session_id })
      .sort({ total_score: -1 });

    // Format results for clean response
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

const exportCSV = async (req, res) => {
  try {
    // Get latest results
    const latestResult = await ScoringResult.findOne().sort({ createdAt: -1 });
    
    if (!latestResult) {
      return res.status(404).json({
        error: 'No results to export',
        message: 'Run scoring first'
      });
    }

    const results = await ScoringResult.find({ session_id: latestResult.session_id })
      .sort({ total_score: -1 });

    // Generate CSV
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
        `"${result.reasoning.replace(/"/g, '""')}"`
      ];
      return row.join(',');
    }).join('\n');
    
    const csvContent = csvHeader + csvRows;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `lead-scoring-results-${timestamp}.csv`;

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
