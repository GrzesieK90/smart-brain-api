const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  joined: { type: Date, default: Date.now },
  facesDetected: { type: Number, default: 0 },
  imagesProcessed: { type: Number, default: 0 }
});

module.exports = mongoose.model('users', userSchema);
