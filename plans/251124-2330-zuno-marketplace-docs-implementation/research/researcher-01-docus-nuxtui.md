# Docus + NuxtUI Multi-Package Documentation Research
**Date:** 2025-11-24 | **Status:** Complete

## 1. Docus Multi-Package Documentation Patterns

### Directory Structure for Multi-Package Docs
Docus uses auto-generated navigation based on file structure. Recommended approach:
```
content/
├── en/
│   ├── index.md
│   ├── sdk/              # Package 1
│   │   ├── index.md
│   │   ├── installation.md
│   │   └── api.md
│   ├── abis/             # Package 2
│   │   ├── index.md
│   │   └── reference.md
│   └── indexer/          # Package 3
│       ├── index.md
│       └── usage.md
└── fr/                   # For i18n
    └── [same structure]
```

**Key:** Docus auto-generates sidebar from folder structure. Top-level folders become sidebar categories.

### Navigation Strategies
1. **Auto-Generated Navigation** (default): Docus parses folder structure, auto-generates UContentNavigation
2. **Custom Navigation**: Override with `app.config.ts` to customize sidebar order/grouping
3. **Package Switcher**: Use component tabs in header to switch between packages:
```vue
<script setup>
const packages = ['sdk', 'abis', 'indexer']
const current = ref('sdk')
</script>

<template>
  <UTabs v-model="current" :items="packages.map(p => ({ label: p }))">
    <!-- Load content based on current selection -->
  </UTabs>
</template>
```

### Monorepo Best Practices
- **Cross-linking:** Use relative links between packages: `[SDK API](/sdk/api.md)`
- **Shared Components:** Store in root components/ folder, accessible across all packages
- **Unified Search:** Nuxt Content's search works across all content/ subfolders automatically

## 2. NuxtUI v4 Changelog Components API

### UChangelogVersion Props
```typescript
{
  title?: string;              // Version heading
  description?: string;        // Explanatory text
  date?: string | Date;        // Release date
  badge?: string | BadgeProps; // Color-coded badge
  image?: string | HTMLImage;  // Visual asset
  authors?: UserProps[];       // Contributor array
  to?: RouteLink;              // Makes component clickable
  indicator?: boolean;         // Timeline dot visibility
}
```

### Available Slots
`header`, `badge`, `date`, `title`, `description`, `image`, `body`, `footer`, `authors`, `actions`, `indicator`

**Critical Slot:** `body` for custom markdown or detailed content insertion.

### UChangelogVersions Container
Wrapper component that accepts:
- `versions` prop: Array of ChangelogVersion objects
- Slot forwarding: All ChangelogVersion slots work within versions prop usage
- Auto-renders multiple versions in timeline layout

### Integration Examples
**Nuxt Content Integration:**
```vue
<script setup>
const { data: versions } = await useAsyncData('versions',
  () => queryCollection('versions').all()
)
</script>

<template>
  <UChangelogVersions>
    <UChangelogVersion
      v-for="v in versions"
      :key="v.id"
      v-bind="v"
      :to="`/changelog/${v.slug}`"
    />
  </UChangelogVersions>
</template>
```

**GitHub Releases Integration:** Use Nuxt composables to fetch releases API, map to ChangelogVersion props.

### Customization
- **Theming:** `ui` prop allows styling container, header, metadata, title sections
- **Variants:** Badge variants map to semantic colors (success, warning, error, info)
- **Styling:** Tailwind CSS utility-first; modify through component's `ui` configuration

## 3. Docus Content Organization

### Frontmatter Conventions
```yaml
---
title: "Installation Guide"
description: "How to install the SDK"
icon: "i-heroicons-document-text"
navigation:
  icon: 'i-heroicons-square-3-stack-3d'
  badge: 'new'
---
```

### Content Routing
- File path determines URL: `content/sdk/installation.md` → `/sdk/installation`
- i18n structure: `content/en/sdk/` → `/en/sdk/` and `content/fr/sdk/` → `/fr/sdk/`
- Index files auto-generate category landing pages

### Cross-Linking Between Packages
```markdown
[SDK Documentation](/sdk/getting-started)
[See ABI Reference](/abis/erc721)
[Indexer Configuration](/indexer/setup)
```

### Search Functionality
- Nuxt Content automatically indexes all markdown in content/ directory
- Search modal built-in via Docus layer; queries work across all packages
- Index is pre-built at build time; available in production

### File Organization Tips
- Use numbered prefixes for ordering: `1.getting-started/`, `2.essentials/`, `3.advanced/`
- Keep package docs isolated in separate folders for clarity
- Shared documentation in root-level content (not package-specific)

## Technologies & References

- **Docus:** Nuxt-based docs framework (v3+) with auto-nav generation
- **Nuxt Content:** File-based CMS with Zod schema validation, MDC support
- **NuxtUI:** 100+ components; changelog components in v4+
- **Tailwind CSS 4:** Styling foundation with `@theme` directives

## Unresolved Questions

1. Does Docus support conditional package visibility (e.g., hiding packages from search/nav)?
2. Best approach for versioning documentation across multiple packages simultaneously?
3. Performance impact of large monorepo (50+ markdown files per package) on search indexing?
4. How to implement per-package analytics or download tracking for changelogs?
