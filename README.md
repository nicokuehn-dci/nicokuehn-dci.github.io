# nicokuehn-dci.github.io — Minimal static resume

This repository now contains a single, self-contained static `index.html` at the repository root. It's intentionally minimal so GitHub Pages can serve the portfolio site directly from the repository root (no build step required).

What you need (minimal)

- A public GitHub repository named exactly `nicokuehn-dci.github.io`.
- A single `index.html` file at the repository root (this file).
- Optionally a `README.md` (this file) and a `.gitignore`.

How to publish (quick)

1. Push your files to `main`.
2. On GitHub, open the repository Settings → Pages.
3. Under "Build and deployment" choose: Branch: `main` and Folder: `/ (root)`.
4. Save and wait a minute—your site will be available at:

   https://nicokuehn-dci.github.io/

Notes

- This repo contains a single static HTML resume; no Node.js, no build steps needed to serve the page.
- If you want to work on a richer React/Vite source in the future, keep it in a `src/` folder and generate a build for production, but for a simple portfolio a single `index.html` is enough.
- If you prefer automated builds that update the published files, I can add a GitHub Actions workflow that builds and pushes the `dist/` output to `/docs` or to a `gh-pages` branch.

If you'd like, I can also:
- Add a small sitemap or meta tags for SEO.
- Add a badge showing GitHub Pages deployment status.
- Move source files into `src/` to keep the repo root minimal.

Tell me which of these you'd like and I'll implement it.
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/13v6kXOLfzSI13Y6ML07R5OsUnCdBJNN8

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
