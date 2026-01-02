
/* ===================================================================
 MAP SETUP
=================================================================== */
var map = L.map('map', {
  center: [40.793903, -82.536906],
  zoom: 18,
  minZoom: 18,
  maxZoom: 21
});
map.doubleClickZoom.disable();
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
L.imageOverlay('Scrapyard.png', [
  [40.79156379934851, -82.54114438096362],
  [40.79571031220616, -82.5323681932691]
]).addTo(map);

/* ===================================================================
 ICON DEFINITIONS
=================================================================== */
const iconst181 = L.icon({ iconUrl:'icons/st181.png',iconSize:[96,96],iconAnchor:[48,48] });
const iconst430 = L.icon({ iconUrl:'icons/st430.png',iconSize:[96,96],iconAnchor:[48,48] });
const iconst435 = L.icon({ iconUrl:'icons/st435.png',iconSize:[96,96],iconAnchor:[48,48] });
const iconst436 = L.icon({ iconUrl:'icons/st436.png',iconSize:[96,96],iconAnchor:[48,48] });
const iconnickel409 = L.icon({ iconUrl:'icons/nickel409.png',iconSize:[96,96],iconAnchor:[48,48] });
const iconcc409 = L.icon({ iconUrl:'icons/cc409.png',iconSize:[96,96],iconAnchor:[48,48] });
const iconst409 = L.icon({ iconUrl:'icons/st409.png',iconSize:[96,96],iconAnchor:[48,48] });
const iconblend181 = L.icon({ iconUrl:'icons/blend181.png',iconSize:[80,80],iconAnchor:[32,32] });
const iconblend430 = L.icon({ iconUrl:'icons/blend430.png',iconSize:[96,96],iconAnchor:[48,48] });
const iconHome = L.icon({ iconUrl:'icons/Home.png',iconSize:[96,96],iconAnchor:[48,48] });
const iconTundish = L.icon({ iconUrl:'icons/Tundish.png',iconSize:[128,128],iconAnchor:[64,64] });
const iconReclaim = L.icon({ iconUrl:'icons/Reclaim.png',iconSize:[96,96],iconAnchor:[48,48] });
const iconMtown = L.icon({ iconUrl:'icons/Mtown.png',iconSize:[96,96],iconAnchor:[48,48] });
const iconHBI = L.icon({ iconUrl:'icons/HBI.png',iconSize:[128,128],iconAnchor:[64,64] });
const iconFrag = L.icon({ iconUrl:'icons/Frag.png',iconSize:[80,80],iconAnchor:[32,32] });
const iconAlloys = L.icon({ iconUrl:'icons/Alloys.png',iconSize:[32,32],iconAnchor:[16,16] });
const iconOther = L.icon({ iconUrl:'icons/Other.png',iconSize:[96,96],iconAnchor:[48,48] });
const iconCoils = L.icon({ iconUrl:'icons/Other.png',iconSize:[96,96],iconAnchor:[48,48] });
const iconBreaking = L.icon({ iconUrl:'icons/Other.png',iconSize:[96,96],iconAnchor:[48,48] });
const iconUnbreakable = L.icon({ iconUrl:'icons/Unbreakable.png',iconSize:[50,50],iconAnchor:[25,25] });

/* ===================================================================
 MATERIAL MARKER CONFIG
=================================================================== */
const markerConfig = {
  "st181": { icon: iconst181, displayName: "181 Stainless" },
  "st430": { icon: iconst430, displayName: "430 Stainless" },
  "st435": { icon: iconst435, displayName: "435 Stainless" },
  "st436": { icon: iconst436, displayName: "436 Stainless" },
  "nickel409": { icon: iconnickel409, displayName: "409 Nickel" },
  "cc409": { icon: iconcc409, displayName: "409 Converters" },
  "st409": { icon: iconst409, displayName: "409 Scrap" },
  "blend181": { icon: iconblend181, displayName: "181 Blend" },
  "blend430": { icon: iconblend430, displayName: "430 Blend" },
  "Home": { icon: iconHome, displayName: "Home" },
  "Tundish": { icon: iconTundish, displayName: "Tundish" },
  "Reclaim": { icon: iconReclaim, displayName: "Reclaim" },
  "Mtown": { icon: iconMtown, displayName: "Middletown" },
  "HBI": { icon: iconHBI, displayName: "Hot Briq Iron" },
  "Frag": { icon: iconFrag, displayName: "Fragmented Scrap" },
  "Alloys": { icon: iconAlloys, displayName: "Alloys" },
  "Other": { icon: iconOther, displayName: "Other" },
  "Coils": { icon: iconOther, displayName: "Coils/Cutting" },
  "Breaking": { icon: iconOther, displayName: "Breaking" },
  "Unbreakable": { icon: iconUnbreakable, displayName: "Unbreakable" }
};
Object.keys(markerConfig).forEach(type =>
  markerConfig[type].layer = L.layerGroup().addTo(map)
);

