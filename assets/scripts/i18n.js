/**
 * i18n.js
 *
 * Responsibility: Locale management.
 *
 * - Detects initial language: localStorage > navigator > 'pt' fallback.
 * - Wires the language-toggle buttons (.lang-toggle button[data-lang]).
 * - Applies translations to every [data-i18n] element in the DOM.
 * - Notifies subscribers when the language changes (used by projects.js
 *   to re-render loading / error messages).
 *
 * Depends on: translations.js
 */

import { translations } from './translations.js';

const STORAGE_KEY = 'lang';
const DEFAULT_LANG = 'pt';
const SUPPORTED = ['pt', 'en'];

/** Active language, kept in module scope. Read via getCurrentLang(). */
let currentLang = DEFAULT_LANG;

/** Listeners notified after every setLang() call. */
const subscribers = new Set();

/**
 * Resolve the initial language to use on page load.
 * Order: stored choice → browser preference → default.
 */
function detectInitialLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;
  } catch (_) { /* private mode etc. — fall through */ }

  const navLang = (navigator.language || '').toLowerCase();
  if (navLang.startsWith('pt')) return 'pt';
  if (navLang.startsWith('en')) return 'en';

  return DEFAULT_LANG;
}

/**
 * Apply a language: update <html lang>, swap all [data-i18n] copy,
 * update toggle button states, persist choice, notify subscribers.
 */
export function setLang(lang) {
  if (!SUPPORTED.includes(lang)) return;
  currentLang = lang;

  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

  const dict = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined) {
      el.innerHTML = dict[key];
    }
  });

  document.querySelectorAll('.lang-toggle button[data-lang]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
    btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
  });

  try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) { /* ignore */ }

  subscribers.forEach((fn) => {
    try { fn(lang); } catch (err) { console.error('[i18n] subscriber failed', err); }
  });
}

/** Read-only accessor for the active language. */
export function getCurrentLang() {
  return currentLang;
}

/**
 * Subscribe to language changes. Returns an unsubscribe function.
 * @param {(lang: string) => void} fn
 */
export function onLangChange(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

/** Wire up the UI and apply the initial language. Idempotent. */
export function initI18n() {
  document.querySelectorAll('.lang-toggle button[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
  setLang(detectInitialLang());
}
