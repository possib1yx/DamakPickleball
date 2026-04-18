// server.js — Express backend for Damak Pickleball Booking

require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { sendBookingEmail, sendConfirmationEmail } = require('./mailer');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Set to your frontend domain in production
  methods: ['POST', 'GET'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Serve frontend static files ─────────────────────────────
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Rate limiter: max 5 booking requests per 15 minutes per IP
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many booking attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Health check ────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Damak Pickleball Booking API is running 🏓' });
});

// ── Booking endpoint ────────────────────────────────────────
app.post('/api/book', bookingLimiter, async (req, res) => {
  const { name, phone, email, date, time, message } = req.body;

  // Server-side validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{7,15}$/;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Name is required.' });
  }
  if (!phone || !phoneRegex.test(phone.trim())) {
    return res.status(400).json({ success: false, message: 'A valid phone number is required.' });
  }
  if (email && !emailRegex.test(email.trim())) {
    return res.status(400).json({ success: false, message: 'A valid email address is required.' });
  }
  if (!date) {
    return res.status(400).json({ success: false, message: 'Please select a date.' });
  }
  if (!time) {
    return res.status(400).json({ success: false, message: 'Please select a time slot.' });
  }

  // Prevent past dates
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate < today) {
    return res.status(400).json({ success: false, message: 'Please select a future date.' });
  }

  const bookingData = {
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim(),
    date,
    time,
    message: message ? message.trim() : '',
  };

  try {
    // Send email to owner
    await sendBookingEmail(bookingData);

    // Send confirmation to customer (non-blocking; don't fail if this fails)
    if (bookingData.email) {
      sendConfirmationEmail(bookingData).catch(err => {
        console.error('Confirmation email failed (non-critical):', err.message);
      });
    }

    console.log(`✅ Booking received: ${bookingData.name} — ${bookingData.date} ${bookingData.time}`);

    return res.status(200).json({
      success: true,
      message: 'Booking received! The owner will contact you shortly.',
    });
  } catch (err) {
    console.error('❌ Email send error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Could not send booking email. Please call us directly at 9852623369.',
    });
  }
});

// ── Start server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🏓 Damak Pickleball server running on port ${PORT}`);
});
