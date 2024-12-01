// routes/voteRoutes.js
const express = require('express');
const router = express.Router();
const voteController =require('../Controller/voteController');




// Protected routes
router.post('/cast', voteController.castVote);
router.get('/status/:userId',  voteController.getVoteStatus);
router.get('/stats',  voteController.getVotingStats);

module.exports = router;