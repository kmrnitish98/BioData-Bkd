const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Biodata = require('../models/Biodata');
const User = require('../models/User');
const BiodataRequest = require('../models/BiodataRequest');
const { protect } = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary');

const router = express.Router();

/**
 * Auto-assigns and persists a unique shortId for legacy records missing one.
 */
const ensureDocumentShortId = async (doc) => {
  if (!doc || doc.shortId) return doc;
  try {
    let candidate = doc._id ? doc._id.toString().substring(0, 8).toLowerCase() : null;
    if (candidate) {
      const exists = await Biodata.findOne({ shortId: candidate, _id: { $ne: doc._id } });
      if (exists) {
        candidate = crypto.randomBytes(4).toString('hex').toLowerCase();
      }
    } else {
      candidate = crypto.randomBytes(4).toString('hex').toLowerCase();
    }
    await Biodata.updateOne({ _id: doc._id }, { $set: { shortId: candidate } });
    doc.shortId = candidate;
  } catch (err) {
    console.error('[Biodata] Failed to auto-assign shortId:', err.message);
  }
  return doc;
};

/**
 * Resolves a biodata profile by:
 * 1. 24-character hex MongoDB ObjectId (e.g. 6af4031c256ffa30ce7307ae)
 * 2. Dedicated indexed shortId (e.g. 6af4031c)
 * 3. Human-readable slug (e.g. rahul-kumar-28-6af4031c or rahul-kumar-28-6af4031c256ffa30ce7307ae)
 * 4. Backward-compatible range query on _id for legacy unmigrated records
 */
const findBiodataByIdOrSlug = async (identifier, projection = null) => {
  if (!identifier || typeof identifier !== 'string') return null;
  const raw = identifier.trim();

  // 1. Direct 24-character ObjectId lookup
  if (mongoose.Types.ObjectId.isValid(raw) && raw.length === 24) {
    const doc = await Biodata.findById(raw).select(projection);
    if (doc) return ensureDocumentShortId(doc);
  }

  // 2. Direct unique shortId lookup (e.g. "6af4031c")
  const byShortId = await Biodata.findOne({ shortId: raw.toLowerCase() }).select(projection);
  if (byShortId) return ensureDocumentShortId(byShortId);

  // 3. Extract trailing identifier from slug:
  // 3a. Check for 24-character hex at end of slug (e.g. ...-6af4031c256ffa30ce7307ae)
  const match24 = raw.match(/(?:^|-)([a-f0-9]{24})$/i);
  if (match24) {
    const doc = await Biodata.findById(match24[1]).select(projection);
    if (doc) return ensureDocumentShortId(doc);
  }

  // 3b. Check for shortId at end of slug (e.g. rahul-kumar-28-6af4031c)
  const matchShort = raw.match(/(?:^|-)([a-z0-9]{6,12})$/i);
  if (matchShort) {
    const shortCandidate = matchShort[1].toLowerCase();
    const doc = await Biodata.findOne({ shortId: shortCandidate }).select(projection);
    if (doc) return ensureDocumentShortId(doc);

    // Legacy unmigrated record fallback: range query on _id for 8-char hex
    if (/^[a-f0-9]{8}$/i.test(shortCandidate)) {
      try {
        const minId = new mongoose.Types.ObjectId(shortCandidate + '0000000000000000');
        const maxId = new mongoose.Types.ObjectId(shortCandidate + 'ffffffffffffffff');
        const legacyDoc = await Biodata.findOne({ _id: { $gte: minId, $lte: maxId } }).select(projection);
        if (legacyDoc) return ensureDocumentShortId(legacyDoc);
      } catch (rangeErr) {
        // Ignore invalid ObjectId cast
      }
    }
  }

  return null;
};

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

