// app.js — Booking form handler

const BACKEND_URL = 'https://damakpickleball.onrender.com'; // Change this to your deployed backend URL

const form = document.getElementById('booking-form');
if (!form) throw new Error('Booking form not found');

const fields = {
  name: { el: document.getElementById('name'), err: document.getElementById('name-err') },
  phone: { el: document.getElementById('phone'), err: document.getElementById('phone-err') },
  email: { el: document.getElementById('email'), err: document.getElementById('email-err') },
  date: { el: document.getElementById('date'), err: document.getElementById('date-err') },
  time: { el: document.getElementById('time'), err: document.getElementById('time-err') },
};

const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');
const spinner = document.getElementById('spinner');
const errorBanner = document.getElementById('error-banner');

function showError(field, show) {
  const f = fields[field];
  if (show) {
    f.el.classList.add('error');
    f.err.classList.remove('hidden');
  } else {
    f.el.classList.remove('error');
    f.err.classList.add('hidden');
  }
}

function validateForm(data) {
  let valid = true;
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneReg = /^[0-9]{7,15}$/;

  if (!data.name.trim()) { showError('name', true); valid = false; } else showError('name', false);
  if (!phoneReg.test(data.phone.trim())) { showError('phone', true); valid = false; } else showError('phone', false);
  if (!emailReg.test(data.email.trim())) { showError('email', true); valid = false; } else showError('email', false);
  if (!data.date) { showError('date', true); valid = false; } else showError('date', false);
  if (!data.time) { showError('time', true); valid = false; } else showError('time', false);

  return valid;
}

function setLoading(loading) {
  submitBtn.disabled = loading;
  btnText.textContent = loading ? 'Sending...' : 'Confirm Booking 🏓';
  spinner.style.display = loading ? 'block' : 'none';
}

function showBanner(msg) {
  errorBanner.textContent = msg;
  errorBanner.classList.remove('hidden');
  errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideBanner() {
  errorBanner.classList.add('hidden');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideBanner();

  const data = {
    name: fields.name.el.value,
    phone: fields.phone.el.value,
    email: fields.email.el.value,
    date: fields.date.el.value,
    time: fields.time.el.value,
    message: document.getElementById('message').value,
  };

  if (!validateForm(data)) return;

  setLoading(true);

  try {
    const res = await fetch(`${BACKEND_URL}/api/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      const params = new URLSearchParams({
        name: data.name,
        date: data.date,
        time: data.time,
      });
      window.location.href = `success.html?${params.toString()}`;
    } else {
      showBanner(result.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  } catch (err) {
    showBanner('Could not connect to the server. Please check your connection and try again.');
    setLoading(false);
  }
});

// Real-time validation on blur
Object.keys(fields).forEach(key => {
  fields[key].el.addEventListener('blur', () => {
    const data = {
      name: fields.name.el.value,
      phone: fields.phone.el.value,
      email: fields.email.el.value,
      date: fields.date.el.value,
      time: fields.time.el.value,
    };
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneReg = /^[0-9]{7,15}$/;
    if (key === 'name') showError('name', !data.name.trim());
    if (key === 'phone') showError('phone', !phoneReg.test(data.phone.trim()));
    if (key === 'email') showError('email', !emailReg.test(data.email.trim()));
    if (key === 'date') showError('date', !data.date);
    if (key === 'time') showError('time', !data.time);
  });
});
