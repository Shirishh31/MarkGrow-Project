document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Custom Cursor ---
  const cursorDot = document.createElement('div');
  cursorDot.classList.add('cursor-dot');
  const cursorOutline = document.createElement('div');
  cursorOutline.classList.add('cursor-outline');
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorOutline);

  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let outlineX = 0, outlineY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    dotX += (mouseX - dotX) * 0.5;
    dotY += (mouseY - dotY) * 0.5;
    outlineX += (mouseX - outlineX) * 0.2;
    outlineY += (mouseY - outlineY) * 0.2;
    
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';
    cursorOutline.style.left = outlineX + 'px';
    cursorOutline.style.top = outlineY + 'px';
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover state for cursor
  const interactables = document.querySelectorAll('a, button, input, textarea, select, .scard, .fb-name');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // --- 2. Subliminal Noise Overlay ---
  const noise = document.createElement('div');
  noise.classList.add('noise-overlay');
  document.body.appendChild(noise);

  // --- 3. Nav Scroll Effect ---
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('sc', window.scrollY > 40);
    });
  }

  // --- Parallax Background Scroll ---
  const b1 = document.querySelector('.s-blob.b1');
  const b2 = document.querySelector('.s-blob.b2');
  const b3 = document.querySelector('.s-blob.b3');
  const b4 = document.querySelector('.s-blob.b4');
  
  if (b1) {
      window.addEventListener('scroll', () => {
          const s = window.scrollY;
          b1.style.transform = `translateY(${s * -0.05}px) rotate(${s * 0.01}deg)`;
          b2.style.transform = `translateY(${s * -0.15}px) rotate(${s * -0.015}deg)`;
          b3.style.transform = `translateY(${s * -0.25}px) rotate(${s * 0.02}deg)`;
          b4.style.transform = `translateY(${s * -0.4}px) rotate(${s * -0.03}deg)`;
      });
  }

  // --- 4. Content Reveals ---
  const rvEls = document.querySelectorAll('.rv');
  const rvObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('rvd'); rvObs.unobserve(e.target);} });
  }, { threshold: 0.1 });
  rvEls.forEach(el => rvObs.observe(el));

  const cards = document.querySelectorAll('.scard');
  const cardObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('revealed'); cardObs.unobserve(e.target);} });
  }, { threshold: 0.12 });
  cards.forEach(c => {
    cardObs.observe(c);
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      c.style.transform = `translateY(-6px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) scale(1.015)`;
    });
    c.addEventListener('mouseleave', () => {
      c.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });

  const fb = document.getElementById('footerbanner');
  if (fb) {
    const fbObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('rv-fb'); fbObs.unobserve(e.target);} });
    }, { threshold: 0.2 });
    fbObs.observe(fb);
  }

  const counters = document.querySelectorAll('.anum[data-target]');
  const cntObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      cntObs.unobserve(entry.target);
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      let start = null; const dur = 1800;
      const step = ts => {
        if(!start) start = ts;
        const prog = Math.min((ts - start) / dur, 1);
        const eased = 1 - Math.pow(1 - prog, 3);
        const cur = target % 1 !== 0 ? (eased * target).toFixed(1) : Math.round(eased * target);
        el.textContent = cur + suffix;
        if(prog < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cntObs.observe(c));

  // --- 5. Hero Background Animation (CSS) ---

  // --- 6. Admin Panel Setup ---
  initAdminPanel();

  // --- 7. Scroll Spy & Parallax ---
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nlinks a');

  if (sections.length > 0 && navLinks.length > 0) {
    const observerOptions = { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);
    sections.forEach((sec) => observer.observe(sec));
  }

  const hdeco = document.querySelector('.hdeco');
  if (hdeco) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      hdeco.style.transform = `translateY(calc(-50% + ${scrollY * 0.25}px))`;
    });
  }

  // --- 8. Page Transition Lens Flare ---
  const pageLinks = document.querySelectorAll('.page-link');
  pageLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href');
      const flare = document.createElement('div');
      flare.className = 'page-flare out';
      document.body.appendChild(flare);
      setTimeout(() => {
        window.location.href = target;
      }, 400); 
    });
  });

});

