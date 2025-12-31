
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
})()

/* ===================================================================
 UNIT TOGGLE CONTROL
=================================================================== */
const Units = { LBS: 'lbs', GROSS: 'gross', SHORT: 'short' };

const UNIT_FACTORS = {
  [Units.LBS]: 1,                    // pounds
  [Units.GROSS]: 1 / 2240,           // gross tons
  [Units.SHORT]: 1 / 2000            // net tons
};

const UNIT_LABELS = {
  [Units.LBS]: 'lbs',
  [Units.GROSS]: 'gross tons',
  [Units.SHORT]: 'net tons'
};

let unitMode = Units.LBS; // default

const unitCtrl = L.control({ position: 'topright' });
unitCtrl.onAdd = function () {
  const div = L.DomUtil.create('div');
  div.id = 'unitToggle';
  div.style.background = 'rgba(255,255,255,0.9)';
  div.style.border = '1px solid #ccc';
  div.style.borderRadius = '4px';
  div.style.padding = '6px 10px';
  div.style.margin = '8px';
  div.style.font = '12px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';
  div.style.boxShadow = '0 1px 3px rgba(0,0,0,0.15)';
  div.innerHTML = `
    <div style="font-weight:700;margin-bottom:4px">Units</div>
    <label style="display:block;cursor:pointer;margin-bottom:2px">
      <input type="radio" name="units" value="lbs" checked> Pounds
    </label>
    <label style="display:block;cursor:pointer;margin-bottom:2px">
      <input type="radio" name="units" value="gross"> Gross tons
    </label>
    <label style="display:block;cursor:pointer;">
      <input type="radio" name="units" value="short"> Net tons
    </label>
  `;
  div.addEventListener('change', (e) => {
    const val = e.target && e.target.value;
    if (val && UNIT_FACTORS[val] !== undefined) {
      unitMode = val;
      // Refresh currently open popup
      if (map._popup && map._popup._source) {
        map._popup._source.openPopup();
      }
    }
  });
  return div;
};
unitCtrl.addTo(map);
;

/* ===================================================================
 LOAD MARKERS + ENRICH POPUPS (CSV → JSON)
=================================================================== */
Promise.all([
  fetch('markers.json').then(r => r.json()),
  fetch('stockData.json').then(r => r.json())
]).then(([markers, stockPayload]) => {

  const stockIndex = stockPayload && stockPayload.stock ? stockPayload.stock : {};
  const unknownTypes = new Set();

  function renderPopupHtml(marker, s) {
    if (!s) return `<b>${marker.name}</b>`;
    return `
      <div style="min-width:220px">
        <div style="font-weight:700;margin-bottom:4px">${marker.name}</div>
        <table style="font-size:12px;line-height:1.3">
          <tr><td style="padding-right:8px;color:#666">Material:</td><td>${s.material || ''}</td></tr>
          <tr><td style="padding-right:8px;color:#666">Inventory:</td><td>${fmtUnit(s.operating_inventory_lbs)}</td></tr>
          <tr><td style="padding-right:8px;color:#666">Last Zero Date:</td><td style="${lastZeroColor(s.last_zero_date)}">${s.last_zero_date || ''}</td></tr>
        </table>
      </div>
    `;
  }

// === Date age helpers for Last Zero coloring ===
function parseMDY(dateStr) {
  // Expect formats like '12/10/2025' or '3/2/2020'
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
  // difference in full months between two Date objects
  const years = b.getFullYear() - a.getFullYear();
  const months = years * 12 + (b.getMonth() - a.getMonth());
  // adjust if b's day is before a's day within the month
  return (b.getDate() >= a.getDate()) ? months : months - 1;
}
function lastZeroColor(dateStr) {
  const dt = parseMDY(dateStr);
  if (!dt) return '';
  const now = new Date();
  const m = monthsDiff(dt, now);
  if (m > 6) return 'color:#c62828; font-weight:700;';      // red > 6 months
  if (m > 3) return 'color:#f9a825; font-weight:700;';      // yellow > 3 months
  return '';                                               // under 3 months: default
}

  // Extract leading pile code from marker name, e.g. "097 HBI" -> "097" or "20M Middletown" -> "20M"
  function extractPileCode(name) {
    const m = name.match(/^[A-Za-z0-9]+/);
    return m ? m[0] : null;
  }

  // Format pounds for display
  function fmtUnit(n) {
  if (typeof n !== 'number') return '—';
  const factor = UNIT_FACTORS[unitMode];
  const v = n * factor;
  const decimals = (unitMode === Units.LBS) ? 0 : 3;
  return v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + ' ' + UNIT_LABELS[unitMode];
}

  markers.forEach(marker => {
    const cfg = markerConfig[marker.type];
    if (!cfg) { unknownTypes.add(marker.type); return; }

    const m = L.marker([marker.lat, marker.lng], { icon: cfg.icon });

    // Enrich popup from stockIndex
    const code = extractPileCode(marker.name);
    const s = code ? stockIndex[code] : null;

    m.bindPopup('', { maxWidth: 320 });
    m.on('popupopen', () => m.setPopupContent(renderPopupHtml(marker, s)));
    cfg.layer.addLayer(m);

    // Keep your load-cell grouping logic
    if (marker.cell) {
      (Array.isArray(marker.cell) ? marker.cell : [marker.cell]).forEach(c => {
        if (loadCells[c]) loadCells[c].addLayer(m);
      });
    }
  });

  if (unknownTypes.size) console.warn("Unknown types:", Array.from(unknownTypes));
}); // <-- closed before Layer Control

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
