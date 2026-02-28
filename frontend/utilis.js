function tagLabel(type) {
  return { hidden: 'Hidden Gem', local: 'Local Fav', street: 'Street Food', seafood: 'Seafood' }[type] || type;
}

function showToast(msg, duration = 3000) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

function getIcon(type, selected = false) {
  const colors = { hidden: '#e74c3c', local: '#2ecc71', street: '#e8a034', seafood: '#3498db' };
  const color = colors[type] || '#e8a034';
  const size = selected ? 38 : 30;
  return L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size+8}" viewBox="0 0 30 38">
      <path d="M15 0C6.72 0 0 6.72 0 15c0 10.5 15 23 15 23S30 25.5 30 15C30 6.72 23.28 0 15 0z" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="15" cy="15" r="6" fill="white" opacity="0.9"/>
    </svg>`,
    iconSize: [size, size+8], iconAnchor: [size/2, size+8], popupAnchor: [0, -(size+8)], className: ''
  });
}