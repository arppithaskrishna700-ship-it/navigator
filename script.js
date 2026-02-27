let map, allPlaces = [], filteredPlaces = [], markers = [], userLocation = null;

function findFood() {
  const btn = document.getElementById('findBtn');
  const status = document.getElementById('locationStatus');
  btn.disabled = true;
  status.textContent = 'Getting your location...';
  showLoading(true);

  if (!navigator.geolocation) {
    alert('Geolocation not supported.');
    btn.disabled = false;
    showLoading(false);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      status.textContent = '📍 Location found! Searching nearby...';
      initMap();
      fetchPlaces();
    },
    () => {
      userLocation = { lat: 19.0760, lng: 72.8777 }; // Default: Mumbai
      status.textContent = '📍 Using Mumbai as default location';
      initMap();
      fetchPlaces();
    }
  );
}

function initMap() {
  document.getElementById('mapContainer').style.display = 'block';
  if (map) { map.remove(); }

  map = L.map('map').setView([userLocation.lat, userLocation.lng], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  L.circleMarker([userLocation.lat, userLocation.lng], {
    radius: 10, fillColor: '#ff6b35', color: '#fff', weight: 3, fillOpacity: 1
  }).addTo(map).bindPopup('📍 You are here').openPopup();
}

async function fetchPlaces() {
  const { lat, lng } = userLocation;
  const radius = 2000;

  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="restaurant"](around:${radius},${lat},${lng});
      node["amenity"="cafe"](around:${radius},${lat},${lng});
      node["amenity"="fast_food"](around:${radius},${lat},${lng});
      node["amenity"="food_court"](around:${radius},${lat},${lng});
      node["amenity"="bar"](around:${radius},${lat},${lng});
      node["tourism"="hotel"](around:${radius},${lat},${lng});
      node["tourism"="guest_house"](around:${radius},${lat},${lng});
      node["shop"="bakery"](around:${radius},${lat},${lng});
    );
    out body;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });

    const data = await response.json();
    showLoading(false);

    if (data.elements && data.elements.length > 0) {
      allPlaces = data.elements.filter(el => el.tags && el.tags.name).map(enrichPlace);
      filteredPlaces = [...allPlaces];

      document.getElementById('filterRow').style.display = 'flex';
      document.getElementById('resultsSection').style.display = 'block';
      document.getElementById('locationStatus').textContent = `✅ Found ${allPlaces.length} spots near you`;

      renderCards(filteredPlaces);
      renderMarkers(filteredPlaces);
      updateResultsHeader('All Nearby Spots', filteredPlaces.length);
    } else {
      document.getElementById('locationStatus').textContent = '😕 No spots found nearby.';
    }
  } catch (err) {
    showLoading(false);
    document.getElementById('locationStatus').textContent = '❌ Error fetching places. Check your internet.';
    console.error(err);
  }
}

function enrichPlace(place) {
  const tags = place.tags || {};
  const categories = [];
  const type = tags.amenity || tags.tourism || tags.shop || '';

  let placeType = 'Food Spot';
  if (type === 'restaurant') placeType = 'Restaurant';
  else if (type === 'cafe') placeType = 'Cafe';
  else if (type === 'fast_food') placeType = 'Fast Food';
  else if (type === 'food_court') placeType = 'Food Court';
  else if (type === 'bar') placeType = 'Bar';
  else if (type === 'hotel' || type === 'guest_house') placeType = 'Hotel';
  else if (type === 'bakery') placeType = 'Bakery';

  if (Object.keys(tags).length < 6) categories.push('hidden');
  if (Object.keys(tags).length >= 8) categories.push('popular');
  if (tags.website || tags.phone) categories.push('toprated');
  if (type === 'fast_food' || type === 'food_court') categories.push('budget');

  return {
    id: place.id,
    name: tags.name || 'Unnamed Place',
    lat: place.lat,
    lng: place.lon,
    type: placeType,
    address: tags['addr:street'] ? `${tags['addr:housenumber'] || ''} ${tags['addr:street']}`.trim() : null,
    phone: tags.phone || tags['contact:phone'] || null,
    website: tags.website || tags['contact:website'] || null,
    cuisine: tags.cuisine || null,
    openingHours: tags.opening_hours || null,
    categories,
  };
}

