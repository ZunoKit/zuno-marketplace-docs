# Phase 2: Multi-Package Documentation Structure

**Parent Plan:** [plan.md](./plan.md)
**Dependencies:** [phase-01-project-setup.md](./phase-01-project-setup.md)
**Next Phase:** [phase-03-changelog-integration.md](./phase-03-changelog-integration.md)
**References:** [researcher-01-docus-nuxtui.md](./research/researcher-01-docus-nuxtui.md)

## Overview

**Date:** 2024-11-24
**Description:** Create package-based content structure with auto-navigation and package switcher component.
**Priority:** High
**Implementation Status:** ⏳ Pending
**Review Status:** Not Started

## Key Insights

- Docus auto-generates navigation from folder structure
- Top-level folders in content/{locale}/ become sidebar categories
- Package switcher can use UTabs component from NuxtUI v4
- Cross-linking works via relative markdown links
- Nuxt Content search auto-indexes all content/ files

## Requirements

1. Create 4 package directories under content/en and content/fr
2. Structure: sdk/, metadata/, indexer/, abis/
3. Each package needs index.md landing page
4. Implement PackageSwitcher.vue component with UTabs
5. Configure auto-navigation with .navigation.yml files
6. Setup cross-linking patterns between packages

## Architecture

### Directory Structure

```
content/
├── en/
│   ├── index.md                    # Homepage
│   ├── sdk/
│   │   ├── index.md                # SDK landing page
│   │   ├── 1.getting-started/
│   │   │   ├── installation.md
│   │   │   └── quick-start.md
│   │   ├── 2.core-modules/
│   │   │   ├── exchange.md
│   │   │   ├── collection.md
│   │   │   └── auction.md
│   │   └── 3.react-hooks/
│   │       └── hooks-overview.md
│   ├── metadata/
│   │   ├── index.md
│   │   ├── 1.getting-started/
│   │   ├── 2.api-reference/
│   │   └── 3.architecture/
│   ├── indexer/
│   │   ├── index.md
│   │   ├── 1.overview/
│   │   ├── 2.domain-architecture/
│   │   └── 3.api-endpoints/
│   └── abis/
│       ├── index.md
│       ├── 1.getting-started/
│       ├── 2.api-reference/
│       └── 3.deployment/
└── fr/ (mirror structure)
```

### Navigation YAML Pattern

Each package gets `.navigation.yml`:

```yaml
# content/en/sdk/.navigation.yml
- title: Getting Started
  icon: i-heroicons-rocket-launch
  badge: new
  children:
    - title: Installation
      to: /sdk/getting-started/installation
    - title: Quick Start
      to: /sdk/getting-started/quick-start

- title: Core Modules
  icon: i-heroicons-cube
  children:
    - title: Exchange
    - title: Collection
    - title: Auction
```

## Related Files

- `E:\zuno-marketplace-docs\content\en\` - English content base
- `E:\zuno-marketplace-docs\content\fr\` - French content base
- `E:\zuno-marketplace-sdk\README.md` - Source for SDK content
- `E:\zuno-marketplace-metadata\README.md` - Source for Metadata content
- `E:\zuno-marketplace-indexer\README.md` - Source for Indexer content
- `E:\zuno-marketplace-abis\README.md` - Source for ABIs content

## Implementation Steps

### 1. Create Package Directory Structure

```bash
cd E:\zuno-marketplace-docs

# Create English package dirs
mkdir -p content/en/sdk/1.getting-started
mkdir -p content/en/sdk/2.core-modules
mkdir -p content/en/sdk/3.react-hooks
mkdir -p content/en/metadata/1.getting-started
mkdir -p content/en/metadata/2.api-reference
mkdir -p content/en/metadata/3.architecture
mkdir -p content/en/indexer/1.overview
mkdir -p content/en/indexer/2.domain-architecture
mkdir -p content/en/indexer/3.api-endpoints
mkdir -p content/en/abis/1.getting-started
mkdir -p content/en/abis/2.api-reference
mkdir -p content/en/abis/3.deployment

# Mirror for French
mkdir -p content/fr/sdk/1.getting-started
mkdir -p content/fr/metadata/1.getting-started
mkdir -p content/fr/indexer/1.overview
mkdir -p content/fr/abis/1.getting-started
```

### 2. Create Package Index Pages

Example for SDK (content/en/sdk/index.md):

```markdown
---
title: Zuno Marketplace SDK
description: All-in-One NFT Marketplace SDK with Wagmi & React Query
icon: i-heroicons-code-bracket
navigation:
  icon: i-heroicons-code-bracket
  badge: v1.1.4
---

# Zuno Marketplace SDK

::card-group
  ::card
  ---
  title: Installation
  icon: i-heroicons-arrow-down-tray
  to: /sdk/getting-started/installation
  ---
  Get started with npm/pnpm installation.
  ::

  ::card
  ---
  title: Core Modules
  icon: i-heroicons-cube
  to: /sdk/core-modules/exchange
  ---
  Exchange, Auction, Collection modules.
  ::

  ::card
  ---
  title: React Hooks
  icon: i-heroicons-lightning-bolt
  to: /sdk/react-hooks/hooks-overview
  ---
  21+ hooks with Wagmi integration.
  ::
