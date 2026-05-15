/**
 * translations.js
 *
 * Responsibility: PT/EN translation dictionaries.
 * Pure data — no logic, no DOM, no side effects.
 *
 * Keys are referenced via `data-i18n="<key>"` attributes in markup.
 * Values may contain inline HTML (rendered via innerHTML); keep them trusted.
 */

export const translations = Object.freeze({
  pt: Object.freeze({
    // Nav
    nav_stack: 'stack',
    nav_projects: 'projetos',
    nav_contact: 'contato',

    // Dev
    dev_tag: 'engenheiro backend · .NET / C# / AWS',
    scroll_hint: '[ rolar ↓ ]',

    // About
    about_title_em: 'sobre',
    about_p1: '<strong>Engenheiro backend sênior</strong> com foco em C# e .NET (Core / 6+), construindo sistemas em larga escala, APIs REST e arquiteturas distribuídas. Aplico SOLID, Clean Architecture e Design Patterns para que o código continue saudável depois que eu sair da sala.',
    about_p2: 'Trabalho com SQL Server, PostgreSQL, MongoDB, Docker, CI/CD e nuvem (AWS e Azure). Inglês fluente.',
    about_p3: 'Baseado em São José do Rio Preto, SP. Disponível para oportunidades remotas como <strong>.NET Backend Developer</strong>.',
    hl_1: 'documentos/mês com MongoDB',
    hl_2: 'CPU/memória após refatoração',
    hl_3: 'anos construindo software',

    // Stack
    stack_title_em: 'stack',
    stack_g1: 'LINGUAGENS & FRAMEWORKS',
    stack_g2: 'ARQUITETURA & PADRÕES',
    stack_g3: 'BANCOS DE DADOS',
    stack_g4: 'CLOUD & DEVOPS',
    stack_g5: 'QUALIDADE & TOOLING',

    // Projects
    projects_title_em: 'projetos',
    projects_loading: 'carregando do github',
    projects_empty: 'nenhum projeto público encontrado.',
    projects_error: 'github offline. <a href="https://github.com/raphaelfribeiro" target="_blank" rel="noopener" style="color:var(--accent)">ver perfil →</a>',
    project_featured: 'DESTAQUE',
    view_all: '→ ver todos no github',

    // Contact
    contact_title_em: 'contato',
    contact_pitch: 'Procurando alguém pra <em>construir backend que aguente o tranco</em>? Vamos conversar.',

    // Footer
    footer_made: 'feito com pixels e café',
    footer_status: 'disponível para projetos',
  }),

  en: Object.freeze({
    // Nav
    nav_stack: 'stack',
    nav_projects: 'projects',
    nav_contact: 'contact',

    // Dev
    dev_tag: 'backend engineer · .NET / C# / AWS',
    scroll_hint: '[ scroll ↓ ]',

    // About
    about_title_em: 'about',
    about_p1: '<strong>Senior backend engineer</strong> focused on C# and .NET (Core / 6+), building large-scale systems, REST APIs and distributed architectures. I apply SOLID, Clean Architecture and Design Patterns so the codebase stays healthy long after I leave the room.',
    about_p2: 'I work with SQL Server, PostgreSQL, MongoDB, Docker, CI/CD and cloud (AWS and Azure). Fluent English.',
    about_p3: 'Based in São José do Rio Preto, Brazil. Open to remote opportunities as a <strong>.NET Backend Developer</strong>.',
    hl_1: 'documents/month with MongoDB',
    hl_2: 'CPU/memory after refactor',
    hl_3: 'years building software',

    // Stack
    stack_title_em: 'stack',
    stack_g1: 'LANGUAGES & FRAMEWORKS',
    stack_g2: 'ARCHITECTURE & PATTERNS',
    stack_g3: 'DATABASES',
    stack_g4: 'CLOUD & DEVOPS',
    stack_g5: 'QUALITY & TOOLING',

    // Projects
    projects_title_em: 'projects',
    projects_loading: 'loading from github',
    projects_empty: 'no public projects found.',
    projects_error: 'github offline. <a href="https://github.com/raphaelfribeiro" target="_blank" rel="noopener" style="color:var(--accent)">view profile →</a>',
    project_featured: 'FEATURED',
    view_all: '→ see all on github',

    // Contact
    contact_title_em: 'contact',
    contact_pitch: 'Looking for someone to <em>build backend that holds up under load</em>? Let\'s talk.',

    // Footer
    footer_made: 'crafted with pixels and coffee',
    footer_status: 'available for projects',
  }),
});
