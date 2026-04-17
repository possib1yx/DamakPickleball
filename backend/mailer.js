// mailer.js — Nodemailer configuration

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use App Password if 2FA enabled
  },
});

/**
 * Sends a booking notification email to the owner.
 * @param {Object} bookingData - { name, phone, email, date, time, message }
 */
async function sendBookingEmail(bookingData) {
  const { name, phone, email, date, time, message } = bookingData;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const mailOptions = {
    from: `"Damak Pickleball Booking" <${process.env.EMAIL_USER}>`,
    to: process.env.OWNER_EMAIL,
    subject: `🏓 New Court Booking — ${name} on ${formattedDate}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#14532d,#16a34a);padding:32px;text-align:center;">
          <h1 style="color:#facc15;font-size:28px;margin:0;font-weight:900;">🏓 Damak Pickleball</h1>
          <p style="color:#bbf7d0;margin-top:8px;font-size:14px;">New Court Booking Request</p>
        </div>

        <!-- Content -->
        <div style="padding:32px;">
          <h2 style="color:#14532d;font-size:20px;margin-bottom:24px;border-bottom:2px solid #dcfce7;padding-bottom:12px;">
            Booking Details
          </h2>

          <table style="width:100%;border-collapse:collapse;">
            <tr style="background:#f0fdf4;">
              <td style="padding:12px 16px;font-weight:700;color:#14532d;width:40%;border-radius:8px 0 0 8px;font-size:14px;">👤 Name</td>
              <td style="padding:12px 16px;color:#374151;font-size:14px;">${name}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;font-weight:700;color:#14532d;font-size:14px;">📞 Phone</td>
              <td style="padding:12px 16px;color:#374151;font-size:14px;"><a href="tel:${phone}" style="color:#22c55e;text-decoration:none;">${phone}</a></td>
            </tr>
            <tr style="background:#f0fdf4;">
              <td style="padding:12px 16px;font-weight:700;color:#14532d;font-size:14px;">📧 Email</td>
              <td style="padding:12px 16px;font-size:14px;"><a href="mailto:${email}" style="color:#22c55e;text-decoration:none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:12px 16px;font-weight:700;color:#14532d;font-size:14px;">📅 Date</td>
              <td style="padding:12px 16px;color:#374151;font-size:14px;">${formattedDate}</td>
            </tr>
            <tr style="background:#f0fdf4;">
              <td style="padding:12px 16px;font-weight:700;color:#14532d;font-size:14px;">⏰ Time Slot</td>
              <td style="padding:12px 16px;color:#374151;font-size:14px;">${time}</td>
            </tr>
            ${message ? `
            <tr>
              <td style="padding:12px 16px;font-weight:700;color:#14532d;font-size:14px;vertical-align:top;">💬 Message</td>
              <td style="padding:12px 16px;color:#374151;font-size:14px;">${message}</td>
            </tr>` : ''}
          </table>

          <!-- CTA -->
          <div style="margin-top:28px;text-align:center;">
            <a href="tel:${phone}" style="display:inline-block;background:linear-gradient(135deg,#22c55e,#16a34a);color:white;padding:14px 32px;border-radius:50px;font-weight:700;text-decoration:none;font-size:15px;box-shadow:0 4px 15px rgba(34,197,94,0.4);">
              📞 Call ${name}
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background:#14532d;padding:20px;text-align:center;">
          <p style="color:#86efac;font-size:12px;margin:0;">Damak Pickleball Booking System • This is an automated email</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

/**
 * Sends a confirmation email to the customer.
 */
async function sendConfirmationEmail(bookingData) {
  const { name, email, date, time } = bookingData;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const mailOptions = {
    from: `"Damak Pickleball" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `✅ Booking Received — Damak Pickleball`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#14532d,#16a34a);padding:32px;text-align:center;">
          <h1 style="color:#facc15;font-size:28px;margin:0;font-weight:900;">🏓 Damak Pickleball</h1>
        </div>
        <div style="padding:32px;text-align:center;">
          <div style="width:72px;height:72px;background:#22c55e;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:36px;margin-bottom:16px;">✅</div>
          <h2 style="color:#14532d;font-size:22px;margin-bottom:8px;">Hi ${name}, we got your booking!</h2>
          <p style="color:#6b7280;font-size:15px;line-height:1.6;margin-bottom:24px;">
            Your court booking request has been received. The owner will contact you soon to confirm your slot.
          </p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;text-align:left;margin-bottom:24px;">
            <p style="margin:6px 0;color:#374151;font-size:14px;"><strong style="color:#14532d;">📅 Date:</strong> ${formattedDate}</p>
            <p style="margin:6px 0;color:#374151;font-size:14px;"><strong style="color:#14532d;">⏰ Time:</strong> ${time}</p>
          </div>
          <p style="color:#6b7280;font-size:13px;">Questions? Call us at <a href="tel:9852623369" style="color:#22c55e;">9852623369</a> or reach us on <a href="https://wa.me/9779852623369" style="color:#22c55e;">WhatsApp</a>.</p>
        </div>
        <div style="background:#14532d;padding:20px;text-align:center;">
          <p style="color:#86efac;font-size:12px;margin:0;">© 2026 Damak Pickleball. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendBookingEmail, sendConfirmationEmail };
