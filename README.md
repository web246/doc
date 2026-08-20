# Carbon Doctor — Static HTML rebuild

This workspace contains a pixel-accurate static HTML/CSS/JS rebuild of the Carbon Doctor site as specified.

Files:
- `index.html` — single-file SPA shell and templates
- `styles.css` — full site CSS (component layer + responsive)
- `script.js` — router and interactive behaviors (slider, mega, booking, gallery, contact)

To preview locally, run a static file server in the project folder, for example with Python 3:
```bash
cd "c:\Users\brian\Desktop\websites\carbon doc"
python -m http.server 8000
```
Then open http://localhost:8000 in your browser.

Notes:
- Links use pushState routing; serve over HTTP (not file://) for history routing to work.
- The booking page is a demo flow and does not perform real submissions.
