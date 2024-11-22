// controllers/voteController.js
import Vote from '../Model/Vote.js';
import { Types } from 'mongoose';

export const voteController = {
  // Cast a vote
  castVote: async (req, res) => {
    try {
      const { userId, candidateId } = req.body;

      // Validate ObjectIds
      if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(candidateId)) {
        return res.status(400).json({ message: 'Invalid user or candidate ID' });
      }

      // Check if user has already voted
      const existingVote = await Vote.findOne({ user: userId });
      if (existingVote) {
        return res.status(400).json({ message: 'User has already voted' });
      }

      // Create new vote
      const vote = new Vote({
        user: userId,
        candidate: candidateId
      });

      await vote.save();

      // Fetch the populated vote data
      const populatedVote = await Vote.findById(vote._id)
        .populate('user', 'name email') // Adjust fields based on your User model
        .populate('candidate', 'name party position');

      res.status(201).json({
        message: 'Vote cast successfully',
        vote: populatedVote
      });

    } catch (error) {
      console.error('Vote casting error:', error);
      res.status(500).json({ message: 'Error casting vote', error: error.message });
    }
  },

  // Get vote status for a user
  getVoteStatus: async (req, res) => {
    try {
      const { userId } = req.params;

      if (!Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const vote = await Vote.findOne({ user: userId })
        .populate('candidate', 'name party position');

      if (!vote) {
        return res.status(404).json({ hasVoted: false });
      }

      res.status(200).json({
        hasVoted: true,
        vote
      });

    } catch (error) {
      console.error('Get vote status error:', error);
      res.status(500).json({ message: 'Error fetching vote status', error: error.message });
    }
  },

  // Get voting statistics
  getVotingStats: async (req, res) => {
    try {
      const stats = await Vote.aggregate([
        {
          $lookup: {
            from: 'candidates',
            localField: 'candidate',
            foreignField: '_id',
            as: 'candidateInfo'
          }
        },
        {
          $unwind: '$candidateInfo'
        },
        {
          $group: {
            _id: '$candidate',
            candidateName: { $first: '$candidateInfo.name' },
            party: { $first: '$candidateInfo.party' },
            voteCount: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 1,
            candidateName: 1,
            party: 1,
            voteCount: 1,
          }
        }
      ]);

      const totalVotes = await Vote.countDocuments();

      res.status(200).json({
        totalVotes,
        candidateStats: stats
      });

    } catch (error) {
      console.error('Get voting stats error:', error);
      res.status(500).json({ message: 'Error fetching voting statistics', error: error.message });
    }
  }
};