/* ===================================================================
 LOAD CELL MARKERS
=================================================================== */
const loadCellMarkers = {
  LC1: L.circleMarker([40.79375707439572, -82.53582134842874], {
    radius: 15, color:"rgba(255,255,0,0.01)", fillColor:"rgba(0,0,0,0.01)",
    fillOpacity:0.01, weight:10
  }).bindTooltip("LC1"),
  LC2: L.circleMarker([40.79414131582521, -82.53631889820099], {
    radius: 15, color:"rgba(255,255,0,0.01)", fillColor:"rgba(0,0,0,0.01)",
    fillOpacity:0.01, weight:10
  }).bindTooltip("LC2"),
  LC3: L.circleMarker([40.79460316783076, -82.53730528056623], {
    radius: 15, color:"rgba(255,255,0,0.01)", fillColor:"rgba(0,0,0,0.01)",
    fillOpacity:0.01, weight:10
  }).bindTooltip("LC3"),
};
Object.values(loadCellMarkers).forEach(m => m.addTo(map));
const loadCells = {
  LC1: L.layerGroup().addTo(map),
  LC2: L.layerGroup().addTo(map),
  LC3: L.layerGroup().addTo(map)
};

/* ===================================================================
 LOAD CELL CLICK HANDLER
=================================================================== */
Object.keys(loadCellMarkers).forEach(id => {
  loadCellMarkers[id].on("click", () => {
    if (map.hasLayer(loadCells[id])) {
      map.removeLayer(loadCells[id]);
      return;
    }
    Object.values(markerConfig).forEach(cfg => {
      if (map.hasLayer(cfg.layer)) map.removeLayer(cfg.layer);
    });
    map.addLayer(loadCells[id]);
    map.setView(loadCellMarkers[id].getLatLng(), 20);
  });
});

/* ===================================================================
 TIMESTAMP BANNER (read from stockData.json meta)
=================================================================== */
(function addTimestampBanner(){
  const ctrl = L.control({ position: 'topright' });
  ctrl.onAdd = function() {
    const div = L.DomUtil.create('div');
    div.id = 'invBanner';
    div.style.background = 'rgba(255,255,255,0.9)';
    div.style.border = '1px solid #ccc';
    div.style.borderRadius = '4px';
    div.style.padding = '6px 10px';
    div.style.margin = '8px';
    div.style.font = '12px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';
    div.style.boxShadow = '0 1px 3px rgba(0,0,0,0.15)';
    div.textContent = 'Inventory data current as of —';
    return div;
  };
  ctrl.addTo(map);
  fetch('stockData.json').then(r => r.json()).then(payload => {
    const d = payload && payload.meta && payload.meta.report_date;
    const banner = document.getElementById('invBanner');
    if (banner && d) banner.textContent = `Inventory data current as of ${d}`;
  }).catch(err => console.warn('stockData.json meta fetch failed:', err));
})();

