const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  hash: { type: String, required: true }
});

module.exports = mongoose.model('login', loginSchema);
