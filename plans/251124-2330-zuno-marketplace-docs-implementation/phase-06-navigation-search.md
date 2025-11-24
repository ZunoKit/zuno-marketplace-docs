# Phase 6: Navigation & Search

**Parent Plan:** [plan.md](./plan.md)
**Dependencies:** [phase-05-content-migration.md](./phase-05-content-migration.md)
**Next Phase:** None (final phase)

## Overview

**Date:** 2024-11-24
**Description:** Configure Nuxt Content search, build sidebar navigation, breadcrumbs, and package filtering.
**Priority:** Medium
**Implementation Status:** ⏳ Pending
**Review Status:** Not Started

## Key Insights

- Nuxt Content auto-indexes all markdown in content/ directory
- Docus provides built-in search modal (Cmd+K)
- UContentNavigation component generates tree from .navigation.yml
- Breadcrumb component available in Docus
- Search can be filtered via query parameters
- i18n support requires locale-aware navigation

## Requirements

1. Configure Nuxt Content search indexing
2. Enable Docus search modal with keyboard shortcuts
3. Build sidebar navigation with package sections
4. Add breadcrumb component to page headers
5. Implement package filter for search
6. Configure search highlighting
7. Add keyboard navigation support
8. Create "Table of Contents" component for long pages

## Architecture

### Search Configuration
```
Nuxt Content
  ↓ (indexes)
content/**/*.md
  ↓ (queries)
Search Modal (Cmd+K)
  ↓ (filters)
Package Filter
  ↓ (results)
Highlighted Results
```

### Navigation Hierarchy
```
Sidebar
├── Package Switcher (UTabs)
├── Package Navigation
│   ├── Getting Started (section)
│   │   ├── Installation
│   │   └── Quick Start
│   ├── Core Modules (section)
│   └── ...
└── Changelog Link
```

### Breadcrumb Structure
```
Home > SDK > Getting Started > Installation
```

## Related Files

- `E:\zuno-marketplace-docs\nuxt.config.ts` - Search config
- `E:\zuno-marketplace-docs\app.config.ts` - Docus search settings
- `E:\zuno-marketplace-docs\components\AppSidebar.vue` - Custom sidebar
- `E:\zuno-marketplace-docs\components\Breadcrumb.vue` - Breadcrumb component
- `E:\zuno-marketplace-docs\components\TableOfContents.vue` - TOC component

## Implementation Steps

### 1. Configure Nuxt Content Search

Update nuxt.config.ts:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // ... existing config

  content: {
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark'
      },
      preload: ['typescript', 'javascript', 'vue', 'bash', 'json', 'yaml']
    },

    // Search configuration
    search: {
      indexed: true,
      fields: ['title', 'description', 'body', 'package', 'category'],
      filterQuery: {},
      options: {
        fields: ['title', 'description', 'keywords'],
        storeFields: ['title', 'description', 'path', 'package'],
        searchOptions: {
          prefix: true,
          fuzzy: 0.2,
          boost: {
            title: 4,
            description: 2,
            keywords: 2
          }
        }
      }
    },

    navigation: {
      fields: ['title', 'icon', 'badge', 'description']
    }
  }
})
```

### 2. Configure Docus Search Modal

Update app.config.ts:

```typescript
// app.config.ts
export default defineAppConfig({
  // ... existing config

  docus: {
    // ... existing docus config

    search: {
      enabled: true,
      inAside: false,
      style: 'input',
      placeholder: 'Search docs...',
      shortcuts: {
        modal: ['meta', 'k'],
        navigation: {
          next: 'ArrowDown',
          previous: 'ArrowUp',
          close: 'Escape',
          select: 'Enter'
        }
      }
    }
  }
})
```

### 3. Create Enhanced Sidebar Navigation

```vue
<!-- components/AppSidebar.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentPackage = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  return segments[1] || 'sdk' // locale, package, ...
})

const { data: navigation } = await useAsyncData('navigation', () =>
  fetchContentNavigation(queryContent(`/${currentPackage.value}`))
)
</script>

