
/* ===================================================================
 MAP SETUP
=================================================================== */
var map = L.map('map', {
    center: [40.793903, -82.536906],
    zoom: 18,
    minZoom: 18,
    maxZoom: 21,
    wheelPxPerZoomLevel: 100,
    zoomSnap: 0,
    zoomDelta: 0.25
});
map.doubleClickZoom.disable();
L.imageOverlay('Scrapyard.png', [
  [40.79156379934851, -82.54114438096362],
  [40.79571031220616, -82.5323681932691]
]).addTo(map);

/* ===================================================================
 Monthly consumption CSV
=================================================================== */
const consumptionCsvUrl = 'averageconsumption.csv'; // <-- set per month

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

// Custom bottom container for nested panels
const bottomContainer = L.control({ position: 'bottomright' });

bottomContainer.onAdd = function () {
    const div = L.DomUtil.create('div');
    div.id = 'bottomPanelContainer';
    Object.assign(div.style, {
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
        margin: '10px',
        width: 'auto',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        pointerEvents: 'none'   // allow map to receive clicks except on panels
    });
    return div;
};
bottomContainer.addTo(map);
/* ===================================================================
 ATTENTION "PING" EFFECT
=================================================================== */

function pingMarker(marker, options = {}) {
  if (!marker) return;
  const latlng = marker.getLatLng();
  const {
    color = '#ff3b30',
    pulses = 2,
    duration = 800,
    maxRadius = 40
  } = options;
  let pulse = 0;
  function makePulse() {
    const circle = L.circle(latlng, {
      radius: 1,
      color,
      weight: 3,
      opacity: 0.9,
      fillColor: color,
      fillOpacity: 0.15
    }).addTo(map);
    const start = performance.now();
    function animate(ts) {
      const t = Math.min(1, (ts - start) / duration);
      const eased = 0.5 - Math.cos(Math.PI * t) / 2;
      circle.setRadius(maxRadius * eased);
      circle.setStyle({ opacity: 0.9 * (1 - t), fillOpacity: 0.25 * (1 - t) });
      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        map.removeLayer(circle);
        pulse++;
        if (pulse < pulses) setTimeout(makePulse, 120);
      }
    }
    requestAnimationFrame(animate);
  }
  makePulse();
}

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
 TIMESTAMP BANNER
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
 LOAD MARKERS + ENRICH POPUPS
