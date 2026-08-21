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

GitHub Pages-compatible admin panel (no server)

- A static admin panel is available at `panel-gh.html`. It commits changes directly to the GitHub repository using the GitHub REST API and a Personal Access Token (PAT). This allows editing `data/content.json`, uploading images to `assets/`, adding results and banners — all without a server.

Usage summary for `panel-gh.html`:

1. Create a PAT with `repo` scope in your GitHub account (keep it secret).
2. Open `panel-gh.html` on your GitHub Pages site or locally using a static server.
3. Enter repo owner, repo name, branch, and your PAT. The panel will then be able to create/update files (`data/content.json`) and upload images to `assets/` by committing directly to the repository.

Security notes:

- A PAT grants access to your repository. Do not paste a PAT into untrusted machines or public pages. For safer production workflows, create a GitHub App or a server-side proxy that stores tokens securely.
- The static panel stores the connection info in `localStorage` for convenience; clear it after use.
