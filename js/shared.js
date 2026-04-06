/* ── shared.js — Minimal: nav scroll + page transitions + admin + contact form ── */

document.addEventListener('DOMContentLoaded', () => {

  // --- Nav Scroll Effect ---
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('sc', window.scrollY > 40);
    });
  }

  // --- Page Transition Links (white fade) ---
  document.querySelectorAll('a[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href');
      const fade = document.getElementById('white-fade');
      if (fade) {
        fade.style.display = 'block';
        fade.offsetHeight; // reflow
        fade.style.opacity = '1';
        setTimeout(() => { window.location.href = target; }, 550);
      } else {
        window.location.href = target;
      }
    });
  });

  // --- Fade in from white on load ---
  const fadein = document.getElementById('white-fade');
  if (fadein) {
    fadein.style.opacity = '1';
    fadein.style.display = 'block';
    setTimeout(() => {
      fadein.style.opacity = '0';
      setTimeout(() => { fadein.style.display = 'none'; }, 500);
    }, 50);
  }

  // --- Admin Panel ---
  initAdminPanel();

  // --- Contact Form ---
  const cForm = document.getElementById('contact-form');
  if (cForm) cForm.addEventListener('submit', submitContactForm);

});

// ── Contact Form Submit ──
async function submitContactForm(e) {
  e.preventDefault();
  const name = document.getElementById('cname').value;
  const email = document.getElementById('cemail').value;
  const phone = document.getElementById('cphone').value;
  const service = document.getElementById('cservice').value;
  const msg = document.getElementById('cmsg').value;
  if (!name || !email) { alert('Please provide at least a name and email.'); return; }
  
  try {
    const res = await fetch('http://localhost:3000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, service, msg, date: new Date().toLocaleString() })
    });
    
    if (res.ok) {
        alert('Thank you! Your message has been sent successfully.');
        e.target.reset();
    } else {
        throw new Error('Failed to send');
    }
  } catch(err) {
    alert('Error sending message. Please try again later.');
    console.error(err);
  }
}

// ── Admin Panel ──
function initAdminPanel() {
  const overlayHTML = `
    <div id="admin-overlay">
      <div class="admin-header">
        <div class="admin-title">MarkGrow Admin</div>
        <div>
          <button class="admin-btn" onclick="clearAdminData()" style="margin-right:1rem;">Clear Data</button>
          <button class="admin-close" onclick="closeAdminPanel()">✕</button>
        </div>
      </div>
      <div class="admin-section">
        <h3 class="admin-stitle">Registered Visitors</h3>
        <table class="admin-table" id="admin-visitors-table">
          <thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Phone</th></tr></thead>
          <tbody></tbody>
        </table>
      </div>
      <div class="admin-section">
        <h3 class="admin-stitle">Contact Form Messages</h3>
        <table class="admin-table" id="admin-messages-table">
          <thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Phone</th><th>Service</th><th>Message</th></tr></thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', overlayHTML);
  const trigger = document.querySelector('.fb-name');
  if (trigger) {
    let clicks = 0;
    trigger.addEventListener('click', () => {
      clicks++;
      if (clicks >= 2) {
        clicks = 0;
        const pwd = prompt('Enter Admin Passcode:');
        if (pwd === 'Shirish') openAdminPanel();
        else alert('Incorrect passcode.');
      }
      setTimeout(() => clicks = 0, 500);
    });
  }
}

async function openAdminPanel() {
  const vTable = document.querySelector('#admin-visitors-table tbody');
  const mTable = document.querySelector('#admin-messages-table tbody');
  document.getElementById('admin-overlay').classList.add('vis');
  
  vTable.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';
  mTable.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';

  try {
      const [vRes, mRes] = await Promise.all([
          fetch('http://localhost:3000/api/visitors'),
          fetch('http://localhost:3000/api/messages')
      ]);
      const visitors = await vRes.json();
      const messages = await mRes.json();

      vTable.innerHTML = visitors.length
        ? visitors.map(v => `<tr><td>${v.date}</td><td>${v.name}</td><td>${v.email}</td><td>${v.phone||''}</td></tr>`).join('')
        : '<tr><td colspan="4">No visitors yet.</td></tr>';
        
      mTable.innerHTML = messages.length
        ? messages.map(m => `<tr><td>${m.date}</td><td>${m.name}</td><td>${m.email}</td><td>${m.phone||''}</td><td>${m.service||''}</td><td>${m.msg||''}</td></tr>`).join('')
        : '<tr><td colspan="6">No messages yet.</td></tr>';
  } catch(err) {
      vTable.innerHTML = '<tr><td colspan="4">Error loading data. Backend running?</td></tr>';
      mTable.innerHTML = '<tr><td colspan="6">Error loading data. Backend running?</td></tr>';
  }
}

function closeAdminPanel() { document.getElementById('admin-overlay').classList.remove('vis'); }

async function clearAdminData() {
  if (confirm('Are you sure you want to clear all backend data?')) {
    try {
        await fetch('http://localhost:3000/api/clear', { method: 'DELETE' });
        openAdminPanel();
    } catch(err) {
        alert('Failed to clear database.');
    }
  }
}