=================================================================== */
Promise.all([
  fetch('markers.json').then(r => r.json()),
  fetch('stockData.json').then(r => r.json())
]).then(([markers, stockPayload]) => {
  const stockIndex = (stockPayload && stockPayload.stock) ? stockPayload.stock : {};
  const unknownTypes = new Set();

  // Helpers
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
  function extractPileCode(name) {
    if (!name) return null;
    const m = name.match(/^[A-Za-z0-9]+/); // leading alphanumerics (e.g., "62U" from "62U Unbreakable")
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

  // Create markers
  markers.forEach(marker => {
    const cfg = markerConfig[marker.type];
    if (!cfg) { unknownTypes.add(marker.type); return; }
    const m = L.marker([marker.lat, marker.lng], { icon: cfg.icon });
    const code = extractPileCode(marker.name);
    const s = code ? stockIndex[code] : null;
    m.bindPopup('', { maxWidth: 320, autopan: false });
    m.on('popupopen', () => m.setPopupContent(renderPopupHtml(marker, s)));
    cfg.layer.addLayer(m);
    m._group = cfg.layer;
    marker._leaflet = m;
    if (marker.cell) {
      (Array.isArray(marker.cell) ? marker.cell : [marker.cell]).forEach(c => {
        if (loadCells[c]) loadCells[c].addLayer(m);
      });
    }
  });

  // Past Due list (> 6 months)
  const pastDue = [];
  const seenCodes = new Set();
  const exemptCodes = new Set([
    "291", "525", "446", "445", "41X", "984", "864",
    "62U", "62Q", "17X", "17Z", "17S", "32U"
]);

  markers.forEach(marker => {
    const code = extractPileCode(marker.name);
    if (!code) return;
    const codeUp = code.toUpperCase();
    if (exemptCodes.has(codeUp)) return
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
  pastDue.sort((a, b) => (b.ageMonths - a.ageMonths) || a.code.localeCompare(b.code));

  /* ===================================================================
   CONSUMPTION CSV PARSER
  =================================================================== */
  async function fetchConsumptionCsv() {
    const res = await fetch(consumptionCsvUrl);
    if (!res.ok) throw new Error(`Failed to fetch ${consumptionCsvUrl}: ${res.status}`);
    const text = await res.text();
    // A: Day | B: Consumed | C: Net_Tons | D: blank | E: Pile | F: Total_Actual | G: Avg_Daily
    const lines = text.split(/\r?\n/);
    if (!lines.length) throw new Error("Consumption CSV is empty.");
    const header = (lines[0] || "").trim();
    const expected = "Day,Consumed,Net_Tons,,Pile,Total_Actual,Avg_Daily";
    if (!header.startsWith(expected)) {
      console.warn("Consumption CSV header did not match side-by-side format:", header);
    }
    const pileAvgByCode = {}; // { CODE -> avgDaily }
    for (let i = 1; i < lines.length; i++) {
      const raw = lines[i];
      if (!raw) continue;
      const parts = raw.split(",");
      if (parts.length < 7) continue;
      const pile = (parts[4] || "").trim().toUpperCase(); // column E
      const avgStr = (parts[6] || "").trim();             // column G
      if (!pile) continue;
      const avg = Number(avgStr);
      pileAvgByCode[pile] = Number.isFinite(avg) ? avg : 0;
    }
    return { pileAvgByCode };
  }

  /* ===================================================================
   Toggleable Past Due Panel
  =================================================================== */
  const pastDueCtrl = L.control({ position: 'bottomleft' });
  pastDueCtrl.onAdd = function () {
    const div = L.DomUtil.create('div'); 
    L.DomEvent.disableScrollPropagation(div);
    L.DomEvent.disableClickPropagation(div);
    div.id = 'pastDuePanel';
    Object.assign(div.style, {
      background: 'rgba(255,255,255,0.95)',
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '6px 10px',
      margin: '8px',
      font: '12px/1.3 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
      width: '260px',
      maxHeight: '300px',
      overflow: 'hidden',
      transition: 'height 160ms ease, padding 160ms ease'
    });
    let collapsed = true;
    const headerEl = document.createElement('div');
    const bodyEl = document.createElement('div');

    function renderHeader() {
      headerEl.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span style="font-weight:700">Past Due (> 6 mo)
            <span style="color:#c62828">●</span> (${pastDue.length})
          </span>
          <button id="pdToggleBtn"
            aria-expanded="${!collapsed}"
            title="${collapsed ? 'Expand' : 'Collapse'}"
            style="padding:2px 6px;border:1px solid #ccc;border-radius:3px;
                   cursor:default;background:#f8f8f8;display:flex;align-items:center">
            ${collapsed ? '▸' : '▾'}
          </button>
        </div>
      `;
    }
    function renderBody() {
      if (collapsed) {
        bodyEl.innerHTML = '';
        div.style.height = '48px';
        div.style.padding = '6px 10px';
        div.style.pointerEvents = 'auto';
        return;
      }
      bodyEl.innerHTML = `
        <div style="margin-top:6px;display:flex;align-items:center;justify-content:space-between">
          <input id="pdSearch" type="text" placeholder="Filter by code/material..."
            style="flex:1;padding:4px 6px;border:1px solid #ddd;border-radius:3px;margin-right:6px">
          <button id="pdExportBtn" title="Export XLSX"
            style="padding:4px 8px;border:1px solid #ccc;border-radius:3px;cursor:pointer;background:#f8f8f8">
            Export
          </button>
        </div>
        <ul id="pdList" style="list-style:none;padding:0;margin:8px 0 0 0;max-height:220px;overflow:auto"></ul>
      `;
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
          li.style.cursor = 'default';
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
              <button style="margin-left:8px;padding:2px 6px;border:1px solid #ccc;border-radius:3px;cursor:pointer">Ping</button>
              </div>
          `;
          li.addEventListener('click', () => { if (p.marker) { pingMarker(p.marker); } });
          li.querySelector('button').addEventListener('click', (e) => {
            e.stopPropagation();
            if (p.marker) { pingMarker(p.marker); }
          });
          ul.appendChild(li);
        });
      }
      renderList();
      searchInput.addEventListener('input', (e) => renderList(e.target.value));

/* ===================== XLSX EXPORT ===================== */
bodyEl.querySelector('#pdExportBtn').addEventListener('click', async () => {
  try {
    if (typeof JSZip === 'undefined') {
      alert('JSZip is required to export XLSX. Please include JSZip in the page.');
      return;
    }

    // Read Avg_Daily from averageconsumption.csv (column G)
    const { pileAvgByCode } = await fetchConsumptionCsv();

    // Timestamp for filename
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    // Header row
    const header = [
      'Pile Number', 'Name', 'Material', 'Last Zero Date', 'Age', 'Inventory (lbs)',
      'Average Consumed Daily', 'Days Until Depleted', 'Action'
    ];

    // Build dataRows (A..I only)
    const dataRows = pastDue.map(p => {
      const codeKey = p.code ? p.code.trim().toUpperCase() : '';
      const invLbs = (typeof p.invLbs === 'number') ? Math.max(0, p.invLbs) : 0;
      const pileAvgDaily = pileAvgByCode[codeKey] ?? 0;
      const dudPile = (pileAvgDaily > 0) ? (invLbs / pileAvgDaily) : 0;

      return [
        p.code ?? '—',
        p.name ?? '—',
        p.material ?? '—',
        p.lastZero ?? '—',
        p.ageLabel ?? '—',
        Number.isFinite(invLbs) ? invLbs : 0,
        (pileAvgDaily > 0 && isFinite(pileAvgDaily)) ? Math.round(pileAvgDaily) : 0,
        (pileAvgDaily > 0 && isFinite(dudPile)) ? Number(dudPile.toFixed(1)) : 0,
        '' // Action (I)
      ];
    });

    // ==== Auto column widths (Calibri 11 heuristic: pixels ≈ 7*chars + 5) ====
    function computeAutoColWidths(header, dataRows) {
      const cols = header.length; // 9 (A..I)
      const maxChars = Array(cols).fill(0);
      const measure = (val) => {
        if (val === null || val === undefined) return 0;
        const s = (typeof val === 'number') ? String(val) : String(val);
        return s.length;
      };
      for (let c = 0; c < cols; c++) maxChars[c] = Math.max(maxChars[c], measure(header[c]));
      for (const row of dataRows) {
        for (let c = 0; c < cols; c++) maxChars[c] = Math.max(maxChars[c], measure(row[c]));
      }
      const maxDigitWidth = 7; // px per "0" in Calibri 11
      const paddingPx = 5;
      const minWidthCh = 8.43; // don't go narrower than Excel default
      return maxChars.map(chars => {
        const pixels = chars * maxDigitWidth + paddingPx;
        const width = Math.trunc((pixels / maxDigitWidth) * 256) / 256;
        return Math.max(width, minWidthCh);
      });
    }
    const autoColWidths = computeAutoColWidths(header, dataRows);

    // ==== Build XLSX ====
    const zip = new JSZip();
    const xlNS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';

    // Simple XML escaper for inline string cells
    const xmlEsc = s => String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

    function colLetter(n) {
      let s = '';
      while (n > 0) {
        const m = (n - 1) % 26;
        s = String.fromCharCode(65 + m) + s;
        n = Math.floor((n - 1) / 26);
      }
      return s;
    }
    function cellRef(r, c) { return `${colLetter(c)}${r}`; }

    const rowCount = dataRows.length + 1;

    function buildCell(r, c, v, styleId = null) {
      const ref = cellRef(r, c);
      if (v === '' || v === null || v === undefined)
        return `<c r="${ref}"${styleId !== null ? ` s="${styleId}"` : ''}/>`;
      if (typeof v === 'number')
        return `<c r="${ref}"${styleId !== null ? ` s="${styleId}"` : ''}><v>${v}</v></c>`;
      return `<c r="${ref}" t="inlineStr"${styleId !== null ? ` s="${styleId}"` : ''}><is><t>${xmlEsc(v)}</t></is></c>`;
    }

    // Sheet rows (header style s=1, numeric right-align s=2 for F..H)
    let sheetData = `<row r="1">`;
    header.forEach((h, i) => { sheetData += buildCell(1, i + 1, h, 1); });
    sheetData += `</row>`;
    dataRows.forEach((row, idx) => {
      const r = idx + 2;
      sheetData += `<row r="${r}">`;
      row.forEach((v, j) => {
        const styleId = (j >= 5 && j <= 7) ? 2 : 0; // F(6),G(7),H(8) right-aligned
        sheetData += buildCell(r, j + 1, v, styleId);
      });
      sheetData += `</row>`;
    });

    // Dimension and <cols> (A..I only; no helper column)
    const firstRef = 'A1';
    const lastRef  = cellRef(rowCount, 9); // I
    let colsXml = '<cols>';
    autoColWidths.forEach((w, i) => {
      const idx = i + 1; // A=1..I=9
      colsXml += `<col min="${idx}" max="${idx}" width="${w.toFixed(2)}" bestFit="1" customWidth="1"/>`;
    });
    colsXml += '</cols>';

    // CF: color entire row A..I based on Action in I (no helper col)
    const dvRange = `I2:I${rowCount}`;
    const cfRange = `$A$2:$I$${rowCount}`;

    const sheet1Xml = `<?xml version="1.0" encoding="UTF-8"?>
<worksheet xmlns="${xlNS}">
  <sheetPr/>
  <dimension ref="${firstRef}:${lastRef}"/>
  <sheetViews><sheetView workbookViewId="0"/></sheetViews>
  <sheetFormatPr defaultRowHeight="15"/>
  ${colsXml}
  <sheetData>
${sheetData}
  </sheetData>

  <conditionalFormatting sqref="${cfRange}">
    <cfRule type="expression" priority="1" dxfId="0"><formula>$I2="Depleted"</formula></cfRule>
    <cfRule type="expression" priority="2" dxfId="1"><formula>$I2="Priority Target"</formula></cfRule>
    <cfRule type="expression" priority="3" dxfId="2"><formula>$I2="Stop Receiving"</formula></cfRule>
  </conditionalFormatting>

  <dataValidations count="1">
    <dataValidation type="list" allowBlank="1" sqref="${dvRange}">
      <formula1>"Depleted,Priority Target,Stop Receiving"</formula1>
    </dataValidation>
  </dataValidations>

  <pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>
</worksheet>`;

    // Package parts
    const contentTypesXml =
      `<?xml version="1.0" encoding="UTF-8"?>` +
      `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
      `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
      `<Default Extension="xml" ContentType="application/xml"/>` +
      `<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>` +
      `<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>` +
      `<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>` +
      `</Types>`;

    const rootRelsXml =
      `<?xml version="1.0" encoding="UTF-8"?>` +
      `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
      `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>` +
      `</Relationships>`;

    const workbookXml =
      `<?xml version="1.0" encoding="UTF-8"?>` +
      `<workbook xmlns="${xlNS}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">` +
      `<sheets><sheet name="PastDue" sheetId="1" r:id="rId1"/></sheets>` +
      `<calcPr calcMode="auto" fullCalcOnLoad="1"/>` +
      `</workbook>`;

    const wbRelsXml =
      `<?xml version="1.0" encoding="UTF-8"?>` +
      `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
      `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>` +
      `<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>` +
      `</Relationships>`;

    // styles.xml — keep your header (fontId=1), numeric right align (s=2),
    // and add 3 DXFs with BOTH fgColor + bgColor so fills render on Desktop.
    const stylesXml = `<?xml version="1.0" encoding="UTF-8"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2">
    <font><sz val="11"/><name val="Calibri"/></font>
    <font><b/><sz val="11"/><name val="Calibri"/></font>
  </fonts>
  <fills count="2">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
  </fills>
  <borders count="1">
    <border><left/><right/><top/><bottom/><diagonal/></border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="3">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0"/> <!-- header bold -->
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment horizontal="right"/></xf>
  </cellXfs>
  <cellStyles count="1">
    <cellStyle name="Normal" xfId="0" builtinId="0"/>
  </cellStyles>
  <dxfs count="3">
    <!-- 0: Depleted (light gray) -->
    <dxf>
      <font><color rgb="FF000000"/></font>
      <fill><patternFill patternType="solid">
        <fgColor rgb="FFDDDDDD"/><bgColor rgb="FFDDDDDD"/>
      </patternFill></fill>
    </dxf>
    <!-- 1: Priority Target (light yellow) -->
    <dxf>
      <font><color rgb="FF000000"/></font>
      <fill><patternFill patternType="solid">
        <fgColor rgb="FFFFEB9C"/><bgColor rgb="FFFFEB9C"/>
      </patternFill></fill>
    </dxf>
    <!-- 2: Stop Receiving (light red) -->
    <dxf>
      <font><color rgb="FF000000"/></font>
      <fill><patternFill patternType="solid">
        <fgColor rgb="FFFFC7CE"/><bgColor rgb="FFFFC7CE"/>
      </patternFill></fill>
    </dxf>
  </dxfs>
</styleSheet>`;

    // Add parts to zip
    zip.file('[Content_Types].xml', contentTypesXml);
    zip.folder('_rels').file('.rels', rootRelsXml);
    const xl = zip.folder('xl');
    xl.file('workbook.xml', workbookXml);
    xl.folder('_rels').file('workbook.xml.rels', wbRelsXml);
    xl.folder('worksheets').file('sheet1.xml', sheet1Xml);
    xl.file('styles.xml', stylesXml);

    // Generate & download
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PastDue_${yyyy}-${mm}-${dd}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('XLSX export failed:', err);
    alert('Export failed: ' + err.message);
  }
});
/* =================== END XLSX EXPORT (auto-width + fixed DXFs + no helper) =================== */

    }

    renderHeader();
    renderBody();
    headerEl.addEventListener('click', (e) => {
      const btn = headerEl.querySelector('#pdToggleBtn');
      if (btn && e.target === btn) { /* keep default */ }
      collapsed = !collapsed;
      renderHeader();
      renderBody();
    });

    div.appendChild(headerEl);
    div.appendChild(bodyEl);
    setTimeout(() => {
        document.getElementById('bottomPanelContainer').appendChild(div);
    }, 0);
    return div;
  };
  pastDueCtrl.addTo(map);

  /* ===================================================================
   Search Panel
  =================================================================== */
  const searchCtrl = L.control({ position: 'bottomleft' });
  searchCtrl.onAdd = function () {
    const div = L.DomUtil.create('div');
    L.DomEvent.disableScrollPropagation(div);
    L.DomEvent.disableClickPropagation(div);
    div.id = 'searchPanel';
    Object.assign(div.style, {
      background: 'rgba(255,255,255,0.95)',
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '6px 10px',
      margin: '8px',
      font: '12px/1.3 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
      width: '260px',
      maxHeight: '300px',
      overflow: 'hidden',
      transition: 'height 160ms ease, padding 160ms ease'
    });
    let collapsed = true;
    const headerEl = document.createElement('div');
    const bodyEl = document.createElement('div');

    function renderHeader() {
      headerEl.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span style="font-weight:700">Search Piles</span>
          <button id="srchToggleBtn"
            aria-expanded="${!collapsed}"
            title="${collapsed ? 'Expand' : 'Collapse'}"
            style="padding:2px 6px;border:1px solid #ccc;border-radius:3px;cursor:default;background:#f8f8f8">
            ${collapsed ? '▸' : '▾'}
          </button>
        </div>
      `;
    }
    function renderBody() {
      if (collapsed) {
        bodyEl.innerHTML = '';
        div.style.height = '48px';
        div.style.padding = '6px 10px';
        div.style.pointerEvents = 'auto';
        return;
      }
      bodyEl.innerHTML = `
        <div style="margin-top:6px;display:flex;align-items:center;justify-content:space-between">
          <input id="pileSearch" type="text" placeholder="Filter by code/name/material..."
            style="flex:1;padding:4px 6px;border:1px solid #ddd;border-radius:3px">
        </div>
        <ul id="searchList" style="list-style:none;padding:0;margin:8px 0 0 0;max-height:220px;overflow:auto"></ul>
      `;
      div.style.height = '300px';
      div.style.padding = '6px 10px';

      const ul = bodyEl.querySelector('#searchList');
      const searchInput = bodyEl.querySelector('#pileSearch');

      const allPiles = markers.map(m => {
        const code = extractPileCode(m.name);
        const s = code ? stockIndex[code] : null;
        const typeLabel = (markerConfig[m.type] && markerConfig[m.type].displayName) ? markerConfig[m.type].displayName : (m.type || '');
        return {
          code,
          name: m.name,
          type: typeLabel,
          material: (s && s.material) ? s.material : '',
          marker: m._leaflet
        };
      });

      function renderList(filterText = '') {
        ul.innerHTML = '';
        const term = filterText.trim().toLowerCase();
        const items = allPiles.filter(p => {
          if (!term) return true;
          return (
            (p.code && p.code.toLowerCase().includes(term)) ||
            (p.name && p.name.toLowerCase().includes(term)) ||
            (p.material && p.material.toLowerCase().includes(term)) ||
            (p.type && p.type.toLowerCase().includes(term))
          );
        }).sort((a,b) => {
          const ac = a.code || ''; const bc = b.code || '';
          if (ac !== bc) return ac.localeCompare(bc);
          return a.name.localeCompare(b.name);
        });

        items.forEach(p => {
          const li = document.createElement('li');
          li.style.padding = '6px 0';
          li.style.borderBottom = '1px dashed #eee';
          li.style.cursor = 'default';
          const sub = p.material ? `${p.type} — ${p.material}` : p.type;
          li.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center">
              <div>
                <div style="font-weight:600">${p.code || '—'} — ${sub}</div>
                <div style="color:#555">${p.name}</div>
              </div>
              <button style="margin-left:8px;padding:2px 6px;border:1px solid #ccc;border-radius:3px;cursor:pointer">Ping</button>
            </div>
          `;
          li.addEventListener('click', () => { if (p.marker) { pingMarker(p.marker); } });
          li.querySelector('button').addEventListener('click', (e) => {
            e.stopPropagation();
            if (p.marker) { pingMarker(p.marker); }
          });
          ul.appendChild(li);
        });
      }
      renderList();
      searchInput.addEventListener('input', (e) => renderList(e.target.value));
    }

    renderHeader();
    renderBody();
    headerEl.addEventListener('click', (e) => {
      const btn = headerEl.querySelector('#srchToggleBtn');
      if (btn && e.target === btn) { /* keep default */ }
      collapsed = !collapsed;
      renderHeader();
      renderBody();
    });

    div.appendChild(headerEl);
    div.appendChild(bodyEl);
    setTimeout(() => {
        document.getElementById('bottomPanelContainer').appendChild(div);
    }, 0);
    return div;
  };
  searchCtrl.addTo(map);

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
    Object.values(markerConfig).forEach(cfg => { if (map.hasLayer(cfg.layer)) map.removeLayer(cfg.layer); });
    Object.values(loadCells).forEach(lc => { if (map.hasLayer(lc)) map.removeLayer(lc); });
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
=================================================================== */
window.addEventListener("error", e => console.error("Error:", e.message));
``
