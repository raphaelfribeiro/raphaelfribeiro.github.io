/**
 * projects.js
 *
 * Responsibility: Render the "Projects" section.
 *
 * Strategy:
 *   1. Immediately paint the pinned card(s) from config (no API wait).
 *   2. In parallel, request:
 *        - the full repos list,
 *        - the latest metadata of each pinned repo (to refresh
 *          stars / description),
 *      and merge results.
 *   3. Filter out forks, archived, and any repo already pinned.
 *   4. Sort by stars then by recent push date.
 *   5. Render up to `config.otherProjectsLimit` extra cards.
 *
 * On API error: keep pinned cards visible and replace the loading-row
 * with a friendly fallback link to the GitHub profile.
 *
 * Depends on: config.js, translations.js, i18n.js
 */

import { config } from './config.js';
import { translations } from './translations.js';
import { getCurrentLang, onLangChange } from './i18n.js';

/** GitHub language → swatch color (subset of github-linguist). */
const LANG_COLORS = {
  'C#': '#178600',
  'JavaScript': '#f1e05a',
  'TypeScript': '#3178c6',
  'Python': '#3572A5',
  'Dart': '#00B4AB',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'Java': '#b07219',
  'Go': '#00ADD8',
  'Rust': '#dea584',
  'Shell': '#89e051',
  'PHP': '#4F5D95',
  'Ruby': '#701516',
  'Swift': '#F05138',
  'Kotlin': '#A97BFF',
  'C++': '#f34b7d',
  'C': '#555555',
  'Vue': '#41b883',
  'Jupyter Notebook': '#DA5B0B',
};

/** Module-level cache so language toggles re-render without re-fetching. */
let lastRenderedProjects = null;

/**
 * Minimal HTML escape — only used on user-controlled fields
 * (repo name, description, language) before insertion via innerHTML.
 */
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));
}

/** Convert a normalized project object into the card markup. */
function projectCardHtml(project, lang) {
  const langName = project.language;
  const color = (langName && LANG_COLORS[langName]) || '#7a8aa0';
  const desc = project.description
    ? escapeHtml(project.description)
    : '<span style="opacity:0.5">—</span>';
  const stars = project.stargazers_count || 0;
  const featuredLabel = translations[lang].project_featured;

  return `
    <a class="project ${project.featured ? 'project--featured' : ''}"
       href="${escapeHtml(project.html_url)}"
       target="_blank" rel="noopener">
      ${project.featured
        ? `<span class="project-badge">★ ${escapeHtml(featuredLabel)}</span>`
        : ''}
      <div class="project-name">${escapeHtml(project.name)}</div>
      <div class="project-desc">${desc}</div>
      <div class="project-meta">
        ${langName
          ? `<span class="project-lang"><span class="lang-dot" style="background:${color}"></span>${escapeHtml(langName)}</span>`
          : ''}
        ${stars > 0 ? `<span>★ ${stars}</span>` : ''}
      </div>
    </a>
  `;
}

/** Build a "synthetic" project object from a config.pinnedProjects entry. */
function pinnedToProject(pinned, lang) {
  return {
    name: pinned.name,
    html_url: pinned.url,
    description: pinned.descriptionFallback[lang],
    language: pinned.languageFallback,
    stargazers_count: 0,
    featured: true,
  };
}

/** Replace a pinned placeholder with fresh API data, preserving `featured`. */
function mergePinnedWithApi(pinnedProjectObject, apiRepo) {
  if (!apiRepo) return pinnedProjectObject;
  return {
    ...pinnedProjectObject,
    description: apiRepo.description || pinnedProjectObject.description,
    language: apiRepo.language || pinnedProjectObject.language,
    stargazers_count: apiRepo.stargazers_count || 0,
    html_url: apiRepo.html_url || pinnedProjectObject.html_url,
  };
}

/** Render the given normalized list into the projects grid. */
function renderGrid(projects) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  lastRenderedProjects = projects;
  const lang = getCurrentLang();

  if (projects.length === 0) {
    grid.innerHTML = `<div class="projects-loading projects-loading--static">${translations[lang].projects_empty}</div>`;
    return;
  }

  grid.innerHTML = projects.map((p) => projectCardHtml(p, lang)).join('');
}

/** Render only the pinned skeleton — used as an immediate paint pre-API. */
function renderPinnedSkeleton(lang) {
  const pinnedAsProjects = config.pinnedProjects.map((p) => pinnedToProject(p, lang));
  const loadingPlaceholder = `<div class="projects-loading">${translations[lang].projects_loading}</div>`;
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML =
    pinnedAsProjects.map((p) => projectCardHtml(p, lang)).join('') +
    loadingPlaceholder;
}

/** Fetch all public repos for the configured user. Throws on non-OK. */
async function fetchUserRepos() {
  const url = `https://api.github.com/users/${config.githubUsername}/repos?sort=updated&per_page=100`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GitHub /users API responded ${res.status}`);
  return res.json();
}

/** Fetch one repo's metadata. Returns null on any failure (best-effort). */
async function fetchSingleRepo(name) {
  try {
    const url = `https://api.github.com/repos/${config.githubUsername}/${name}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
  } catch (_) {
    return null;
  }
}

/** Public entry point. Loads, sorts, renders. */
export async function initProjects() {
  const lang = getCurrentLang();

  // 1. Paint pinned cards immediately so the UI never blocks on the network.
  renderPinnedSkeleton(lang);

  // 2. Fire requests in parallel: full repo list + each pinned repo's metadata.
  const pinnedNames = config.pinnedProjects.map((p) => p.name);
  const pinnedFetches = pinnedNames.map(fetchSingleRepo);

  let allRepos = null;
  let pinnedFreshList = [];
  try {
    const [repos, ...pinnedFresh] = await Promise.all([
      fetchUserRepos(),
      ...pinnedFetches,
    ]);
    allRepos = repos;
    pinnedFreshList = pinnedFresh;
  } catch (err) {
    console.warn('[projects] API unavailable, showing pinned only.', err);
    const grid = document.getElementById('projects-grid');
    const pinnedAsProjects = config.pinnedProjects.map((p) => pinnedToProject(p, lang));
    if (grid) {
      grid.innerHTML =
        pinnedAsProjects.map((p) => projectCardHtml(p, lang)).join('') +
        `<div class="projects-loading projects-loading--static">${translations[lang].projects_error}</div>`;
    }
    lastRenderedProjects = pinnedAsProjects;
    return;
  }

  // 3. Build the final pinned list (config + fresh API metadata).
  const pinnedProjects = config.pinnedProjects.map((p, i) =>
    mergePinnedWithApi(pinnedToProject(p, lang), pinnedFreshList[i])
  );

  // 4. Build the "others" list.
  const pinnedNameSet = new Set(pinnedNames);
  const others = (allRepos || [])
    .filter((r) => !r.fork && !r.archived && !r.private && !pinnedNameSet.has(r.name))
    .sort((a, b) => {
      const byStars = (b.stargazers_count || 0) - (a.stargazers_count || 0);
      if (byStars !== 0) return byStars;
      return new Date(b.pushed_at) - new Date(a.pushed_at);
    })
    .slice(0, config.otherProjectsLimit)
    .map((r) => ({ ...r, featured: false }));

  // 5. Render the merged list.
  renderGrid([...pinnedProjects, ...others]);
}

/** Re-render in the new language without re-fetching (uses cached list). */
function rerenderOnLangChange() {
  if (lastRenderedProjects) {
    renderGrid(lastRenderedProjects);
  }
}

// Auto-subscribe: keep card copy in sync with the active language.
onLangChange(rerenderOnLangChange);
