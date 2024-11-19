// models/Candidate.js
const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',  // This creates a reference to the User model
    required: true 
  },
});

module.exports = mongoose.model('Candidate', CandidateSchema);