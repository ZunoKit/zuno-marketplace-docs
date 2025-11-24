# Zuno Marketplace Documentation Implementation Plan

**Date:** 2024-11-24
**Status:** Draft
**Priority:** High

## Overview

Comprehensive implementation plan for building unified documentation site for Zuno Marketplace ecosystem (SDK, Metadata, Indexer, ABIs). Built on Docus i18n starter with changelog system powered by GitHub releases and LLM-optimized markdown export features.

**Base:** E:\zuno-marketplace-docs (Docus i18n starter with Nuxt 4, NuxtUI v4, TailwindCSS v4)

## Tech Stack

- **Framework:** Nuxt 4 + Docus layer
- **UI:** NuxtUI v4 + TailwindCSS v4
- **Content:** Nuxt Content + MDC
- **i18n:** @nuxtjs/i18n (en/fr)
- **Changelog:** UChangelogVersions + ungh.cc GitHub proxy
- **Storage:** Static deployment

## Research Reports

1. **researcher-01-docus-nuxtui.md** - Multi-package structure patterns, navigation, NuxtUI v4 changelog API
2. **researcher-02-llm-features.md** - LLM-friendly markdown optimization, clipboard implementation, metadata standards

## Implementation Phases

### Phase 1: Project Setup [Status: ✅ Complete | Progress: 100%]
- Configure Nuxt/Docus/NuxtUI dependencies
- Setup TailwindCSS v4
- Establish base layout structure
- Configure i18n routes

**File:** phase-01-project-setup.md

### Phase 2: Multi-Package Structure [Status: ⏳ Pending | Progress: 0%]
- Create package-based content structure (sdk/, metadata/, indexer/, abis/)
- Implement auto-navigation with @nuxtjs/i18n
- Build package switcher component
- Configure cross-linking patterns

**File:** phase-02-multi-package-structure.md

### Phase 3: Changelog Integration [Status: ⏳ Pending | Progress: 0%]
- Copy AppLogo + SkyBg components from template
- Implement GitHub releases fetching via ungh.cc
- Build changelog pages per package
- Integrate UChangelogVersions + UChangelogVersion

**File:** phase-03-changelog-integration.md

### Phase 4: LLM Features [Status: ⏳ Pending | Progress: 0%]
- Add YAML frontmatter metadata schema
- Implement "Copy for LLM" button with @vueuse/core
- Build markdown optimization pipeline
- Add token estimation hints

**File:** phase-04-llm-features.md

### Phase 5: Content Migration [Status: ⏳ Pending | Progress: 0%]
- Extract README content from 4 packages
- Structure into Docus markdown files
- Add API reference sections
- Create landing pages

**File:** phase-05-content-migration.md

### Phase 6: Navigation & Search [Status: ⏳ Pending | Progress: 0%]
- Configure Nuxt Content search
- Build sidebar navigation
- Add breadcrumb components
- Implement package filtering

**File:** phase-06-navigation-search.md

## Package Documentation Scope

| Package | Lines | Priority | Key Content |
|---------|-------|----------|-------------|
| ABIs | 1752 | High | API endpoints, authentication, rate limits, deployment |
| Metadata | 571 | High | API reference, architecture, admin dashboard, IPFS |
| Indexer | 328 | Medium | Event-first architecture, domain structure, REST/GraphQL |
| SDK | 221 | Medium | React hooks, core modules, installation, migration |

## Success Criteria

- [ ] All 4 packages documented with consistent structure
- [ ] Changelog system fetching releases from GitHub
- [ ] LLM-optimized markdown export functional
- [ ] i18n navigation working for en/fr
- [ ] Search indexing all package content
- [ ] Mobile-responsive design
- [ ] Dark mode support

## Dependencies

- Research reports complete (2/2)
- Scout reports analyzed (3/3)
- Package README files accessible (4/4)
- Changelog template analyzed (1/1)

## Timeline Estimate

- Phase 1: 2 hours
- Phase 2: 3 hours
- Phase 3: 3 hours
- Phase 4: 2 hours
- Phase 5: 4 hours
- Phase 6: 2 hours

**Total:** ~16 hours

## Design Principles

- **YAGNI:** Only implement features explicitly required
- **KISS:** Leverage Docus auto-generation, avoid custom complexity
- **DRY:** Reuse changelog template components, extract common patterns
- **Token Efficiency:** Concise plans, no fluff, actionable steps
- **Self-Contained:** Each phase executable independently

## Next Actions

1. Read phase-01-project-setup.md for initial configuration
2. Execute Phase 1 setup tasks
3. Verify deployment before Phase 2
4. Proceed sequentially through remaining phases
