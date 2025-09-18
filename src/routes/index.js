const express = require('express');
const offerController = require('../controllers/offerController');
const leadController = require('../controllers/leadController');
const scoringController = require('../controllers/scoringController');

const router = express.Router();

// Offer management routes
router.post('/offer', offerController.createOffer);    // Create product offer endpoint 

// Lead management routes
router.post('/leads/upload', leadController.uploadCSV);   // Upload CSV file endpoint 

// Scoring and results routes
router.post('/score', scoringController.runScoring);     // Run scoring algorithm endpoint
router.get('/results', scoringController.getResults);    // Get scoring results endpoint 
router.get('/results/csv', scoringController.exportCSV); // Export results as CSV endpoint

module.exports = router;
