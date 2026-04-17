# 🏓 Damak Pickleball — Booking Website

A clean, sporty pickleball court booking website with email notifications.

## 📁 Folder Structure

```
Pickleball/
├── frontend/
│   ├── index.html       ← Home page
│   ├── booking.html     ← Booking form
│   ├── success.html     ← Confirmation page
│   └── js/
│       └── app.js       ← Form handler & API calls
├── backend/
│   ├── server.js        ← Express API server
│   └── mailer.js        ← Nodemailer email logic
├── package.json
├── .env.example         ← Copy to .env and fill in credentials
└── .gitignore
```

## 🚀 Quick Start

### 1. Set up environment variables

```bash
# Copy the example file
copy .env.example .env
```

Edit `.env` and fill in your Gmail credentials:

```
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_gmail_app_password   ← NOT your Gmail login password!
OWNER_EMAIL=youremail@gmail.com
```

> **Important:** You need a **Gmail App Password**, not your regular Gmail password.  
> Go to: Google Account → Security → 2-Step Verification → App Passwords → Generate one.

### 2. Install dependencies

```bash
npm install
```

### 3. Start the backend server

```bash
npm start          # production
npm run dev        # development (auto-restarts on file change)
```

Server runs at: `http://localhost:3000`

### 4. Open the frontend

Just open `frontend/index.html` in your browser.  
Before deploying, update `BACKEND_URL` in `frontend/js/app.js` to your server URL.

---

## 📧 Email Flow

1. User fills the booking form
2. Frontend sends `POST /api/book` to the backend
3. Backend sends a **rich HTML email to the owner** (with booking details + call button)
4. Backend also sends a **confirmation email to the customer**
5. User is redirected to `success.html`

---

## 🌐 Deployment

### Frontend → Netlify / Vercel
- Drag & drop the `frontend/` folder to [netlify.com/drop](https://netlify.com/drop)
- Or connect your GitHub repo

### Backend → Render
1. Push code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set start command: `npm start`
4. Add environment variables in the Render dashboard
5. Copy the Render URL and update `BACKEND_URL` in `frontend/js/app.js`

---

## 📞 Contact Info

- **Phone:** 9852623369
- **Instagram:** [@wassaps08](https://www.instagram.com/wassaps08/?hl=en)
- **Facebook:** [Uttam Dhakal](https://www.facebook.com/uttam.dhakal.923)
- **WhatsApp:** [Chat](https://wa.me/9779852623369)
