// Map + markers logic (extracted from index.html)
// Initialize map (centered on Coimbra, Portugal)
const map = L.map("map", { zoomControl: true }).setView([40.2033, -8.4103], 13);
// L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   maxZoom: 19,
//   attribution:
//     '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
// }).addTo(map);

const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
});

const cyclosm = L.tileLayer(
  "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
  {
    maxZoom: 20,
    attribution: "© OpenStreetMap contributors, CyclOSM",
  }
);

osm.addTo(map);
L.control.layers({ CyclOSM: cyclosm, OpenStreetMap: osm }).addTo(map);

// // Safe HTML escaping for popup content
function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c])
  );
}

const markerListEl = document.getElementById("marker-list");

// // Load markers from JSON and add to map and list
fetch("markers.json")
  .then((r) => {
    if (!r.ok) throw new Error("Could not load markers.json: " + r.status);
    return r.json();
  })
  .then((data) => {
    if (!Array.isArray(data)) throw new Error("markers.json must be an array");

    const layerGroup = L.featureGroup();

    data.forEach((item) => {
      const lat = Number(item.lat);
      const lon = Number(item.lon);
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        const name = item.name || "(untitled)";
        const description = item.description || "";

        const marker = L.marker([lat, lon]);
        marker.bindPopup(
          "<strong>" +
            escapeHtml(name) +
            "</strong><br>" +
            escapeHtml(description)
        );
        marker.addTo(layerGroup);

        // add list item
        const card = document.createElement("div");
        card.className =
          "p-3 bg-white rounded shadow-sm hover:shadow-md transition cursor-pointer";
        card.innerHTML = `
          <div class="flex justify-between items-start">
            <div>
              <div class="font-semibold text-slate-900">${escapeHtml(
                name
              )}</div>
              <div class="text-sm text-slate-600 mt-1">${escapeHtml(
                description
              )}</div>
            </div>
            <div class="text-xs text-slate-500 ml-4">${lat.toFixed(
              5
            )}, ${lon.toFixed(5)}</div>
          </div>
        `;

        card.addEventListener("click", () => {
          map.setView([lat, lon], 15, { animate: true });
          marker.openPopup();
        });

        if (markerListEl) markerListEl.appendChild(card);
      } else {
        console.warn("Skipping marker with invalid coords", item);
      }
    });

    if (layerGroup.getLayers().length) {
      layerGroup.addTo(map);
      map.fitBounds(layerGroup.getBounds().pad(0.2));
    }
  })
  .catch((err) => {
    console.error(err);
    if (markerListEl)
      markerListEl.innerHTML = `<div class="text-sm text-red-600">Failed to load markers: ${escapeHtml(
        err.message
      )}</div>`;
  });