<template>
  <aside class="w-64 border-r border-gray-200 dark:border-gray-800 h-screen overflow-y-auto sticky top-0">
    <!-- Package Switcher -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-800">
      <PackageSwitcher />
    </div>

    <!-- Navigation Tree -->
    <nav class="p-4">
      <UContentNavigation
        :links="navigation"
        :ui="{
          wrapper: 'space-y-2',
          link: {
            active: 'text-primary-500 bg-primary-50 dark:bg-primary-900/20',
            inactive: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        }"
      />
    </nav>

    <!-- Changelog Link -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-800">
      <NuxtLink
        :to="`/${route.params.locale}/${currentPackage}/changelog`"
        class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500"
      >
        <UIcon name="i-heroicons-newspaper" class="w-4 h-4" />
        Changelog
      </NuxtLink>
    </div>
  </aside>
</template>
```

### 4. Create Breadcrumb Component

```vue
<!-- components/Breadcrumb.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  const crumbs = []

  // Home
  crumbs.push({
    label: 'Home',
    to: `/${segments[0]}`
  })

  // Package
  if (segments[1]) {
    crumbs.push({
      label: segments[1].toUpperCase(),
      to: `/${segments[0]}/${segments[1]}`
    })
  }

  // Remaining segments
  for (let i = 2; i < segments.length; i++) {
    const label = segments[i]
      .replace(/^\d+\./, '') // Remove number prefix
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())

    crumbs.push({
      label,
      to: `/${segments.slice(0, i + 1).join('/')}`
    })
  }

  return crumbs
})
</script>

<template>
  <nav class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
    <template v-for="(crumb, index) in breadcrumbs" :key="crumb.to">
      <NuxtLink
        :to="crumb.to"
        class="hover:text-primary-500"
        :class="{ 'font-semibold text-gray-900 dark:text-gray-100': index === breadcrumbs.length - 1 }"
      >
        {{ crumb.label }}
      </NuxtLink>
      <UIcon
        v-if="index < breadcrumbs.length - 1"
        name="i-heroicons-chevron-right"
        class="w-4 h-4"
      />
    </template>
  </nav>
</template>
```

### 5. Create Table of Contents Component

```vue
<!-- components/TableOfContents.vue -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  links?: any[]
}

const props = defineProps<Props>()

const { page } = useContent()

const toc = computed(() => {
  return props.links || page.value?.body?.toc?.links || []
})
</script>

<template>
  <aside v-if="toc.length > 0" class="hidden xl:block w-64 pl-8">
    <div class="sticky top-20">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
        On this page
      </h3>
      <nav class="space-y-2">
        <a
          v-for="link in toc"
          :key="link.id"
          :href="`#${link.id}`"
          class="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors"
          :class="{
            'pl-4': link.depth === 3,
            'pl-8': link.depth === 4
          }"
        >
          {{ link.text }}
        </a>
      </nav>
    </div>
  </aside>
</template>
```

### 6. Implement Package Filter in Search

Create search filter composable:

```typescript
// composables/usePackageSearch.ts
export function usePackageSearch() {
  const route = useRoute()

  const currentPackage = computed(() => {
    const segments = route.path.split('/').filter(Boolean)
    return segments[1]
  })

  async function searchContent(query: string, filterPackage = true) {
    let search = queryContent()
      .where({ _partial: false })
      .search(query)

    if (filterPackage && currentPackage.value) {
      search = search.where({ package: currentPackage.value })
    }

    const results = await search.find()
    return results
  }

  return {
    currentPackage,
    searchContent
  }
}
```

Override Docus search component:

```vue
<!-- components/content/SearchModal.vue -->
<script setup lang="ts">
const { searchContent } = usePackageSearch()

const searchQuery = ref('')
const filterByPackage = ref(true)
const searchResults = ref([])

watch([searchQuery, filterByPackage], async ([query, filter]) => {
  if (!query) {
    searchResults.value = []
    return
  }

  searchResults.value = await searchContent(query, filter)
})
</script>

<template>
  <UModal>
    <div class="p-4">
      <!-- Search input -->
      <UInput
        v-model="searchQuery"
        placeholder="Search docs..."
        icon="i-heroicons-magnifying-glass"
        size="lg"
      />

      <!-- Filter toggle -->
      <UCheckbox
        v-model="filterByPackage"
        label="Search current package only"
        class="mt-4"
      />

      <!-- Results -->
      <div class="mt-6 space-y-2">
        <NuxtLink
          v-for="result in searchResults"
          :key="result._path"
          :to="result._path"
          class="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div class="font-semibold">{{ result.title }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ result.description }}
          </div>
          <div class="text-xs text-gray-500 mt-1">
            {{ result._path }}
          </div>
        </NuxtLink>
      </div>
    </div>
  </UModal>
