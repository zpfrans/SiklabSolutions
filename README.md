# Code Flux Studios — Landing Page

Files created in this folder:

- `index.html` — Bootstrap-based landing page
- `css/styles.css` — custom styles to match the logo theme and add the 3D hero card
- `assets/` — expected folder for your images (not included)

How to use

1. In this folder create an `assets` directory.
2. Place your logo at `assets/logo.png` (optional) and/or use the provided `assets/logo.svg` (recommended) and your hero/cover image at `assets/cover.jpg`.
3. Open `index.html` in a browser or serve it locally.

Preview locally (PowerShell on Windows):

```powershell
# from this folder (where index.html lives)
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

Notes

- If your images have different names, update the `src` paths in `index.html`.
- The layout uses Bootstrap 5 CDN plus a small custom stylesheet in `css/styles.css`.
- The hero card uses a layered card + subtle transform for a 3D effect inspired by the referenced repo.

Next steps I can help with:

- Add smooth entrance animations or parallax on scroll
- Wire a contact form (Formspree/Netlify/SMTP)
- Convert to a React/Next.js template or create a deployable GitHub Pages branch
