const express = require('express');
const Biodata = require('../models/Biodata');
const { protect } = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary');

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: Specific named routes MUST come before parameterised /:id routes.
// Otherwise Express matches e.g. "/user/me" as /:id = "user" and returns 404.
// ─────────────────────────────────────────────────────────────────────────────

// ── POST /api/biodata/upload-photo ─ must be before /:id routes
router.post('/upload-photo', protect, upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({
    photoURL: req.file.path,
    photoPublicId: req.file.filename,
  });
});

// ── GET /api/biodata/public ─ public listing (no auth needed)
router.get('/public', async (req, res) => {
  try {
    const biodatas = await Biodata.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .select('-preferences.contactPhone -preferences.contactEmail');
    res.json(biodatas);
  } catch (err) {
    console.error('[Biodata] public list error:', err.message);
    res.status(500).json({ message: 'Failed to fetch public biodatas' });
  }
});

// ── GET /api/biodata/user/me ─ current user's biodatas (auth required)
router.get('/user/me', protect, async (req, res) => {
  try {
    const biodatas = await Biodata.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(biodatas);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your biodatas' });
  }
});

// ── GET /api/biodata/user/:id/private ─ single owned biodata (auth required)
router.get('/user/:id/private', protect, async (req, res) => {
  try {
    const biodata = await Biodata.findById(req.params.id);
    if (!biodata) return res.status(404).json({ message: 'Biodata not found' });
    if (biodata.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(biodata);
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ message: 'Not found' });
    res.status(500).json({ message: 'Server error' });
  }
});

// ── GET /api/biodata/:id ─ single public profile
// NOTE: This MUST come after all named /public, /user/* routes above
router.get('/:id', async (req, res) => {
  try {
    const biodata = await Biodata.findById(req.params.id);
    if (!biodata) return res.status(404).json({ message: 'Biodata not found' });

    if (!biodata.isPublic) {
      return res.status(403).json({ message: 'This biodata is private' });
    }

    res.json(biodata);
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ message: 'Biodata not found' });
    res.status(500).json({ message: 'Server error' });
  }
});

// ── POST /api/biodata ─ create new biodata (auth required)
router.post('/', protect, async (req, res) => {
  try {
    const { personalInfo, educationInfo, familyInfo, preferences, isPublic, photoURL, photoPublicId, photos } = req.body;

    if (!personalInfo?.fullName) {
      return res.status(400).json({ message: 'Full name is required' });
    }
    if (!educationInfo?.highestQualification) {
      return res.status(400).json({ message: 'Highest qualification is required' });
    }
    if (!preferences?.contactName || !preferences?.contactPhone) {
      return res.status(400).json({ message: 'Contact name and phone are required' });
    }

    const biodata = await Biodata.create({
      userId: req.user._id,
      personalInfo,
      educationInfo,
      familyInfo,
      preferences,
      isPublic: Boolean(isPublic),
      photoURL: photoURL || '',
      photoPublicId: photoPublicId || '',
      photos: photos || [],
    });

    res.status(201).json(biodata);
  } catch (err) {
    console.error('[Biodata] create error:', err.message);
    res.status(500).json({ message: 'Failed to create biodata. Please try again.' });
  }
});

// ── PATCH /api/biodata/:id ─ update (auth + ownership required)
router.patch('/:id', protect, async (req, res) => {
  try {
    const biodata = await Biodata.findById(req.params.id);
    if (!biodata) return res.status(404).json({ message: 'Biodata not found' });
    if (biodata.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { userId: _uid, createdAt: _ca, ...safeUpdate } = req.body;

    const updated = await Biodata.findByIdAndUpdate(
      req.params.id,
      { $set: safeUpdate },
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('[Biodata] update error:', err.message);
    if (err.name === 'CastError') return res.status(404).json({ message: 'Not found' });
    res.status(500).json({ message: 'Failed to update biodata. Please try again.' });
  }
});

// ── DELETE /api/biodata/:id ─ delete (auth + ownership required)
router.delete('/:id', protect, async (req, res) => {
  try {
    const biodata = await Biodata.findById(req.params.id);
    if (!biodata) return res.status(404).json({ message: 'Biodata not found' });
    if (biodata.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (biodata.photoPublicId) {
      try {
        await cloudinary.uploader.destroy(biodata.photoPublicId);
      } catch (cloudErr) {
        console.warn('[Cloudinary] photo delete failed:', cloudErr.message);
      }
    }

    await biodata.deleteOne();
    res.json({ message: 'Biodata deleted successfully' });
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ message: 'Not found' });
    res.status(500).json({ message: 'Failed to delete biodata' });
  }
});

module.exports = router;
