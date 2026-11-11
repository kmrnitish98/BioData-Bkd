const express = require('express');
const { z } = require('zod');
const rateLimit = require('express-rate-limit');
const ContactEnquiry = require('../models/ContactEnquiry');
const { sendEmail, getContactEnquiryNotificationHtml } = require('../utils/sendEmail');

const router = express.Router();

// ── Rate limiter: max 5 submissions per 15 minutes per IP ────────────────────
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many contact requests from this IP. Please try again after 15 minutes.',
  },
});

// ── Validation schema ────────────────────────────────────────────────────────
const contactSchema = z.object({
  name: z
    .string({ required_error: 'Full name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .email('Please enter a valid email address')
    .max(120, 'Email cannot exceed 120 characters'),
  phone: z
    .string()
    .trim()
    .max(25, 'Phone number cannot exceed 25 characters')
    .optional()
    .or(z.literal('')),
  subject: z
    .string({ required_error: 'Subject is required' })
    .trim()
    .min(2, 'Subject is required')
    .max(150, 'Subject cannot exceed 150 characters'),
  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(3000, 'Message cannot exceed 3000 characters'),
  // Honeypot fields for anti-spam bots
  website: z.string().optional(),
  honeypot: z.string().optional(),
});

// ── POST /api/contact ─ Submit contact enquiry ──────────────────────────────
router.post('/', contactLimiter, async (req, res) => {
  try {
    const parseResult = contactSchema.safeParse(req.body);

    if (!parseResult.success) {
      const issues = parseResult.error.issues || parseResult.error.errors || [];
      const errorMsg = issues[0]?.message || 'Invalid form submission';
      const fieldErrors = typeof parseResult.error.flatten === 'function' ? parseResult.error.flatten().fieldErrors : {};
      return res.status(400).json({ message: errorMsg, errors: fieldErrors });
    }

    const { name, email, phone, subject, message, website, honeypot } = parseResult.data;

    // Spam honeypot detection: bots fill hidden inputs
    if (website || honeypot) {
      console.warn('[Contact] Honeypot triggered, silently dropping bot submission');
      return res.status(200).json({
        success: true,
        message: 'Thank you for reaching out. Your message has been received.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Prevent duplicate rapid submissions (same email, subject & message in last 60 seconds)
    const recentDuplicate = await ContactEnquiry.findOne({
      email: normalizedEmail,
      subject: subject.trim(),
      message: message.trim(),
      createdAt: { $gte: new Date(Date.now() - 60 * 1000) },
    });

    if (recentDuplicate) {
      return res.status(200).json({
        success: true,
        message: 'Your message has already been received. Our team will get back to you shortly.',
        enquiryId: recentDuplicate._id,
      });
    }

    // 1. Save valid enquiry in MongoDB FIRST
    const enquiry = await ContactEnquiry.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : '',
      subject: subject.trim(),
      message: message.trim(),
      status: 'New',
    });

    // 2. Format submission timestamp in IST
    const submissionTime =
      new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short',
      }) + ' IST';

    // 3. Attempt to send notification email (does not block database success)
    const adminEmailRecipient = process.env.ADMIN_NOTIFICATION_EMAIL || 'digitalyodha98@gmail.com';

    try {
      const html = getContactEnquiryNotificationHtml({
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        subject: enquiry.subject,
        message: enquiry.message,
        submissionTime,
        enquiryId: enquiry._id,
      });

      const plainText =
        `New Contact Enquiry on Aguaa\n\n` +
        `From: ${enquiry.name} <${enquiry.email}>\n` +
        `Phone: ${enquiry.phone || 'Not provided'}\n` +
        `Subject: ${enquiry.subject}\n` +
        `Time: ${submissionTime}\n` +
        `Enquiry ID: ${enquiry._id}\n\n` +
        `Message:\n${enquiry.message}\n`;

      await sendEmail({
        email: adminEmailRecipient,
        subject: `[Aguaa Contact] ${enquiry.subject} — ${enquiry.name}`,
        message: plainText,
        html,
      });

      console.log(`[Contact] Notification email sent to ${adminEmailRecipient} for enquiry ${enquiry._id}`);
    } catch (emailErr) {
      // Graceful error logging: do not expose credentials or fail request
      console.error('[Contact] Notification email delivery note (enquiry safely saved):', emailErr.message);
    }

    // 4. Return success once saved
    return res.status(201).json({
      success: true,
      message: 'Thank you for contacting us. Your message has been received.',
      enquiryId: enquiry._id,
    });
  } catch (err) {
    console.error('[Contact] Submission error:', err.message);
    return res.status(500).json({ message: 'Failed to process contact enquiry. Please try again later.' });
  }
});

module.exports = router;
