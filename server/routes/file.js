const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const auth = require('../middleware/auth');
const Upload = require('../models/Upload');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Upload and parse Excel
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file' });

    const buffer = req.file.buffer;
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    // Parse first sheet
    const sheetName = workbook.SheetNames[0];
    const ws = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(ws, { defval: null });

    // Collect headers (columns) from sheet
    const headers = json.length ? Object.keys(json[0]) : [];

    // Save in DB
    const saved = new Upload({
      user: req.user.id,
      filename: req.file.originalname,
      parsed: json
    });
    await saved.save();

    res.json({ msg: 'File parsed', headers, rows: json.length, parsed: json, uploadId: saved._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

// Get user's uploads
router.get('/', auth, async (req, res) => {
  const uploads = await Upload.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(uploads);
});

module.exports = router;
