// ── LOGIN ─────────────────────────────────────────
document.getElementById('loginBtn').addEventListener('click', () => {
  const email = document.getElementById('loginEmail').value.trim();
  const pwd   = document.getElementById('loginPwd').value;
  const err   = document.getElementById('loginError');
  if (!email || pwd !== 'demo123') {
    err.textContent = 'Invalid credentials. Use password: demo123'; err.style.display = 'block'; return;
  }
  err.style.display = 'none';
  const name = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
  localStorage.setItem('managerSession', JSON.stringify({ email, name }));
  showDashboard(name);
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('managerSession');
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
});

// Auto-login if session exists
const session = JSON.parse(localStorage.getItem('managerSession') || 'null');
if (session) showDashboard(session.name);

function showDashboard(name) {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('dashboard').style.display = 'grid';
  document.getElementById('managerName').textContent = name;
  loadDashboard();
}

// ── TABS ──────────────────────────────────────────
function switchTab(tab) {
  document.querySelectorAll('.dash-link').forEach(l => l.classList.toggle('active', l.dataset.tab === tab));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + tab));
  if (tab === 'map') initManagerMap();
}

document.querySelectorAll('.dash-link').forEach(link => {
  link.addEventListener('click', () => switchTab(link.dataset.tab));
});

// ── LOAD DASHBOARD ────────────────────────────────
function loadDashboard() {
  const data = JSON.parse(localStorage.getItem('managerData') || '{}');

  // Stats (simulated)
  document.getElementById('statViews').textContent  = data.views  || Math.floor(Math.random() * 500 + 100);
  document.getElementById('statRating').textContent = data.rating || '4.7★';
  document.getElementById('statReviews').textContent = data.reviewCount || Math.floor(Math.random() * 30 + 5);
  document.getElementById('statSaves').textContent  = data.saves  || Math.floor(Math.random() * 80 + 20);

  // Recent reviews
  const reviews = JSON.parse(localStorage.getItem('managerReviews') || '[]');
  const defaultReviews = [
    { name: 'Rahul M', rating: 5, text: 'Absolutely loved the food! Will be back.' },
    { name: 'Priya K', rating: 4, text: 'Great atmosphere and fresh ingredients.' }
  ];
  const allReviews = [...defaultReviews, ...reviews];
  document.getElementById('recentReviews').innerHTML = allReviews.slice(0, 3).map(r => `
    <div style="border-bottom:1px solid var(--border);padding:0.6rem 0;font-size:0.82rem">
      <div style="display:flex;justify-content:space-between"><strong>${r.name}</strong><span style="color:var(--accent)">${'★'.repeat(r.rating)}</span></div>
      <div style="color:var(--muted);margin-top:0.2rem">${r.text}</div>
    </div>
  `).join('');

  // Load saved spot info
  const spotData = JSON.parse(localStorage.getItem('managerSpot') || '{}');
  if (spotData.name) { ['name','area','lat','lng','desc','timing','price','must','contact','gmaps'].forEach(k => { const el = document.getElementById('m-'+k); if(el && spotData[k]) el.value = spotData[k]; }); if (spotData.type) document.getElementById('m-type').value = spotData.type; }

  // Photos
  renderPhotos();

  // Menu
  renderMenu();

  // Reviews tab
  const ratingSummary = document.getElementById('ratingSummary');
  const avg = allReviews.reduce((a,r) => a + r.rating, 0) / allReviews.length;
  ratingSummary.innerHTML = `<div class="rating-big">${avg.toFixed(1)}</div><div><div style="color:var(--accent);font-size:1.5rem">${'★'.repeat(Math.round(avg))}${'☆'.repeat(5-Math.round(avg))}</div><div style="color:var(--muted);font-size:0.82rem;margin-top:0.3rem">${allReviews.length} reviews</div></div>`;
  document.getElementById('reviewsList').innerHTML = allReviews.map(r => `
    <div class="review-item"><div class="review-item-top"><span class="reviewer">${r.name}</span><span class="review-stars-d">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span></div><p class="review-body">${r.text}</p></div>
  `).join('');
}

// ── SAVE SPOT ─────────────────────────────────────
document.getElementById('saveSpotBtn').addEventListener('click', () => {
  const data = {};
  ['name','area','lat','lng','desc','timing','price','must','contact','gmaps'].forEach(k => { data[k] = document.getElementById('m-'+k).value.trim(); });
  data.type = document.getElementById('m-type').value;
  localStorage.setItem('managerSpot', JSON.stringify(data));
  showToast('✅ Spot details saved!');
});

