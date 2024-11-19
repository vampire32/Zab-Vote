const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  rollno: { type: String, required: true },
  phoneno: { type: String, required: true},
  
});

module.exports = mongoose.model('User', UserSchema);