::
```

Repeat for metadata, indexer, abis with package-specific content.

### 3. Build PackageSwitcher Component

```vue
<!-- components/PackageSwitcher.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const packages = [
  { label: 'SDK', value: 'sdk', icon: 'i-heroicons-code-bracket' },
  { label: 'Metadata', value: 'metadata', icon: 'i-heroicons-photo' },
  { label: 'Indexer', value: 'indexer', icon: 'i-heroicons-circle-stack' },
  { label: 'ABIs', value: 'abis', icon: 'i-heroicons-document-text' }
]

const currentPackage = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  // Format: /en/sdk/... or /fr/abis/...
  return pathSegments[1] || 'sdk'
})

function switchPackage(pkg: string) {
  const locale = route.params.locale || 'en'
  router.push(`/${locale}/${pkg}`)
}
</script>

<template>
  <UTabs
    v-model="currentPackage"
    :items="packages"
    @update:model-value="switchPackage"
  >
    <template #item="{ item }">
      <div class="flex items-center gap-2">
        <UIcon :name="item.icon" class="w-5 h-5" />
        <span>{{ item.label }}</span>
      </div>
    </template>
  </UTabs>
</template>
```

### 4. Add PackageSwitcher to Layout

Create custom layout override (app.vue or use Docus slots):

```vue
<!-- app.vue -->
<template>
  <UApp>
    <UPageSection>
      <PackageSwitcher class="mb-8" />
      <NuxtPage />
    </UPageSection>
  </UApp>
</template>
```

### 5. Configure Cross-Linking

Add to each package's index.md:

```markdown
## Related Documentation

- [SDK API Reference](/sdk/core-modules/exchange)
- [Metadata Service](/metadata/getting-started)
- [Indexer Architecture](/indexer/domain-architecture)
- [ABIs Repository](/abis/api-reference)
```

### 6. Setup Navigation YAML Files

Create `.navigation.yml` for each package:

```bash
# content/en/sdk/.navigation.yml
touch content/en/sdk/.navigation.yml
touch content/en/metadata/.navigation.yml
touch content/en/indexer/.navigation.yml
touch content/en/abis/.navigation.yml
```

Example content (sdk):

```yaml
- title: Getting Started
  icon: i-heroicons-rocket-launch
  children:
    - title: Installation
      to: /sdk/getting-started/installation
    - title: Quick Start
      to: /sdk/getting-started/quick-start

- title: Core Modules
  icon: i-heroicons-cube
  children:
    - title: Exchange
      to: /sdk/core-modules/exchange
    - title: Collection
      to: /sdk/core-modules/collection
    - title: Auction
      to: /sdk/core-modules/auction

- title: React Hooks
  icon: i-heroicons-lightning-bolt
  to: /sdk/react-hooks/hooks-overview
```

### 7. Update Homepage (content/en/index.md)

```markdown
---
title: Zuno Marketplace Documentation
description: Unified docs for NFT marketplace ecosystem
---

# Welcome to Zuno Marketplace Docs

::card-group{cols="2"}
  ::card
  ---
  title: SDK
  icon: i-heroicons-code-bracket
  to: /sdk
  ---
  TypeScript SDK with React hooks for building NFT marketplaces.
  ::

  ::card
  ---
  title: Metadata
  icon: i-heroicons-photo
  to: /metadata
  ---
  Enterprise-grade NFT metadata management with IPFS storage.
  ::

  ::card
  ---
  title: Indexer
  icon: i-heroicons-circle-stack
  to: /indexer
  ---
  Event-first blockchain indexer with domain-driven design.
  ::

  ::card
  ---
  title: ABIs
  icon: i-heroicons-document-text
  to: /abis
  ---
  ABI marketplace with versioning and multi-network support.
  ::
::
```

## Todo List

- [ ] Create directory structure for all 4 packages (en + fr)
- [ ] Write index.md for sdk/ with card-group
- [ ] Write index.md for metadata/
- [ ] Write index.md for indexer/
- [ ] Write index.md for abis/
- [ ] Create PackageSwitcher.vue component with UTabs
- [ ] Add PackageSwitcher to app.vue layout
- [ ] Create .navigation.yml for each package
- [ ] Configure cross-linking in package index pages
- [ ] Update homepage (content/en/index.md) with package cards
- [ ] Mirror key pages to content/fr/ for French support
- [ ] Test navigation between packages
- [ ] Verify sidebar auto-generation works

## Success Criteria

1. Navigate to /en/sdk shows SDK landing page
2. PackageSwitcher component switches between packages
3. Sidebar shows auto-generated navigation from .navigation.yml
4. Cross-links between packages work (e.g., /sdk → /metadata)
5. Search modal indexes content from all packages
6. French routes (/fr/sdk) mirror English structure
7. Package icons visible in navigation
8. Card-group components render properly

## Risk Assessment

**Medium Risk:**
- UTabs component API may differ from changelog template → Verify NuxtUI v4 docs
- i18n route prefixes may break cross-links → Test with locale prefix strategy
- Auto-navigation may not respect .navigation.yml → Fallback to manual UContentNavigation

**Mitigation:**
- Reference NuxtUI v4 changelog template for UTabs usage
- Use relative links with locale awareness: `/${$i18n.locale}/sdk`
- Test Docus auto-nav first; override only if needed

## Security Considerations

- None (static content, no user input)
- Ensure no sensitive info in package index.md files

## Next Steps

After Phase 2 complete:
1. Verify all package routes accessible
2. Test package switcher on mobile
3. Proceed to Phase 3: Changelog Integration
4. Implement GitHub releases fetching per package
