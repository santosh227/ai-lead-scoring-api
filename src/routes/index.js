const express = require('express');
const offerController = require('../controllers/offerController');
const leadController = require('../controllers/leadController');
const scoringController = require('../controllers/scoringController');

const router = express.Router();

// Offer routes
router.post('/offer', offerController.createOffer);    // offer creation endpoint 


// Lead routes
router.post('/leads/upload', leadController.uploadCSV);   // upload csv file endpoint 

// Scoring routes
router.post('/score', scoringController.runScoring);     //Scoring endpoint
router.get('/results', scoringController.getResults);    // get results endpoint 
router.get('/results/csv', scoringController.exportCSV);   


module.exports = router;
