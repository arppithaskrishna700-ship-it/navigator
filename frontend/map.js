const map = L.map('map', { center: [9.9670, 76.2800], zoom: 13 });
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors', maxZoom: 19
}).addTo(map);

let activeFilter = 'all', searchQuery = '', maxPrice = 1000, selectedId = null, markers = {};

// Read URL param for pre-filter
const urlParams = new URLSearchParams(location.search);
const preFilter = urlParams.get('filter');
if (preFilter) {
  activeFilter = preFilter;
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === preFilter || (b.dataset.filter === 'all' && !preFilter));
  });
}

function parsePriceMax(priceStr) {
  if (!priceStr) return 9999;
  const nums = priceStr.match(/\d+/g);
  if (!nums) return 9999;
  return Math.max(...nums.map(Number));
}

function getFiltered() {
  return getAllSpots().filter(s => {
    const mf = activeFilter === 'all' || s.type === activeFilter;
    const q = searchQuery.toLowerCase();
    const ms = !q || s.name.toLowerCase().includes(q) || s.area.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q);
    const mp = parsePriceMax(s.price) <= maxPrice;
    return mf && ms && mp;
  });
}

function renderSidebar(filtered) {
  const list = document.getElementById('spotsList');
  const empty = document.getElementById('emptyState');
  document.getElementById('spotCount').textContent = filtered.length;

  if (!filtered.length) { list.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';

  list.innerHTML = filtered.map(s => `
    <div class="spot-card ${selectedId === s.id ? 'selected' : ''}" onclick="selectSpot(${s.id})">
      <div class="sc-top">
        <div class="sc-name">${s.emoji || '🍽️'} ${s.name}</div>
        <span class="spot-tag tag-${s.type}">${tagLabel(s.type)}</span>
      </div>
      <div class="sc-area">📍 <span>${s.area}</span></div>
      <div class="sc-desc">${s.desc}</div>
      <div class="sc-meta">
        <span>⭐ ${s.rating || '—'}</span>
        <span>💰 ${s.price}</span>
        <span>⏰ ${s.timing}</span>
        <a href="spot.html?id=${s.id}" class="sc-detail-link" onclick="event.stopPropagation()">View →</a>
      </div>
    </div>
  `).join('');
}

function renderMarkers(filtered) {
  Object.values(markers).forEach(m => map.removeLayer(m));
  markers = {};
  filtered.forEach(s => {
    const m = L.marker([s.lat, s.lng], { icon: getIcon(s.type, selectedId === s.id) })
      .addTo(map)
      .bindPopup(`
        <div class="popup-inner">
          <div class="popup-name">${s.emoji || '🍽️'} ${s.name}</div>
          <div class="popup-area">📍 ${s.area}</div>
          <div class="popup-meta"><span>⭐ ${s.rating || '—'}</span><span>💰 ${s.price}</span></div>
          <div class="popup-must">⭐ Must try: ${s.must}</div>
          <a href="spot.html?id=${s.id}" class="popup-link">View Details</a>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}" class="popup-nav" target="_blank">🧭 Navigate</a>
        </div>
      `);
    m.on('click', () => selectSpot(s.id));
    markers[s.id] = m;
  });
}

function render() {
  const f = getFiltered();
  renderSidebar(f);
  renderMarkers(f);
}

function selectSpot(id) {
  selectedId = id;
  const spot = getSpotById(id);
  if (!spot) return;
  render();
  map.flyTo([spot.lat, spot.lng], 16, { duration: 0.8 });
  setTimeout(() => { if (markers[id]) markers[id].openPopup(); }, 500);
  const cards = document.querySelectorAll('.spot-card');
  const idx = getFiltered().findIndex(s => s.id === id);
  if (cards[idx]) cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Filters
document.getElementById('filterBar').addEventListener('click', e => {
  if (!e.target.classList.contains('filter-btn')) return;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  activeFilter = e.target.dataset.filter;
  selectedId = null; render();
});

// Search
document.getElementById('searchInput').addEventListener('input', e => {
  searchQuery = e.target.value; selectedId = null; render();
});

// Price range
document.getElementById('priceRange').addEventListener('input', e => {
  maxPrice = parseInt(e.target.value);
  document.getElementById('priceLabel').textContent = maxPrice >= 1000 ? 'Any' : '₹' + maxPrice;
  selectedId = null; render();
});

// Locate me
document.getElementById('locateBtn').addEventListener('click', () => {
  if (!navigator.geolocation) { showToast('Geolocation not supported'); return; }
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude: lat, longitude: lng } = pos.coords;
    map.flyTo([lat, lng], 15);
    L.marker([lat, lng], {
      icon: L.divIcon({ html: '<div style="background:#e8a034;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(232,160,52,0.8)"></div>', iconSize: [14,14], iconAnchor: [7,7], className: '' })
    }).addTo(map).bindPopup('You are here').openPopup();
    showToast('📍 Located you on the map!');
  }, () => showToast('Could not get your location'));
});

// Add Spot Modal
const addModal = document.getElementById('addModal');
document.getElementById('openAddModal').addEventListener('click', () => addModal.classList.add('open'));
document.getElementById('closeAddModal').addEventListener('click', () => { addModal.classList.remove('open'); clearAddForm(); });
addModal.addEventListener('click', e => { if (e.target === addModal) { addModal.classList.remove('open'); clearAddForm(); } });

function clearAddForm() {
  ['a-name','a-area','a-lat','a-lng','a-desc','a-price','a-timing','a-must','a-contact','a-photo','a-rating'].forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
  document.getElementById('a-type').value = 'hidden';
  const err = document.getElementById('addError'); err.style.display = 'none';
}

document.getElementById('submitAddBtn').addEventListener('click', async () => {
  const name    = document.getElementById('a-name').value.trim();
  const area    = document.getElementById('a-area').value.trim();
  const lat     = parseFloat(document.getElementById('a-lat').value);
  const lng     = parseFloat(document.getElementById('a-lng').value);
  const type    = document.getElementById('a-type').value;
  const desc    = document.getElementById('a-desc').value.trim();
  const price   = document.getElementById('a-price').value.trim() || '₹?';
  const timing  = document.getElementById('a-timing').value.trim() || 'Check with owner';
  const must    = document.getElementById('a-must').value.trim() || 'Ask the owner';
  const contact = document.getElementById('a-contact').value.trim();
  const photo   = document.getElementById('a-photo').value.trim();
  const rating  = parseFloat(document.getElementById('a-rating').value) || 4.0;
  const errEl   = document.getElementById('addError');

  if (!name || !area || !desc) { errEl.textContent = 'Name, Area, and Description are required.'; errEl.style.display = 'block'; return; }
  if (isNaN(lat) || isNaN(lng) || lat < 9 || lat > 11 || lng < 75 || lng > 77) { errEl.textContent = 'Enter valid Kochi coordinates. Tip: right-click on Google Maps → copy coords.'; errEl.style.display = 'block'; return; }
  errEl.style.display = 'none';

  const newSpot = { id: Date.now(), name, area, type, lat, lng, desc, price, timing, must, contact, rating, emoji: '📍', photos: photo ? [photo] : [], menu: [], reviews: [] };
  await saveUserSpot(newSpot);
  addModal.classList.remove('open');
  clearAddForm();
  render();
  showToast(`✅ "${name}" added to the map!`);
  selectSpot(newSpot.id);
});

render();