// Helper to escape regex special characters
const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ── GET /api/biodata/public ─ public listing with server-side pagination & filtering
// Private contact details (contactPhone, contactEmail, contactName) are strictly excluded
router.get('/public', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      name,
      city,
      religion,
      caste,
      location,
      age,
      ageRange,
      minAge,
      maxAge,
      filter,
    } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 50);
    const skip = (pageNum - 1) * limitNum;

    const query = { isPublic: true };
    const andConditions = [];

    // 1. General search across candidate full name, city, state
    if (search && typeof search === 'string') {
      const trimmedSearch = search.trim();
      if (trimmedSearch) {
        const searchRegex = new RegExp(escapeRegex(trimmedSearch), 'i');
        andConditions.push({
          $or: [
            { 'personalInfo.fullName': searchRegex },
            { 'personalInfo.city': searchRegex },
            { 'personalInfo.state': searchRegex },
          ],
        });
      }
    }

    // 2. Specific Name filter
    if (name && typeof name === 'string') {
      const trimmedName = name.trim();
      if (trimmedName) {
        andConditions.push({
          'personalInfo.fullName': new RegExp(escapeRegex(trimmedName), 'i'),
        });
      }
    }

    // 3. City / Location filter (matches candidate city or state)
    const loc = location || city;
    if (loc && typeof loc === 'string') {
      const trimmedLoc = loc.trim();
      if (trimmedLoc && trimmedLoc !== 'All') {
        const locRegex = new RegExp(escapeRegex(trimmedLoc), 'i');
        andConditions.push({
          $or: [
            { 'personalInfo.city': locRegex },
            { 'personalInfo.state': locRegex },
          ],
        });
      }
    }

    // 4. Religion filter
    if (religion && typeof religion === 'string') {
      const trimmedReligion = religion.trim();
      if (trimmedReligion && trimmedReligion !== 'All') {
        andConditions.push({
          'personalInfo.religion': new RegExp(`^${escapeRegex(trimmedReligion)}$`, 'i'),
        });
      }
    }

    // 5. Caste filter
    if (caste && typeof caste === 'string') {
      const trimmedCaste = caste.trim();
      if (trimmedCaste && trimmedCaste !== 'All') {
        andConditions.push({
          'personalInfo.caste': new RegExp(escapeRegex(trimmedCaste), 'i'),
        });
      }
    }

    // 6. Age range filter (supports both age and ageRange parameters)
    const effectiveAge = age || ageRange;
    let parsedMinAge = parseInt(minAge, 10);
    let parsedMaxAge = parseInt(maxAge, 10);
    if (effectiveAge && typeof effectiveAge === 'string' && effectiveAge !== 'All') {
      if (effectiveAge.includes('-')) {
        const parts = effectiveAge.split('-');
        parsedMinAge = parseInt(parts[0], 10);
        parsedMaxAge = parseInt(parts[1], 10);
      } else if (effectiveAge.endsWith('+')) {
        parsedMinAge = parseInt(effectiveAge, 10);
      }
    }

    if (!isNaN(parsedMinAge) || !isNaN(parsedMaxAge)) {
      const now = new Date();
      const currentYear = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');

      const dobCondition = {};
      if (!isNaN(parsedMaxAge)) {
        const minBirthYear = currentYear - parsedMaxAge - 1;
        dobCondition.$gt = `${minBirthYear}-${mm}-${dd}`;
      }
      if (!isNaN(parsedMinAge)) {
        const maxBirthYear = currentYear - parsedMinAge;
        dobCondition.$lte = `${maxBirthYear}-${mm}-${dd}`;
      }
      andConditions.push({ 'personalInfo.dob': dobCondition });
    }

    // 7. Legacy filter compatibility
    if (filter && typeof filter === 'string') {
      if (filter === 'With Photo') {
        andConditions.push({
          $or: [
            { photoURL: { $exists: true, $ne: '' } },
            { 'photos.0': { $exists: true } },
          ],
        });
      } else if (filter === 'Religion') {
        andConditions.push({
          'personalInfo.religion': { $exists: true, $ne: '' },
        });
      } else if (filter === 'Location') {
        andConditions.push({
          'personalInfo.city': { $exists: true, $ne: '' },
        });
      }
    }

    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    const [totalProfiles, biodatas] = await Promise.all([
      Biodata.countDocuments(query),
      Biodata.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .select('-preferences.contactPhone -preferences.contactEmail -preferences.contactName')
        .lean(),
    ]);

    const totalPages = Math.ceil(totalProfiles / limitNum) || 1;

    res.json({
      biodatas,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProfiles,
        limit: limitNum,
      },
    });
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

