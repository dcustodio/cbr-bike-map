# Simple Bike Map

This repository contains a minimal static web page that displays a map with markers loaded from a JSON file.

Files:

- `index.html`: The main page. Uses Leaflet to show a map and fetch `markers.json`.
- `markers.json`: Sample list of markers (objects with `lat`, `lon`, `name`, `description`).

Preview locally

Open a static server from the folder and browse to `http://localhost:8000`.

Windows PowerShell examples:

```powershell
# Using Python 3's http.server
cd D:\code\cbr-bike-map
python -m http.server 8000

# Or using Node's http-server (if installed)
npx http-server -p 8000
```
