// routes/candidateRoutes.js
const express = require('express');
const router = express.Router();
const candidateController = require('../Controller/candidateController');

// Route to get all candidates
router.get('/', candidateController.getCandidates);

// Route to add a new candidate
router.post('/', candidateController.addCandidate);

module.exports = router;
