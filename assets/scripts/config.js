/**
 * config.js
 *
 * Responsibility: Centralized configuration.
 * Everything that might change without touching application logic lives here.
 *
 * No imports, no side effects — just a frozen data object.
 */

export const config = Object.freeze({
  /** GitHub username used to fetch repos via the public API. */
  githubUsername: 'raphaelfribeiro',

  /**
   * Projects pinned to the top of the list, always shown first
   * regardless of stars / recency. Rendered immediately (no API wait).
   * The API call later enriches stars / description if available.
   */
  pinnedProjects: Object.freeze([
    Object.freeze({
      name: 'desafio-tecnico',
      url: 'https://github.com/raphaelfribeiro/desafio-tecnico',
      /** Fallback description shown before / if API enrichment fails. */
      descriptionFallback: {
        pt: 'Desafio técnico de backend: API REST em .NET seguindo Clean Architecture, com testes, Docker e CI.',
        en: 'Backend technical challenge: .NET REST API following Clean Architecture, with tests, Docker and CI.',
      },
      /** Fallback language tag. Overwritten by API response when available. */
      languageFallback: 'C#',
      featured: true,
    }),
  ]),

  /** How many non-pinned repos to render after the pinned list. */
  otherProjectsLimit: 5,
});