/* ===================================================================
 LOAD MARKERS + ENRICH POPUPS (CSV → JSON)
=================================================================== */
Promise.all([
  fetch('markers.json').then(r => r.json()),
  fetch('stockData.json').then(r => r.json())
]).then(([markers, stockPayload]) => {
  const stockIndex = (stockPayload && stockPayload.stock) ? stockPayload.stock : {};
  const unknownTypes = new Set();

  // === Date / display helpers ===
  function parseMDY(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const m = parseInt(parts[0], 10);
    const d = parseInt(parts[1], 10);
    const y = parseInt(parts[2], 10);
    if (!m || !d || !y) return null;
    return new Date(y, m - 1, d);
  }
  function monthsDiff(a, b) {
    const years = b.getFullYear() - a.getFullYear();
    const months = years * 12 + (b.getMonth() - a.getMonth());
    return (b.getDate() >= a.getDate()) ? months : months - 1;
  }
  function lastZeroColor(dateStr) {
    const dt = parseMDY(dateStr);
    if (!dt) return '';
    const now = new Date();
    const m = monthsDiff(dt, now);
    if (m > 6) return 'color:#c62828; font-weight:700;';
    if (m > 3) return 'color:#f9a825; font-weight:700;';
    return '';
  }
  function formatAgeYM(totalMonths) {
    if (typeof totalMonths !== 'number' || !isFinite(totalMonths) || totalMonths < 0) return '';
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    const yPart = years > 0 ? `${years} ${years === 1 ? 'year' : 'years'}` : '';
    const mPart = months > 0 ? `${months} ${months === 1 ? 'month' : 'months'}` : (years === 0 ? '0 months' : '');
    return yPart && mPart ? `${yPart} ${mPart}` : (yPart || mPart);
  }
  // Extract leading pile code from marker name, e.g. "097 HBI" -> "097" or "20M Middletown" -> "20M"
  function extractPileCode(name) {
    const m = name.match(/^[A-Za-z0-9]+/);
    return m ? m[0] : null;
  }

  function renderPopupHtml(marker, s) {
    if (!s) return `<b>${marker.name}</b>`;
    const invText = (typeof s.operating_inventory_lbs === 'number')
      ? s.operating_inventory_lbs.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' lbs'
      : '—';
    const lzStyle = lastZeroColor(s.last_zero_date);
    return `
      <div style="min-width:220px">
        <div style="font-weight:700;margin-bottom:4px">${marker.name}</div>
        <table style="font-size:12px;line-height:1.3">
          <tr><td style="padding-right:8px;color:#666">Material:</td><td>${s.material || ''}</td></tr>
          <tr><td style="padding-right:8px;color:#666">Inventory:</td><td>${invText}</td></tr>
          <tr><td style="padding-right:8px;color:#666">Last Zero Date:</td><td style="${lzStyle}">${s.last_zero_date || ''}</td></tr>
        </table>
      </div>
    `;
  }

// Create markers and attach popups
markers.forEach(marker => {
  const cfg = markerConfig[marker.type];
  if (!cfg) { unknownTypes.add(marker.type); return; }

  const m = L.marker([marker.lat, marker.lng], { icon: cfg.icon });
  const code = extractPileCode(marker.name);
  const s = code ? stockIndex[code] : null;

  m.bindPopup('', { maxWidth: 320, autopan: false });
  m.on('popupopen', () => m.setPopupContent(renderPopupHtml(marker, s)));

  // Add the marker to its material layer and remember the group
  cfg.layer.addLayer(m);
  m._group = cfg.layer;            // for ensuring visibility on Zoom
  marker._leaflet = m;             // keep reference for panel actions

  // Keep load-cell grouping
  if (marker.cell) {
    (Array.isArray(marker.cell) ? marker.cell : [marker.cell]).forEach(c => {
      if (loadCells[c]) loadCells[c].addLayer(m);
    });
  }
});

  // Build past-due list (> 6 months) with dedupe by code
  const pastDue = [];
  const seenCodes = new Set();
  markers.forEach(marker => {
    const code = extractPileCode(marker.name);
    if (!code) return;
    const s = stockIndex[code];
    if (!s) return;
    const dt = parseMDY(s.last_zero_date);
    if (!dt) return;
    const mAge = monthsDiff(dt, new Date());
    if (mAge > 6 && !seenCodes.has(code)) {
      pastDue.push({
        code: code,
        name: marker.name,
        material: s.material || '',
        lastZero: s.last_zero_date,
        ageMonths: mAge,
        ageLabel: formatAgeYM(mAge),
        invLbs: s.operating_inventory_lbs,
        marker: marker._leaflet
      });
      seenCodes.add(code);
    }
  });

  // Sort oldest first
  pastDue.sort((a, b) => b.ageMonths - a.ageMonths || a.code.localeCompare(b.code));


// --- Toggleable Past Due Panel ---
const pastDueCtrl = L.control({ position: 'bottomright' });

pastDueCtrl.onAdd = function () {
  const div = L.DomUtil.create('div');
  div.id = 'pastDuePanel';
  // Shared panel styling
  Object.assign(div.style, {
    background: 'rgba(255,255,255,0.95)',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '6px 10px',
    margin: '8px',
    font: '12px/1.3 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
    width: '260px',
    // Collapsed size should mimic timestamp banner height; we’ll keep it short.
    maxHeight: '300px',           // overall max when expanded
    overflow: 'hidden',           // hidden in collapsed
    transition: 'height 160ms ease, padding 160ms ease'
  });

  // State
  let collapsed = true;

  // Create container nodes
  const headerEl = document.createElement('div');
  const bodyEl   = document.createElement('div');

  // Header rendering (always visible)
  function renderHeader() {
    headerEl.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between">
        <span style="font-weight:700">Past Due (&gt; 6 mo)
          <span style="color:#c62828">●</span> (${pastDue.length})
        </span>
        <button id="pdToggleBtn"
                aria-expanded="${!collapsed}"
                title="${collapsed ? 'Expand' : 'Collapse'}"
                style="padding:2px 6px;border:1px solid #ccc;border-radius:3px;
                       cursor:pointer;background:#f8f8f8;display:flex;align-items:center">
          ${collapsed ? '▸' : '▾'}
        </button>
      </div>
    `;
  }

  // Body rendering (only when expanded)
  function renderBody() {
    if (collapsed) {
      bodyEl.innerHTML = ''; // clear and keep compact
      // collapsed height ~ banner-height
      div.style.height = '48px';
      div.style.padding = '6px 10px';
      return;
    }

    bodyEl.innerHTML = `
      <div style="margin-top:6px;display:flex;align-items:center;justify-content:space-between">
        <input id="pdSearch" type="text" placeholder="Filter by code/material..."
               style="flex:1;padding:4px 6px;border:1px solid #ddd;border-radius:3px;margin-right:6px">
        <button id="pdExportBtn" title="Export CSV"
                style="padding:4px 8px;border:1px solid #ccc;border-radius:3px;cursor:pointer;background:#f8f8f8">
          Export
        </button>
      </div>
      <ul id="pdList" style="list-style:none;padding:0;margin:8px 0 0 0;max-height:220px;overflow:auto"></ul>
    `;

    // Expanded layout height
    div.style.height = '300px';
    div.style.padding = '6px 10px';

    const ul = bodyEl.querySelector('#pdList');
    const searchInput = bodyEl.querySelector('#pdSearch');

    function renderList(filterText = '') {
      ul.innerHTML = '';
      const term = filterText.trim().toLowerCase();
      const items = pastDue.filter(p => {
        if (!term) return true;
        return (
          (p.code && p.code.toLowerCase().includes(term)) ||
          (p.name && p.name.toLowerCase().includes(term)) ||
          (p.material && p.material.toLowerCase().includes(term))
        );
      });

      items.forEach(p => {
        const li = document.createElement('li');
        li.style.padding = '6px 0';
        li.style.borderBottom = '1px dashed #eee';
        li.style.cursor = 'pointer';

        const invText = (typeof p.invLbs === 'number')
          ? p.invLbs.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' lbs'
          : '—';

        li.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <div style="font-weight:600">${p.code} — ${p.material}</div>
              <div style="color:#555">${p.name}</div>
              <div style="color:#c62828;font-weight:700">Last zero: ${p.lastZero}</div>
              <div style="color:#333">Age: ${p.ageLabel}</div>
              <div style="color:#333">Inventory: ${invText}</div>
            </div>
            <button style="margin-left:8px;padding:2px 6px;border:1px solid #ccc;border-radius:3px;cursor:pointer">
              Zoom
            </button>
          </div>
        `;

        li.addEventListener('click', () => {
          if (p.marker) {
      if (p.marker._group && !map.hasLayer(p.marker._group)) { map.addLayer(p.marker._group); }
      const latlng = p.marker.getLatLng();
      map.setView(latlng, 20);
      p.marker.openPopup();
    }
        });
        li.querySelector('button').addEventListener('click', (e) => {
          e.stopPropagation();
          if (p.marker) {
      if (p.marker._group && !map.hasLayer(p.marker._group)) { map.addLayer(p.marker._group); }
      const latlng = p.marker.getLatLng();
      map.setView(latlng, 20);
      p.marker.openPopup();
    }
        });

        ul.appendChild(li);
      });
    }

    // Initial list render + live filter (expanded only)
    renderList();
    searchInput.addEventListener('input', (e) => renderList(e.target.value));

    // CSV export (lbs only)
    function exportPastDueCSV() {
      const today = new Date();
      const y = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, '0');
      const d = String(today.getDate()).padStart(2, '0');
      const header = ['Pile Code','Name','Material','Last Zero Date','Age','Inventory (lbs)'];
      const lines = [header.join(',')];
      function csvSafe(val) {
        if (val === null || val === undefined) return '';
        const s = String(val);
        const needsQuotes = /[",\n]/.test(s);
        const escaped = s.replace(/"/g, '""');
        return needsQuotes ? `"${escaped}"` : escaped;
      }
      pastDue.forEach(p => {
        const invLbsStr = (typeof p.invLbs === 'number')
          ? p.invLbs.toLocaleString('en-US', { maximumFractionDigits: 0 })
          : '';
        const row = [
          csvSafe(p.code),
          csvSafe(p.name),
          csvSafe(p.material),
          csvSafe(p.lastZero),
          csvSafe(p.ageLabel),
          csvSafe(invLbsStr)
        ];
        lines.push(row.join(','));
      });
      const csvText = lines.join('\n');
      const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PastDue_${y}-${m}-${d}_lbs.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    bodyEl.querySelector('#pdExportBtn').addEventListener('click', exportPastDueCSV);
  }

  // Initial render (collapsed)
  renderHeader();
  renderBody();

  // Toggle handler (click chevron or anywhere on header)
  headerEl.addEventListener('click', (e) => {
    const btn = headerEl.querySelector('#pdToggleBtn');
    if (btn && e.target === btn) {
      // keep default behavior
    }
    collapsed = !collapsed;
    renderHeader();
    renderBody();
  });

  div.appendChild(headerEl);
  div.appendChild(bodyEl);
  return div;
};
pastDueCtrl.addTo(map);

  if (unknownTypes.size) console.warn('Unknown types:', Array.from(unknownTypes));
}).catch(err => console.error('Data load failed:', err));

