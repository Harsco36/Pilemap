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
    "Other": { icon: iconOther, displayName: "Other" }
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

        // Hide all material layers
        Object.values(markerConfig).forEach(cfg => {
            if (map.hasLayer(cfg.layer)) map.removeLayer(cfg.layer);
        });

        map.addLayer(loadCells[id]);
        map.setView(loadCellMarkers[id].getLatLng(), 20);
    });
});

/* ===================================================================
   LOAD MARKERS FROM JSON
=================================================================== */
fetch('markers.json')
    .then(res => res.json())
    .then(data => {
        const unknown = new Set();

        data.forEach(marker => {
            const cfg = markerConfig[marker.type];
            if (!cfg) { unknown.add(marker.type); return; }

            const m = L.marker([marker.lat, marker.lng], { icon: cfg.icon })
                       .bindPopup(marker.name);

            cfg.layer.addLayer(m);

            if (marker.cell) {
                if (Array.isArray(marker.cell)) {
                    marker.cell.forEach(c => {
                        if (loadCells[c]) loadCells[c].addLayer(m);
                    });
                } else {
                    if (loadCells[marker.cell]) loadCells[marker.cell].addLayer(m);
                }
            }
        });

        if (unknown.size)
            console.warn("Unknown types:", Array.from(unknown));
    });

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
        iconSize: [96, 96],
    });
    const tempMarker = L.marker([lat, lng], { icon: emojiIcon }).addTo(map);
    setTimeout(() => {
        map.removeLayer(tempMarker);
    }, 1500);

    contextMenu.style.display = 'none';
});

/* ===================================================================
   GLOBAL ERROR LOGGING
=================================================================== */
window.addEventListener("error", e => console.error("Error:", e.message));
window.addEventListener("unhandledrejection", e => console.error("Promise Error:", e.reason));