function renderCards(places) {
  const grid = document.getElementById('cardsGrid');
  grid.innerHTML = '';

  if (places.length === 0) {
    grid.innerHTML = `<div class="no-results"><span>🔍</span>No spots found with this filter. Try another!</div>`;
    return;
  }

  places.forEach((place, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.animationDelay = `${i * 0.04}s`;
    card.onclick = () => openModal(place);

    const badgeMap = { hidden: '💎 Hidden Gem', popular: '🔥 Popular', toprated: '⭐ Top Rated', budget: '💸 Budget' };
    const badgesHTML = place.categories.map(t => `<span class="badge badge-${t}">${badgeMap[t]}</span>`).join('');
    const emoji = typeEmoji(place.type);

    card.innerHTML = `
      <div class="card-img-placeholder">${emoji}</div>
      <div class="card-body">
        ${badgesHTML ? `<div class="card-badges">${badgesHTML}</div>` : ''}
        <div class="card-name">${place.name}</div>
        <div class="card-meta">
          <span class="card-type">${place.type}</span>
          ${place.cuisine ? `<span>· ${place.cuisine}</span>` : ''}
        </div>
        ${place.address ? `<div class="card-address">📍 ${place.address}</div>` : ''}
        ${place.openingHours ? `<div class="card-open open">🕐 ${place.openingHours}</div>` : ''}
      </div>`;
    grid.appendChild(card);
  });
}

function renderMarkers(places) {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  places.forEach(place => {
    if (!place.lat || !place.lng) return;

    const color = place.categories.includes('hidden') ? '#06d6a0'
                : place.categories.includes('popular') ? '#ff6b35'
                : place.categories.includes('toprated') ? '#ffd166'
                : '#aaaaaa';

    const marker = L.circleMarker([place.lat, place.lng], {
      radius: 8, fillColor: color, color: '#0d0d0d', weight: 2, fillOpacity: 0.9
    }).addTo(map);

    marker.bindPopup(`
      <div style="font-family:'DM Sans',sans-serif;min-width:140px">
        <strong>${place.name}</strong><br>
        <span style="color:#888;font-size:12px">${place.type}</span>
      </div>
    `);
    markers.push(marker);
  });
}

function filterBy(type, chipEl) {
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  chipEl.classList.add('active');

  const labels = { all: 'All Nearby Spots', hidden: '💎 Hidden Gems', popular: '🔥 Popular Spots', toprated: '⭐ Top Rated', budget: '💸 Budget Eats' };
  filteredPlaces = type === 'all' ? [...allPlaces] : allPlaces.filter(p => p.categories.includes(type));
  updateResultsHeader(labels[type], filteredPlaces.length);
  renderCards(filteredPlaces);
  renderMarkers(filteredPlaces);
}

function openModal(place) {
  const badgeMap = { hidden: '💎 Hidden Gem', popular: '🔥 Popular', toprated: '⭐ Top Rated', budget: '💸 Budget' };
  const badgesHTML = place.categories.map(t => `<span class="badge badge-${t}">${badgeMap[t]}</span>`).join('');
  const mapsUrl = `https://www.google.com/maps?q=${place.lat},${place.lng}`;
  const emoji = typeEmoji(place.type);

  document.getElementById('modalContent').innerHTML = `
    ${badgesHTML ? `<div class="card-badges" style="margin-bottom:16px">${badgesHTML}</div>` : ''}
    <div style="font-size:3rem;margin-bottom:12px">${emoji}</div>
    <div class="modal-name">${place.name}</div>
    <div class="modal-address">📍 ${place.address || 'Address not listed'}</div>
    <div class="modal-stats">
      <div class="modal-stat"><div class="modal-stat-value">${place.type}</div><div class="modal-stat-label">Type</div></div>
      <div class="modal-stat"><div class="modal-stat-value">${place.cuisine || '—'}</div><div class="modal-stat-label">Cuisine</div></div>
    </div>
    ${place.phone ? `<div class="modal-phone">📞 ${place.phone}</div>` : ''}
    ${place.openingHours ? `<div style="color:#06d6a0;font-size:0.9rem;margin-bottom:16px">🕐 ${place.openingHours}</div>` : ''}
    ${place.website ? `<a href="${place.website}" target="_blank" class="modal-gmaps-btn" style="margin-right:10px">🌐 Website</a>` : ''}
    <a href="${mapsUrl}" target="_blank" class="modal-gmaps-btn">🗺 Open in Maps</a>
  `;
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }
function showLoading(show) { document.getElementById('loading').style.display = show ? 'block' : 'none'; }
function updateResultsHeader(title, count) {
  document.getElementById('resultsTitle').textContent = title;
  document.getElementById('resultsCount').textContent = `${count} spots`;
}
function typeEmoji(type) {
  const map = { 'Restaurant': '🍽', 'Cafe': '☕', 'Fast Food': '🍔', 'Food Court': '🏪', 'Bar': '🍺', 'Hotel': '🏨', 'Bakery': '🥐' };
  return map[type] || '🍽';
}