/* ===================================================================
 LAYER CONTROL
=================================================================== */
const overlayMaps = {};
Object.values(markerConfig).forEach(cfg => overlayMaps[cfg.displayName] = cfg.layer);
const layerControl = L.control.layers(null, overlayMaps, {
  collapsed: true,
  position: "bottomleft"
}).addTo(map);

/* ===================================================================
 CHECK ALL/REMOVE ALL BUTTON
=================================================================== */
const checkAllBtn = L.control({ position: "bottomleft" });
checkAllBtn.onAdd = function() {
  const btn = L.DomUtil.create("button");
  btn.textContent = "Check All";
  btn.style.margin = "4px";
  btn.style.padding = "4px 8px";
  btn.style.cursor = "pointer";
  btn.onclick = () => {
    Object.values(markerConfig).forEach(cfg => map.addLayer(cfg.layer));
  };
  return btn;
};
checkAllBtn.addTo(map);

const uncheckAllBtn = L.control({ position: "bottomleft" });
uncheckAllBtn.onAdd = function() {
  const btn = L.DomUtil.create("button");
  btn.textContent = "Remove All";
  btn.style.margin = "4px";
  btn.style.padding = "4px 8px";
  btn.style.cursor = "pointer";
  btn.onclick = () => {
    Object.values(markerConfig).forEach(cfg => {
      if (map.hasLayer(cfg.layer)) map.removeLayer(cfg.layer);
    });
    Object.values(loadCells).forEach(lc => {
      if (map.hasLayer(lc)) map.removeLayer(lc);
    });
  };
  return btn;
};
uncheckAllBtn.addTo(map);

