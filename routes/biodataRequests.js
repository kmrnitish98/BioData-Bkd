const express = require('express');
const Biodata = require('../models/Biodata');
const BiodataRequest = require('../models/BiodataRequest');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All request endpoints require authentication
router.use(protect);

// ── POST /api/biodata-requests ─ submit an access request
router.post('/', async (req, res) => {
  try {
    const { biodataId, message } = req.body;

    if (!biodataId) {
      return res.status(400).json({ message: 'Biodata ID is required' });
    }

    const biodata = await Biodata.findById(biodataId);
    if (!biodata) {
      return res.status(404).json({ message: 'Biodata not found' });
    }

    // Owner cannot request access to their own biodata
    if (biodata.userId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You are the owner of this biodata' });
    }

    // Check existing request
    const existing = await BiodataRequest.findOne({
      biodataId: biodata._id,
      requesterId: req.user._id,
    });

    if (existing) {
      if (existing.status === 'PENDING') {
        return res.status(409).json({
          message: 'You already have a pending access request for this biodata',
          request: existing,
        });
      }
      if (existing.status === 'ACCEPTED') {
        return res.status(400).json({
          message: 'You already have approved access to this biodata',
          request: existing,
        });
      }
      if (existing.status === 'REJECTED') {
        // Allow re-submitting if previously rejected
        existing.status = 'PENDING';
        existing.message = (message || '').trim();
        await existing.save();
        return res.status(200).json({
          message: 'Access request re-submitted successfully',
          request: existing,
        });
      }
    }

    // Create new request
    const request = await BiodataRequest.create({
      biodataId: biodata._id,
      requesterId: req.user._id,
      ownerId: biodata.userId,
      message: (message || '').trim(),
      status: 'PENDING',
    });

    res.status(201).json({
      message: 'Access request submitted successfully',
      request,
    });
  } catch (err) {
    console.error('[BiodataRequest] create error:', err.message);
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Biodata not found' });
    }
    res.status(500).json({ message: 'Failed to submit access request' });
  }
});

// ── GET /api/biodata-requests/status/:biodataId ─ check current user's request status
router.get('/status/:biodataId', async (req, res) => {
  try {
    const biodata = await Biodata.findById(req.params.biodataId);
    if (!biodata) {
      return res.status(404).json({ message: 'Biodata not found' });
    }

    const isOwner = biodata.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (isOwner || isAdmin) {
      return res.json({
        status: 'ACCEPTED',
        isOwner,
        isAdmin,
      });
    }

    const request = await BiodataRequest.findOne({
      biodataId: biodata._id,
      requesterId: req.user._id,
    });

    if (!request) {
      return res.json({
        status: 'NONE',
        isOwner: false,
      });
    }

    res.json({
      status: request.status,
      requestId: request._id,
      isOwner: false,
      message: request.message,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    });
  } catch (err) {
    console.error('[BiodataRequest] status error:', err.message);
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Biodata not found' });
    }
    res.status(500).json({ message: 'Failed to check request status' });
  }
});

// ── GET /api/biodata-requests/received ─ owner's incoming access requests
router.get('/received', async (req, res) => {
  try {
    const requests = await BiodataRequest.find({ ownerId: req.user._id })
      .populate('requesterId', 'name email mobile avatar')
      .populate('biodataId', 'personalInfo.fullName personalInfo.city photoURL templateId')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error('[BiodataRequest] received list error:', err.message);
    res.status(500).json({ message: 'Failed to fetch incoming requests' });
  }
});

// ── GET /api/biodata-requests/sent ─ requester's sent access requests
router.get('/sent', async (req, res) => {
  try {
    const requests = await BiodataRequest.find({ requesterId: req.user._id })
      .select('biodataId status createdAt updatedAt')
      .lean();

    res.json(requests);
  } catch (err) {
    console.error('[BiodataRequest] sent list error:', err.message);
    res.status(500).json({ message: 'Failed to fetch sent requests' });
  }
});

// ── PATCH /api/biodata-requests/:id/status ─ accept or reject request
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Status must be ACCEPTED or REJECTED' });
    }

    const request = await BiodataRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Access request not found' });
    }

    // STRICT SECURITY: Only the actual biodata owner can accept or reject
    if (request.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this access request' });
    }

    request.status = status;
    await request.save();

    res.json({
      message: `Access request ${status.toLowerCase()} successfully`,
      request,
    });
  } catch (err) {
    console.error('[BiodataRequest] update status error:', err.message);
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Access request not found' });
    }
    res.status(500).json({ message: 'Failed to update access request' });
  }
});

module.exports = router;
