# raphaelfribeiro.github.io

Portfolio site for [Raphael Ribeiro](https://www.linkedin.com/in/raphaelfribeiro) —
senior backend engineer (.NET / C# / AWS). Static site, zero build step,
deployed via GitHub Pages.

> Live at **https://raphaelfribeiro.github.io/**

---

## Stack

Vanilla HTML, modular CSS, and **native ES modules**. No bundler, no
framework, no dependencies. The site ships as plain files the browser
can serve directly.

| Concern        | Tooling                                              |
| -------------- | ---------------------------------------------------- |
| Markup         | Semantic HTML5                                       |
| Styling        | Plain CSS organised in layers (tokens → animations)  |
| Behaviour      | ES2020 modules (`<script type="module">`)            |
| Data           | GitHub REST API v3 (public, unauthenticated)         |
| Hosting        | GitHub Pages                                         |
| Type           | Static — no server, no build, no CI required         |

---

## Project structure

```
.
├── index.html                          # Single entry document
├── README.md
├── .gitignore
└── assets/
    ├── styles/
    │   ├── tokens.css                  # Design tokens (CSS variables)
    │   ├── base.css                    # Reset + element defaults
    │   ├── layout.css                  # Sections, grids,dev, footer
    │   ├── components.css              # Nav, cards, badges, links
    │   └── animations.css              # @keyframes
    └── scripts/
        ├── config.js                   # GitHub username, pinned projects
        ├── translations.js             # PT/EN dictionaries
        ├── i18n.js                     # Language toggle + apply
        ├── scene.js                    # Dev SVG stars/dust generator
        ├── projects.js                 # GitHub API + pinned rendering
        └── main.js                     # Bootstrap (entry point)
```

### Why this layout

Each module has a single, named responsibility — the same separation
of concerns the backend domain expects of any service.

- **CSS layered top-down**: `tokens` (values) → `base` (resets) →
  `layout` (structure) → `components` (reusables) → `animations`
  (motion). Loaded in cascade order so later layers override earlier
  ones predictably.
- **JS by domain**: `i18n`, `scene`, `projects` are independent
  modules; `main.js` orchestrates. `config.js` and `translations.js`
  hold pure data, kept separate from the logic that consumes them.
- **No globals**: every module exports explicitly; `main.js` is the
  only place that wires them together.

---

## Running locally

ES modules require an HTTP origin (won't work via `file://`).
Pick whichever line you have on hand:

```bash
# Python 3
python3 -m http.server 8080

# Node (no install — uses npx)
npx serve .

# PHP
php -S localhost:8080
```

Then open `http://localhost:8080`.

---

## Deploying

GitHub Pages serves the root of the `main` (or `master`) branch.
There is no build step.

```bash
git add .
git commit -m "feat: portfolio update"
git push origin main
```

Pages publishes within a minute or two.

---

## Customisation cheatsheet

| Change…                          | Edit                                                |
| -------------------------------- | --------------------------------------------------- |
| Colors, fonts, spacing           | `assets/styles/tokens.css`                          |
| Pinned project / GitHub username | `assets/scripts/config.js`                          |
| Wording (PT / EN)                | `assets/scripts/translations.js`                    |
| Stack groups & items             | `index.html` — `#stack` section                     |
| About highlights                 | `index.html` — `#about` section                     |
| Animations (timing / curves)     | `assets/styles/animations.css`                      |
| Dev pixel art                    | `index.html` — `<svg class="scene">`                |

---

## Notes on the GitHub Pages API limit

The site calls the GitHub REST API unauthenticated, which is capped
at **60 requests/hour per IP**. The `desafio-tecnico` card is rendered
from local config first, so even if the API is rate-limited, the
featured project is always visible. The remaining 5 cards are
populated when the API responds; on failure, a graceful fallback link
to the GitHub profile replaces the loading row.

---

## License

Personal portfolio — code released as-is. Feel free to draw
inspiration; please don't copy the resume content.
