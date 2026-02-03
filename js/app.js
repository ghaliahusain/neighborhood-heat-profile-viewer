// =======================
// MAP SETUP
// =======================
const map = L.map('map').setView([29.35, 47.95], 10);

// Satellite basemap (greyscale via CSS)
L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { maxZoom: 19 }
).addTo(map);

// =======================
// LOAD GEOJSON
// =======================
let geoLayer;

fetch('data/neighborhoods.geojson')
  .then(r => r.json())
  .then(data => {

    geoLayer = L.geoJSON(data, {
      style: () => ({
        className: 'neighborhood'
      }),
      onEachFeature: (feature, layer) => {
        layer.on('click', () => selectNeighborhood(feature, layer));
      }
    }).addTo(map);

    map.fitBounds(geoLayer.getBounds(), { padding: [20, 20] });
  });

// =======================
// CLICK HANDLER
// =======================
function selectNeighborhood(feature, layer) {

  // reset styles
  geoLayer.eachLayer(l => {
    l.setStyle({ className: 'neighborhood' });
  });

  // highlight selected
  layer.setStyle({ className: 'neighborhood selected' });

  // update info panel
  document.getElementById('iName').textContent = feature.properties.Name;
  document.getElementById('iLCZ').textContent = feature.properties.LCZ;
  document.getElementById('iType').textContent = feature.properties.Type;

  document.getElementById('iDay').textContent =
    format(feature.properties.DayLST);

  document.getElementById('iNight').textContent =
    format(feature.properties.NightLST);

  document.getElementById('iAmp').textContent =
    format(feature.properties.AmplitudeLST);
}

// =======================
// HELPERS
// =======================
function format(val) {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return Number(val).toFixed(1);
}