// Contact Form submission
async function submitContactForm(e) {
  e.preventDefault();
  const name = document.getElementById('cname').value;
  const email = document.getElementById('cemail').value;
  const phone = document.getElementById('cphone').value;
  const service = document.getElementById('cservice').value;
  const msg = document.getElementById('cmsg').value;

  if(!name || !email) { alert('Please provide at least a name and email.'); return; }
  
  const payload = { name, email, phone, service, msg, date: new Date().toLocaleString() };

  try {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if(!res.ok) throw new Error('API Error');
    alert('Thank you! Your message has been sent successfully.');
    e.target.reset(); // clear form
  } catch(err) {
    alert('Error sending message. Please try again later.');
    console.error(err);
  }
}

// Attach contact event if form exists
setTimeout(() => {
  const cForm = document.getElementById('contact-form');
  if(cForm) cForm.addEventListener('submit', submitContactForm);
}, 500);


// Hide intro and show login on login page
function initLoginSequence() {
  setTimeout(() => {
    const lo = document.getElementById('lo');
    if(lo) lo.classList.add('vis');
  }, 4200);
}

async function enterSite() {
  const n = document.getElementById('lname').value.trim();
  const e = document.getElementById('lemail').value.trim();
  const p = document.getElementById('lphone').value.trim();
  if(!n || !e || !p) { alert('Please fill in all fields to continue.'); return; }
  
  const payload = { name: n, email: e, phone: p, date: new Date().toLocaleString() };

  try {
    const res = await fetch('/api/visitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if(!res.ok) throw new Error('API Error');
    
    const lo = document.getElementById('lo');
    lo.style.opacity = '0'; lo.style.pointerEvents = 'none';
    
    setTimeout(() => { 
      window.location.href = 'main.html'; 
    }, 650);
  } catch(err) {
    alert('Failed to register visitor. Please ensure the backend is running.');
    console.error(err);
  }
}

// Admin Panel Logic
function initAdminPanel() {
  // Add overlay to body
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

  const adminTrigger = document.querySelector('.fb-name');
  if(adminTrigger) {
    let clickCount = 0;
    adminTrigger.addEventListener('click', () => {
      clickCount++;
      if(clickCount >= 2) {
         clickCount = 0;
         const pwd = prompt("Enter Admin Passcode:");
         if(pwd === "Shirish") { openAdminPanel(); } 
         else { alert("Incorrect passcode."); }
      }
      setTimeout(() => clickCount = 0, 500);
    });
  }
}

async function openAdminPanel() {
  const vTable = document.querySelector('#admin-visitors-table tbody');
  const mTable = document.querySelector('#admin-messages-table tbody');
  
  vTable.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';
  mTable.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';
  document.getElementById('admin-overlay').classList.add('vis');

  try {
    const res = await fetch('/api/admin');
    if(!res.ok) throw new Error('API Error');
    const dbData = await res.json();

    const visitors = dbData.visitors || [];
    vTable.innerHTML = visitors.length ? visitors.map(v => 
      `<tr><td>${v.date}</td><td>${v.name}</td><td>${v.email}</td><td>${v.phone || ''}</td></tr>`
    ).join('') : '<tr><td colspan="4">No visitors yet.</td></tr>';

    const messages = dbData.messages || [];
    mTable.innerHTML = messages.length ? messages.map(m => 
      `<tr><td>${m.date}</td><td>${m.name}</td><td>${m.email}</td><td>${m.phone || ''}</td><td>${m.service || ''}</td><td>${m.msg || ''}</td></tr>`
    ).join('') : '<tr><td colspan="6">No messages yet.</td></tr>';

  } catch (err) {
    vTable.innerHTML = '<tr><td colspan="4">Failed to load data. Is server running?</td></tr>';
    mTable.innerHTML = '<tr><td colspan="6">Failed to load data. Is server running?</td></tr>';
    console.error(err);
  }
}

function closeAdminPanel() {
  document.getElementById('admin-overlay').classList.remove('vis');
}

async function clearAdminData() {
  if(confirm("Are you sure you want to clear all data?")) {
    try {
      const res = await fetch('/api/admin', { method: 'DELETE' });
      if(!res.ok) throw new Error('API Error');
      openAdminPanel(); // refresh
    } catch (err) {
      alert("Failed to clear data.");
      console.error(err);
    }
  }
}
