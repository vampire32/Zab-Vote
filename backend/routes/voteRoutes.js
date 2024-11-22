// routes/voteRoutes.js
import express from 'express';
import { voteController } from '../controllers/voteController.js';
import { authMiddleware } from '../middleware/authMiddleware.js'; // Assuming you have auth middleware

const router = express.Router();

// Protected routes
router.post('/cast', authMiddleware, voteController.castVote);
router.get('/status/:userId', authMiddleware, voteController.getVoteStatus);
router.get('/stats', authMiddleware, voteController.getVotingStats);

export default router;