# Avi Sharma — ePortfolio

Data-explorer / sci-fi adventure-themed portfolio. Vanilla HTML/CSS/JS + GSAP, designed to deploy on Vercel with a serverless Claude API endpoint for the chatbot.

## Local preview

Just open `index.html` in a browser. For the chatbot to work locally later, run a static server:

```bash
# from the eportfolio folder
npx serve .
# or
python -m http.server 8000
```

## Structure

- `index.html` — Dossier (home + about merged)
- `experience.html` — Expeditions (work history as quest map)
- `projects.html` — Archive (project deep-dives)
- `connect.html` — Signal (contact)
- `css/tokens.css` — design tokens (colors, fonts, spacing)
- `css/main.css` — shared styles
- `js/main.js` — shared behavior
- `api/chat.js` — Vercel serverless function for chatbot (added in Phase 9)

## Deploy

Deployed on Vercel from `main` branch. Custom domain optional.

## Theme

Data Explorer / Cosmic Cartographer. Dark deep-space palette + warm signal-orange accent + cyan data-glow secondary. Cream panels for "discovery" sections.
