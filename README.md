# Kunal Dewalwar — Executive Portfolio Website

A single-page, long-scroll static site. HTML5 / CSS3 / vanilla JavaScript. No build step, no framework, no dependencies beyond two Google Fonts loaded via CDN.

## File structure

```
portfolio-site/
├── index.html              The entire site — one long-scroll page with anchor sections
├── style.css                 Design system + all components
├── script.js                  Nav tracking, smooth scroll, parallax, count-up, contact form
├── assets/
│   ├── images/
│   │   └── headshot.jpg
│   └── documents/
│       └── resume.pdf
├── about.html                 Redirect stub → index.html#about  (kept so old shared links still work)
├── experience.html            Redirect stub → index.html#experience
├── portfolio.html             Redirect stub → index.html#portfolio
├── case-studies.html          Redirect stub → index.html#case-studies
├── leadership.html            Redirect stub → index.html#leadership
├── skills.html                Redirect stub → index.html#skills
├── contact.html                Redirect stub → index.html#contact
├── sitemap.xml
├── robots.txt
└── .nojekyll
```

Everything the site needs is in this folder. There is nothing missing and nothing to generate — it's ready to upload as-is.

## Deploying to GitHub Pages

**You do not need to delete your existing repository.** Just replace its contents with this folder's contents — the goal is for your repo to end up containing exactly these files, nothing more, nothing left over from before.

### Recommended: replace everything cleanly
1. On your computer, delete everything inside your local copy of the repo (or start from a fresh clone).
2. Copy every file and folder from this `portfolio-site` folder into the repo root — keep the folder structure exactly as-is (`assets/images/`, `assets/documents/`, and the hidden `.nojekyll` file all need to come across).
3. Commit and push to `main`.

### If uploading via the GitHub web interface
1. Go to your repo → click into each old file (`index.html`, `style.css`, `script.js`, `about.html`, etc.) and delete it, **or** delete the whole repo and recreate it empty — either is fine.
2. Click **Add file → Upload files**.
3. Drag the **entire `portfolio-site` folder** (not individual files one at a time) onto the upload area — this is what preserves the `assets/` subfolder structure. Selecting loose files individually is what caused the broken image/résumé links last time.
4. Commit directly to `main`.
5. Wait 1–2 minutes, then hard-refresh the live site (Ctrl+Shift+R / Cmd+Shift+R) to bypass the browser cache.

### Why replace rather than merge
The site changed from multiple HTML pages to one single-page site. If you only add the new files without removing the old ones, you won't get errors — the old `about.html` etc. now correctly redirect to the new single page — but you'll be carrying dead weight in the repo. Cleaner to just replace everything.

## Before you go live — checklist

- [ ] **Contact form:** still points to a placeholder Formspree URL (`https://formspree.io/f/YOUR_FORM_ID` in `index.html`, inside the `<form id="contact-form">` element). Create a free account at [formspree.io](https://formspree.io), create a form, and replace `YOUR_FORM_ID` with your real form ID. Until this is done, submitting the form will show a clear on-page message rather than silently failing — but it still won't deliver messages until this is set.
- [ ] **Domain in meta tags:** `sitemap.xml` and the Open Graph tags in `index.html`'s `<head>` reference `your-domain.example` as a placeholder — update once you have a final GitHub Pages URL or custom domain.
- [ ] **Google Search Console:** once live, submit `sitemap.xml` to help the site get indexed.

## Making future edits

Everything lives in `index.html` now — each section has an `id` (e.g. `id="experience"`, `id="case-studies"`) so you can find and edit any part directly. `style.css` is shared design tokens and components; a change there applies across the whole page. Nav links in the header are just anchor links (`href="#about"`) pointing at those same section IDs — if you rename a section's `id`, update the matching nav link too.

## Browser support

Built with standard, well-supported CSS (Grid, custom properties, `clamp()`) and JS (`IntersectionObserver`, `fetch`, `FormData`). Works in all current versions of Chrome, Firefox, Safari, and Edge. `prefers-reduced-motion` is respected throughout — parallax, count-ups, and reveal animations all disable gracefully for users who request reduced motion.