</template>
```

### 7. Update Main Layout

Integrate all navigation components:

```vue
<!-- app.vue -->
<template>
  <UApp>
    <div class="flex min-h-screen">
      <!-- Sidebar -->
      <AppSidebar />

      <!-- Main content -->
      <div class="flex-1 flex flex-col">
        <!-- Header with search -->
        <header class="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div class="flex items-center justify-between p-4">
            <AppLogo />
            <div class="flex items-center gap-4">
              <UButton
                icon="i-heroicons-magnifying-glass"
                variant="outline"
                @click="openSearch"
              >
                Search
                <UKbd>⌘K</UKbd>
              </UButton>
              <UColorModeButton />
            </div>
          </div>
        </header>

        <!-- Content area -->
        <div class="flex-1 flex">
          <main class="flex-1 p-8">
            <Breadcrumb />
            <NuxtPage />
          </main>

          <!-- Table of Contents -->
          <TableOfContents />
        </div>
      </div>
    </div>
  </UApp>
</template>

<script setup>
const openSearch = () => {
  // Trigger Docus search modal
  document.dispatchEvent(new KeyboardEvent('keydown', {
    key: 'k',
    metaKey: true
  }))
}
</script>
```

### 8. Add Search Analytics

Track search queries:

```typescript
// composables/useSearchAnalytics.ts
export function useSearchAnalytics() {
  function trackSearch(query: string, resultsCount: number) {
    // Send to analytics service
    console.log('Search:', { query, resultsCount })

    // Optional: store recent searches
    const recentSearches = useState<string[]>('recentSearches', () => [])
    recentSearches.value.unshift(query)
    recentSearches.value = recentSearches.value.slice(0, 5)
  }

  return { trackSearch }
}
```

## Todo List

- [ ] Configure Nuxt Content search in nuxt.config.ts
- [ ] Configure Docus search modal in app.config.ts
- [ ] Create AppSidebar.vue component
- [ ] Create Breadcrumb.vue component
- [ ] Create TableOfContents.vue component
- [ ] Create usePackageSearch.ts composable
- [ ] Override SearchModal.vue for package filtering
- [ ] Update app.vue with navigation layout
- [ ] Add keyboard shortcuts for navigation
- [ ] Test search indexing across all packages
- [ ] Test search filtering by package
- [ ] Verify breadcrumb navigation on all pages
- [ ] Test TOC scrollspy on long pages
- [ ] Add search analytics tracking
- [ ] Test mobile navigation (collapsible sidebar)
- [ ] Verify i18n navigation (en/fr switching)

## Success Criteria

1. Cmd+K opens search modal
2. Search indexes all 44+ migrated pages
3. Package filter toggles search scope
4. Search highlights query terms in results
5. Sidebar navigation shows current page active
6. Breadcrumb displays correct path
7. TOC links scroll to headings smoothly
8. Mobile sidebar collapsible and functional
9. Keyboard navigation works (arrows, enter, escape)
10. French locale navigation mirrors English structure
11. Search results ranked by relevance
12. Zero broken navigation links

## Risk Assessment

**Low Risk:**
- Search indexing may be slow on first build → Acceptable for static site
- TOC may not update on client-side navigation → Use useContent() reactivity
- Breadcrumb links may break with complex routes → Test edge cases

**Medium Risk:**
- Docus search modal override may conflict → Use slots/props if available
- Package filter may not persist across sessions → Store in localStorage

**Mitigation:**
- Test search performance with all content
- Fallback to default Docus search if override fails
- Add localStorage persistence for search preferences

## Security Considerations

- No sensitive data in search index (public docs)
- Search analytics don't collect PII
- Keyboard shortcuts don't conflict with browser defaults

## Next Steps

After Phase 6 complete:
1. Full end-to-end testing of all features
2. Performance audit (Lighthouse)
3. Accessibility audit (axe DevTools)
4. Deploy to staging environment
5. Gather user feedback
6. Iterate on navigation UX
7. Production deployment

## Unresolved Questions

1. Should search support regex or advanced queries?
2. Add "Popular Pages" section in search modal?
3. Implement search result caching for performance?
4. Add "Search within package" quick filter in sidebar?
