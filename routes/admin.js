const express = require('express');
const User = require('../models/User');
const Biodata = require('../models/Biodata');
const ContactEnquiry = require('../models/ContactEnquiry');
const { protect, adminProtect } = require('../middleware/auth');

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, adminProtect);

// ── GET /api/admin/stats ─ platform-wide summary ──────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalBiodatas,
      publicBiodatas,
      privateBiodatas,
      recentUsers,
      recentBiodatas,
      googleUsers,
      totalEnquiries,
      newEnquiries,
    ] = await Promise.all([
      User.countDocuments(),
      Biodata.countDocuments(),
      Biodata.countDocuments({ isPublic: true }),
      Biodata.countDocuments({ isPublic: false }),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email avatar createdAt isAdmin'),
      Biodata.find().sort({ createdAt: -1 }).limit(5).select('personalInfo.fullName personalInfo.city isPublic photoURL createdAt'),
      User.countDocuments({ googleId: { $exists: true, $ne: null } }),
      ContactEnquiry.countDocuments(),
      ContactEnquiry.countDocuments({ status: 'New' }),
    ]);

    res.json({
      totalUsers,
      totalBiodatas,
      publicBiodatas,
      privateBiodatas,
      emailUsers: totalUsers - googleUsers,
      googleUsers,
      recentUsers,
      recentBiodatas,
      totalEnquiries,
      newEnquiries,
    });
  } catch (err) {
    console.error('[Admin] stats error:', err.message);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// ── GET /api/admin/users ─ paginated list of all users ────────────────────────
router.get('/users', async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const search = req.query.search?.trim() || '';

    const query = search
      ? { $or: [
          { name:  { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ]}
      : {};

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-password -resetPasswordToken -resetPasswordExpire'),
      User.countDocuments(query),
    ]);

    // Attach biodata count per user
    const userIds = users.map((u) => u._id);
    const counts  = await Biodata.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(counts.map((c) => [c._id.toString(), c.count]));

    res.json({
      users: users.map((u) => ({
        ...u.toObject(),
        biodataCount: countMap[u._id.toString()] || 0,
      })),
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('[Admin] users list error:', err.message);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// ── PATCH /api/admin/users/:id/disable ─ toggle isDisabled ───────────────────
router.patch('/users/:id/disable', async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot disable your own account" });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isDisabled = !user.isDisabled;
    await user.save();
    res.json({ isDisabled: user.isDisabled });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// ── DELETE /api/admin/users/:id ─ delete user + their biodatas ───────────────
router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }
    await Biodata.deleteMany({ userId: req.params.id });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User and their biodatas deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// ── GET /api/admin/biodatas ─ all biodatas with owner info ────────────────────
router.get('/biodatas', async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page)  || 1);
    const limit  = Math.min(50, parseInt(req.query.limit) || 20);
    const search = req.query.search?.trim() || '';
    const filter = req.query.filter || 'all'; // all | public | private

    const query = {};
    if (filter === 'public')  query.isPublic = true;
    if (filter === 'private') query.isPublic = false;

    if (search) {
      query.$or = [
        { 'personalInfo.fullName': { $regex: search, $options: 'i' } },
        { 'personalInfo.city':     { $regex: search, $options: 'i' } },
        { 'personalInfo.religion': { $regex: search, $options: 'i' } },
      ];
    }

    const [biodatas, total] = await Promise.all([
      Biodata.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId', 'name email avatar'),
      Biodata.countDocuments(query),
    ]);

    res.json({
      biodatas,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('[Admin] biodatas list error:', err.message);
    res.status(500).json({ message: 'Failed to fetch biodatas' });
  }
});

// ── PATCH /api/admin/biodatas/:id/visibility ─ toggle isPublic ───────────────
router.patch('/biodatas/:id/visibility', async (req, res) => {
  try {
    const biodata = await Biodata.findById(req.params.id);
    if (!biodata) return res.status(404).json({ message: 'Biodata not found' });
    biodata.isPublic = !biodata.isPublic;
    await biodata.save();
    res.json({ isPublic: biodata.isPublic });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update visibility' });
  }
});

// ── DELETE /api/admin/biodatas/:id ─ admin force-delete ──────────────────────
router.delete('/biodatas/:id', async (req, res) => {
  try {
    const biodata = await Biodata.findByIdAndDelete(req.params.id);
    if (!biodata) return res.status(404).json({ message: 'Biodata not found' });
    res.json({ message: 'Biodata deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete biodata' });
  }
});

// ── GET /api/admin/biodatas/analytics ─ per-day counts (last 30 days) ─────────
router.get('/biodatas/analytics', async (req, res) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 29);
    since.setHours(0, 0, 0, 0);

    const data = await Biodata.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});


// ── GET /api/admin/enquiries ─ paginated list of contact enquiries ───────────
router.get('/enquiries', async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page) || 1);
    const limit  = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip   = (page - 1) * limit;
    const search = req.query.search?.trim() || '';
    const status = req.query.status?.trim() || 'All';

    const filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name:    { $regex: search, $options: 'i' } },
        { email:   { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const [enquiries, total, totalAll, newCount, readCount, repliedCount, closedCount] = await Promise.all([
      ContactEnquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ContactEnquiry.countDocuments(filter),
      ContactEnquiry.countDocuments(),
      ContactEnquiry.countDocuments({ status: 'New' }),
      ContactEnquiry.countDocuments({ status: 'Read' }),
      ContactEnquiry.countDocuments({ status: 'Replied' }),
      ContactEnquiry.countDocuments({ status: 'Closed' }),
    ]);

    res.json({
      enquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
      counts: {
        total: totalAll,
        newCount,
        readCount,
        repliedCount,
        closedCount,
      },
    });
  } catch (err) {
    console.error('[Admin] enquiries error:', err.message);
    res.status(500).json({ message: 'Failed to fetch contact enquiries' });
  }
});

// ── GET /api/admin/enquiries/:id ─ single enquiry detail ────────────────────
router.get('/enquiries/:id', async (req, res) => {
  try {
    const enquiry = await ContactEnquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    res.json(enquiry);
  } catch (err) {
    console.error('[Admin] enquiry fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch enquiry' });
  }
});

// ── PATCH /api/admin/enquiries/:id/status ─ update enquiry status ───────────
router.patch('/enquiries/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['New', 'Read', 'Replied', 'Closed'];

    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${allowed.join(', ')}` });
    }

    const enquiry = await ContactEnquiry.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    res.json({ success: true, message: 'Status updated successfully', enquiry });
  } catch (err) {
    console.error('[Admin] enquiry status update error:', err.message);
    res.status(500).json({ message: 'Failed to update enquiry status' });
  }
});

// ── DELETE /api/admin/enquiries/:id ─ delete enquiry ─────────────────────────
router.delete('/enquiries/:id', async (req, res) => {
  try {
    const enquiry = await ContactEnquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    res.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (err) {
    console.error('[Admin] enquiry delete error:', err.message);
    res.status(500).json({ message: 'Failed to delete enquiry' });
  }
});

module.exports = router;
