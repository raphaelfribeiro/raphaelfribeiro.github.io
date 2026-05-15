/**
 * main.js
 *
 * Responsibility: Application entry point.
 *
 * Pulls together every module and decides when each runs.
 * No business logic of its own — only orchestration.
 */

import { initI18n } from './i18n.js';
import { initScene } from './scene.js';
import { initProjects } from './projects.js';

/** Set the footer copyright year. Trivial but lives here for cohesion. */
function setFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/**
 * ES modules are deferred by default, so the DOM is already parsed
 * when this code runs — but we still guard with DOMContentLoaded for
 * environments where the script might be injected differently.
 */
function bootstrap() {
  initI18n();        // must run first: translations populate the DOM
  initScene();       // adds stars/dust to the dev SVG
  initProjects();    // async — fires off the GitHub fetch
  setFooterYear();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  bootstrap();
}