/* ===================================================================
 CONTEXT MENU
=================================================================== */
const contextMenu = document.createElement('div');
contextMenu.id = 'contextMenu';
contextMenu.innerHTML = `
  <ul>
  <li id="getCoords">📍 Get Coordinates</li>
  </ul>
`;
contextMenu.style.position = 'absolute';
contextMenu.style.display = 'none';
contextMenu.style.zIndex = 2000;
document.body.appendChild(contextMenu);
let clickLatLng = null;
map.on('contextmenu', function(e) {
  clickLatLng = e.latlng;
  contextMenu.style.left = e.originalEvent.pageX + 'px';
  contextMenu.style.top = e.originalEvent.pageY + 'px';
  contextMenu.style.display = 'block';
});
map.on('click', () => contextMenu.style.display = 'none');
document.getElementById('getCoords').addEventListener('click', async () => {
  if (!clickLatLng) return;
  const { lat, lng } = clickLatLng;
  const template = {
    type: "MARKERTYPE",
    name: "PILE# & MATERIAL",
    lat: parseFloat(lat.toFixed(14)),
    lng: parseFloat(lng.toFixed(14))
  };
  await navigator.clipboard.writeText(JSON.stringify(template));
  const emojiIcon = L.divIcon({
    html: '📍',
    className: '',
    iconSize: [48, 48],
    iconAnchor: [8,8]
  });
  const tempMarker = L.marker([lat, lng], { icon: emojiIcon }).addTo(map);
  setTimeout(() => {map.removeLayer(tempMarker);}, 1500);
  contextMenu.style.display = 'none';
});

/* ===================================================================
 GLOBAL ERROR LOGGING
=================================================================================================================================== */
window.addEventListener("error", e => console.error("Error:", e.message));
