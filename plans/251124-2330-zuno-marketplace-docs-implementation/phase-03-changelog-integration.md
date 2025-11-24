# Phase 3: Changelog Integration

**Parent Plan:** [plan.md](./plan.md)
**Dependencies:** [phase-02-multi-package-structure.md](./phase-02-multi-package-structure.md)
**Next Phase:** [phase-04-llm-features.md](./phase-04-llm-features.md)
**References:** [scout-02-changelog-components.md](./scout/scout-02-changelog-components.md), [researcher-01-docus-nuxtui.md](./research/researcher-01-docus-nuxtui.md)

## Overview

**Date:** 2024-11-24
**Description:** Integrate GitHub releases changelog system using ungh.cc proxy with NuxtUI v4 components.
**Priority:** High
**Implementation Status:** ⏳ Pending
**Review Status:** Not Started

## Key Insights

- Changelog template uses ungh.cc proxy: `https://ungh.cc/repos/{owner}/{repo}/releases`
- UChangelogVersions + UChangelogVersion components from NuxtUI v4
- SkyBg.vue provides animated starfield background (optional)
- MDC component renders markdown release notes
- Route-specific state via useState hook prevents star regeneration
- GitHub API data transformed to {tag, title, date, markdown}

## Requirements

1. Copy AppLogo.vue + SkyBg.vue from changelog template
2. Create changelog pages for each package (sdk, metadata, indexer, abis)
3. Implement GitHub releases fetching via ungh.cc
4. Use UChangelogVersions + UChangelogVersion for rendering
5. Add MDC rendering for release notes markdown
6. Configure repository paths in app.config.ts
7. Style with green theme from Phase 1

## Architecture

### Component Structure
```
components/
├── AppLogo.vue (already copied in Phase 1)
├── SkyBg.vue (copy from template)
└── changelog/
    └── ReleaseList.vue (wrapper for UChangelogVersions)
```

### Changelog Route Structure
```
pages/
├── [locale]/
    ├── sdk/
    │   └── changelog.vue
    ├── metadata/
    │   └── changelog.vue
    ├── indexer/
    │   └── changelog.vue
    └── abis/
        └── changelog.vue
```

### Data Flow
```
app.config.ts (repository map)
  ↓
useFetch → ungh.cc API
  ↓
Transform releases data
  ↓
UChangelogVersions → UChangelogVersion (loop)
  ↓
MDC component (markdown rendering)
```

## Related Files

- `C:\Users\ADMIN\Desktop\changelog-main\components\SkyBg.vue` - Animated background
- `C:\Users\ADMIN\Desktop\changelog-main\pages\index.vue` - Changelog page template
- `E:\zuno-marketplace-docs\app.config.ts` - Repository config
- GitHub repos:
  - SDK: `ZunoKit/zuno-marketplace-sdk`
  - Metadata: `ZunoKit/zuno-marketplace-metadata`
  - Indexer: `ZunoKit/zuno-marketplace-indexer`
  - ABIs: `ZunoKit/zuno-marketplace-abis`

## Implementation Steps

### 1. Copy SkyBg Component

```bash
cp "C:\Users\ADMIN\Desktop\changelog-main\components\SkyBg.vue" "E:\zuno-marketplace-docs\components\SkyBg.vue"
```

### 2. Configure Repository Map in app.config.ts

```typescript
// app.config.ts (add to existing config)
export default defineAppConfig({
  // ... existing config

  repositories: {
    sdk: 'ZunoKit/zuno-marketplace-sdk',
    metadata: 'ZunoKit/zuno-marketplace-metadata',
    indexer: 'ZunoKit/zuno-marketplace-indexer',
    abis: 'ZunoKit/zuno-marketplace-abis'
  }
})
```

### 3. Create Reusable ReleaseList Component

```vue
<!-- components/changelog/ReleaseList.vue -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  repository: string
}

const props = defineProps<Props>()

const appConfig = useAppConfig()

const { data: versions, status } = await useFetch(
  computed(() => `https://ungh.cc/repos/${props.repository}/releases`),
  {
    transform: (data: any) => {
      return data.releases.map((release: any) => ({
        tag: release.tag,
        title: release.name || release.tag,
        date: release.publishedAt,
        markdown: release.markdown
      }))
    },
    key: `changelog-${props.repository}`
  }
)
</script>

<template>
  <div>
    <div v-if="status === 'pending'" class="text-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin w-8 h-8" />
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading releases...</p>
    </div>

    <div v-else-if="status === 'error'" class="text-center py-12">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-red-500" />
      <p class="mt-4 text-red-600 dark:text-red-400">Failed to load releases</p>
    </div>

    <UChangelogVersions v-else>
      <UChangelogVersion
        v-for="version in versions"
        :key="version.tag"
        :title="version.title"
        :date="version.date"
        :badge="{
          label: version.tag,
          color: 'green'
        }"
      >
        <template #body>
          <MDC :value="version.markdown" class="prose dark:prose-invert max-w-none" />
        </template>
      </UChangelogVersion>
    </UChangelogVersions>
  </div>