// ── PHOTOS ────────────────────────────────────────
function renderPhotos() {
  const photos = JSON.parse(localStorage.getItem('managerPhotos') || '[]');
  document.getElementById('photosGrid').innerHTML = photos.map((p, i) => `
    <div class="photo-thumb">
      <img src="${p}" alt="photo" onerror="this.parentElement.style.display='none'"/>
      <button class="del-photo" onclick="deletePhoto(${i})">✕</button>
    </div>
  `).join('') || '<p style="color:var(--muted);font-size:0.82rem">No photos yet.</p>';
}

document.getElementById('addPhotoUrl').addEventListener('click', () => {
  const url = document.getElementById('photoUrl').value.trim();
  if (!url) return;
  const photos = JSON.parse(localStorage.getItem('managerPhotos') || '[]');
  photos.push(url);
  localStorage.setItem('managerPhotos', JSON.stringify(photos));
  document.getElementById('photoUrl').value = '';
  renderPhotos();
  showToast('📷 Photo added!');
});

document.getElementById('photoInput').addEventListener('change', e => {
  const files = e.target.files;
  const photos = JSON.parse(localStorage.getItem('managerPhotos') || '[]');
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = ev => { photos.push(ev.target.result); localStorage.setItem('managerPhotos', JSON.stringify(photos)); renderPhotos(); };
    reader.readAsDataURL(file);
  });
  showToast(`📷 ${files.length} photo(s) uploaded!`);
});

function deletePhoto(i) {
  const photos = JSON.parse(localStorage.getItem('managerPhotos') || '[]');
  photos.splice(i, 1);
  localStorage.setItem('managerPhotos', JSON.stringify(photos));
  renderPhotos();
}

// ── MENU ──────────────────────────────────────────
function renderMenu() {
  const menu = JSON.parse(localStorage.getItem('managerMenu') || '[]');
  document.getElementById('menuList').innerHTML = menu.length ? menu.map((m, i) => `
    <div class="menu-row">
      <div class="menu-row-left">
        <span class="menu-row-name">${m.veg === 'veg' ? '🌿 ' : '🍗 '}${m.name}</span>
        <span class="menu-row-cat">${m.cat}</span>
        ${m.desc ? `<span style="font-size:0.72rem;color:var(--muted)">${m.desc}</span>` : ''}
      </div>
      <div class="menu-row-right">
        <span class="menu-row-price">₹${m.price}</span>
        <button class="menu-row-del" onclick="deleteDish(${i})">🗑</button>
      </div>
    </div>
  `).join('') : '<p style="color:var(--muted);font-size:0.82rem">No menu items yet. Add your first dish above.</p>';
}

document.getElementById('addDishBtn').addEventListener('click', () => {
  const name  = document.getElementById('dish-name').value.trim();
  const price = document.getElementById('dish-price').value.trim();
  const cat   = document.getElementById('dish-cat').value;
  const veg   = document.getElementById('dish-veg').value;
  const desc  = document.getElementById('dish-desc').value.trim();
  if (!name || !price) { showToast('⚠️ Enter dish name and price'); return; }
  const menu = JSON.parse(localStorage.getItem('managerMenu') || '[]');
  menu.push({ name, price, cat, veg, desc });
  localStorage.setItem('managerMenu', JSON.stringify(menu));
  ['dish-name','dish-price','dish-desc'].forEach(id => document.getElementById(id).value = '');
  renderMenu();
  showToast(`✅ ${name} added to menu!`);
});

function deleteDish(i) {
  const menu = JSON.parse(localStorage.getItem('managerMenu') || '[]');
  menu.splice(i, 1);
  localStorage.setItem('managerMenu', JSON.stringify(menu));
  renderMenu();
}

// ── MANAGER MAP PREVIEW ───────────────────────────
let managerMapInit = false;
function initManagerMap() {
  if (managerMapInit) return;
  managerMapInit = true;
  const spotData = JSON.parse(localStorage.getItem('managerSpot') || '{}');
  const lat = parseFloat(spotData.lat) || 9.9670;
  const lng = parseFloat(spotData.lng) || 76.2800;
  const mmap = L.map('managerMap', { center: [lat, lng], zoom: 15 });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mmap);
  L.marker([lat, lng]).addTo(mmap).bindPopup(spotData.name || 'Your Spot').openPopup();
}