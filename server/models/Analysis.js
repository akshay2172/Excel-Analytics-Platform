const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  upload: { type: mongoose.Schema.Types.ObjectId, ref: 'Upload', required: true },
  summary: { type: String, required: true },
  chartType: { type: String, required: true },
  xAxis: { type: String, required: true },
  yAxis: { type: String, required: true },
  title: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Analysis', AnalysisSchema);