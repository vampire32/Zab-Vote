// controllers/candidateController.js
const Candidate = require('../Model/Candidate');
const User = require('../Model/User');
// Get all candidates
exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().populate('user'); // Populate the 'user' field with user data
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Add a new candidate
exports.addCandidate = async (req, res) => {
  const { name, image, description, userId } = req.body;  

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

 
    const newCandidate = new Candidate({
      name,
      image,
      description,
      user: userId,  
    });

    await newCandidate.save();
    res.status(201).json(newCandidate);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};