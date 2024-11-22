const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  rollno: { type: String, required: true },
  phoneno: { type: String, required: true},
  fingerprint: { type: String},
  
});

module.exports = mongoose.model('User', UserSchema);