</template>
```

### 4. Create Changelog Pages for Each Package

Example for SDK (pages/[locale]/sdk/changelog.vue):

```vue
<!-- pages/[locale]/sdk/changelog.vue -->
<script setup lang="ts">
const appConfig = useAppConfig()
const repository = appConfig.repositories.sdk

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'SDK Changelog',
  description: 'Release history for Zuno Marketplace SDK',
  ogTitle: 'SDK Changelog | Zuno Marketplace',
  ogDescription: 'Track updates and new features for the SDK'
})
</script>

<template>
  <div class="relative min-h-screen">
    <!-- Animated background -->
    <SkyBg
      :star-count="50"
      color="green"
      speed="normal"
      class="absolute inset-0 pointer-events-none z-[-1]"
    />

    <UPageSection class="py-12">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-12 text-center">
          <h1 class="text-4xl font-bold mb-4">SDK Changelog</h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Track updates, new features, and bug fixes for the Zuno Marketplace SDK
          </p>
        </div>

        <!-- Release list -->
        <ChangelogReleaseList :repository="repository" />
      </div>
    </UPageSection>
  </div>
</template>
```

Repeat for metadata, indexer, abis with package-specific text.

### 5. Add Changelog Links to Package Navigation

Update .navigation.yml for each package:

```yaml
# content/en/sdk/.navigation.yml
- title: Getting Started
  # ... existing items

- title: Changelog
  icon: i-heroicons-newspaper
  to: /sdk/changelog
  badge: new
```

### 6. Add Changelog Link to Package Index Pages

Example for SDK (content/en/sdk/index.md):

```markdown
---
title: Zuno Marketplace SDK
---

# Zuno Marketplace SDK

::card-group
  ::card
  ---
  title: Changelog
  icon: i-heroicons-newspaper
  to: /sdk/changelog
  ---
  Track SDK updates and releases.
  ::
::
```

### 7. Test Release Fetching

```bash
# Test API endpoint manually
curl "https://ungh.cc/repos/ZunoKit/zuno-marketplace-sdk/releases"

# Expected response:
# {
#   "releases": [
#     {
#       "tag": "v1.1.4",
#       "name": "Version 1.1.4",
#       "publishedAt": "2024-11-20T...",
#       "markdown": "## What's New\n..."
#     }
#   ]
# }
```

### 8. Style Customization

Add prose styling for markdown content (if not already in main.css):

```css
/* assets/css/main.css */
.prose {
  max-width: 65ch;
}

.prose h2 {
  @apply text-2xl font-bold mt-8 mb-4;
}

.prose h3 {
  @apply text-xl font-semibold mt-6 mb-3;
}

.prose ul {
  @apply list-disc pl-6 my-4;
}

.prose code {
  @apply bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm;
}
```

## Todo List

- [ ] Copy SkyBg.vue from changelog template
- [ ] Add repositories config to app.config.ts
- [ ] Create components/changelog/ReleaseList.vue
- [ ] Create pages/[locale]/sdk/changelog.vue
- [ ] Create pages/[locale]/metadata/changelog.vue
- [ ] Create pages/[locale]/indexer/changelog.vue
- [ ] Create pages/[locale]/abis/changelog.vue
- [ ] Update .navigation.yml files to include changelog links
- [ ] Add changelog cards to package index.md files
- [ ] Test ungh.cc API connectivity
- [ ] Verify MDC markdown rendering
- [ ] Test SkyBg animation performance
- [ ] Verify changelog pages on mobile

## Success Criteria

1. Navigate to /en/sdk/changelog shows releases
2. GitHub releases fetched via ungh.cc successfully
3. Release notes render with MDC component
4. SkyBg animation visible and performant
5. Green badge color matches theme
6. Changelog links in sidebar navigation work
7. Loading state displays during fetch
8. Error state shows if API fails
9. Responsive layout on mobile

## Risk Assessment

**Medium Risk:**
- ungh.cc may rate-limit or fail → Add error handling + retry logic
- GitHub releases may not exist for all packages → Show empty state
- SkyBg animation may lag on mobile → Add reduced-motion media query

**Mitigation:**
- Implement proper error/loading states in ReleaseList.vue
- Add "No releases yet" empty state
- Test SkyBg performance; disable on low-power devices if needed

**Low Risk:**
- MDC rendering may fail on complex markdown → Test with actual release notes
- Route-specific state may conflict → Use unique keys per package

## Security Considerations

- ungh.cc is third-party proxy → GitHub official API preferred but requires auth
- No sensitive data in release notes (public repos)
- CSP may block ungh.cc → Whitelist in nuxt.config.ts if needed

Add to nuxt.config.ts if CSP issues:

```typescript
export default defineNuxtConfig({
  // ...
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Content-Security-Policy': "connect-src 'self' https://ungh.cc"
        }
      }
    }
  }
})
```

## Next Steps

After Phase 3 complete:
1. Verify all 4 package changelogs display releases
2. Test changelog pagination if needed (100+ releases)
3. Proceed to Phase 4: LLM Features
4. Implement "Copy for LLM" button for changelog pages