// ── GET /api/biodata/:id/preview ─ public profile preview without contact details
router.get('/:id/preview', async (req, res) => {
  try {
    const biodata = await findBiodataByIdOrSlug(
      req.params.id,
      '-preferences.contactPhone -preferences.contactEmail -preferences.contactName'
    );
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

// ── GET /api/biodata/:id ─ full profile (authorization required: owner, admin, or accepted requester)
router.get('/:id', async (req, res) => {
  try {
    const biodata = await findBiodataByIdOrSlug(req.params.id);
    if (!biodata) return res.status(404).json({ message: 'Biodata not found' });

    // Authentication check: token required
    let token;
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Authentication required to view private biodata' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token invalid' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.isDisabled || user.isActive === false) {
      return res.status(403).json({ message: 'Account is disabled. Please contact support.' });
    }

    // Owner or admin has immediate full access
    const isOwner = biodata.userId.toString() === user._id.toString();
    const isAdmin = user.role === 'admin';

    if (isOwner || isAdmin) {
      return res.json(biodata);
    }

    // For non-owner, verify biodata is marked public
    if (!biodata.isPublic) {
      return res.status(403).json({ message: 'This biodata is private' });
    }

    // Check database for approved access request
    const accessRequest = await BiodataRequest.findOne({
      biodataId: biodata._id,
      requesterId: user._id,
    });

    if (!accessRequest || accessRequest.status !== 'ACCEPTED') {
      const reqStatus = accessRequest ? accessRequest.status : 'NONE';
      return res.status(403).json({
        message:
          reqStatus === 'PENDING'
            ? 'Access request is pending approval'
            : reqStatus === 'REJECTED'
            ? 'Access request was rejected'
            : 'Access request required',
        status: reqStatus,
      });
    }

    // Verified approved request: grant full biodata access
    res.json(biodata);
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ message: 'Biodata not found' });
    res.status(500).json({ message: 'Server error' });
  }
});

// ── POST /api/biodata ─ create new biodata (auth required)
router.post('/', protect, async (req, res) => {
  try {
    const { personalInfo, educationInfo, familyInfo, preferences, isPublic, photoURL, photoPublicId, photos, templateId } = req.body;

    if (!personalInfo?.fullName || !personalInfo.fullName.trim()) {
      return res.status(400).json({ message: 'Full name is required' });
    }
    const caste = personalInfo?.caste?.trim();
    if (!caste) {
      return res.status(400).json({ message: 'Caste is required' });
    }
    personalInfo.caste = caste;

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
      templateId: templateId || 'default',
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

    // Validate caste if personalInfo.caste is being updated
    if (safeUpdate.personalInfo && safeUpdate.personalInfo.caste !== undefined) {
      const caste = String(safeUpdate.personalInfo.caste || '').trim();
      if (!caste) {
        return res.status(400).json({ message: 'Caste is required' });
      }
      safeUpdate.personalInfo.caste = caste;
    }
    if (safeUpdate['personalInfo.caste'] !== undefined) {
      const caste = String(safeUpdate['personalInfo.caste'] || '').trim();
      if (!caste) {
        return res.status(400).json({ message: 'Caste is required' });
      }
      safeUpdate['personalInfo.caste'] = caste;
    }

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
module.exports.findBiodataByIdOrSlug = findBiodataByIdOrSlug;
