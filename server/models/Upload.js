const mongoose = require('mongoose');

const UploadSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filename: String,
  parsed: { type: Object }, // store JSON parsed from sheet
}, { timestamps: true });

module.exports = mongoose.model('Upload', UploadSchema);
