# Phase 5: Content Migration

**Parent Plan:** [plan.md](./plan.md)
**Dependencies:** [phase-04-llm-features.md](./phase-04-llm-features.md)
**Next Phase:** [phase-06-navigation-search.md](./phase-06-navigation-search.md)

## Overview

**Date:** 2024-11-24
**Description:** Extract and migrate README content from 4 packages into structured Docus markdown.
**Priority:** High
**Implementation Status:** ⏳ Pending
**Review Status:** Not Started

## Key Insights

- ABIs README: 1752 lines (most detailed) - API docs, auth, deployment, security
- Metadata README: 571 lines - Architecture, API reference, admin features
- Indexer README: 328 lines - Domain structure, event-first architecture
- SDK README: 221 lines - React hooks, core modules, installation
- All READMEs well-structured with badges, tables, code examples
- Need to break into multiple pages per package for better navigation

## Requirements

1. Extract sections from each README into individual markdown files
2. Preserve code examples, tables, badges
3. Add frontmatter metadata to all pages
4. Create logical page hierarchy (1.getting-started, 2.api-reference, etc.)
5. Convert installation badges to Docus format
6. Add cross-references between related pages
7. Maintain consistent formatting across packages

## Architecture

### Content Breakdown

**SDK (221 lines → 8 pages)**
- index.md: Overview, features, badges
- getting-started/installation.md
- getting-started/quick-start.md
- core-modules/exchange.md
- core-modules/collection.md
- core-modules/auction.md
- core-modules/offers-bundles.md
- react-hooks/overview.md

**Metadata (571 lines → 12 pages)**
- index.md: Overview, tech stack, architecture
- getting-started/installation.md
- getting-started/configuration.md
- api-reference/authentication.md
- api-reference/metadata-endpoints.md
- api-reference/media-endpoints.md
- architecture/clean-architecture.md
- architecture/project-structure.md
- deployment/production-checklist.md
- deployment/docker.md
- deployment/vercel.md
- security/best-practices.md

**Indexer (328 lines → 9 pages)**
- index.md: Overview, features
- getting-started/installation.md
- getting-started/quick-start.md
- domain-architecture/overview.md
- domain-architecture/event-first.md
- domain-architecture/domains.md
- api-endpoints/rest-api.md
- api-endpoints/graphql.md
- deployment/configuration.md

**ABIs (1752 lines → 15 pages)**
- index.md: Overview, features, architecture
- getting-started/installation.md
- getting-started/quick-start.md
- getting-started/verification.md
- api-reference/authentication.md
- api-reference/abis-endpoints.md
- api-reference/contracts-endpoints.md
- api-reference/networks-endpoints.md
- api-reference/response-format.md
- deployment/vercel.md
- deployment/docker.md
- deployment/platforms.md
- deployment/post-deployment.md
- security/authentication.md
- security/best-practices.md

## Related Files

**Source READMEs:**
- `E:\zuno-marketplace-sdk\README.md` (221 lines)
- `E:\zuno-marketplace-metadata\README.md` (571 lines)
- `E:\zuno-marketplace-indexer\README.md` (328 lines)
- `E:\zuno-marketplace-abis\README.md` (1752 lines)

**Target Structure:**
- `E:\zuno-marketplace-docs\content\en\{package}\**\*.md`

## Implementation Steps

### 1. Create Content Structure Directories

```bash
cd E:\zuno-marketplace-docs

# SDK
mkdir -p content/en/sdk/{1.getting-started,2.core-modules,3.react-hooks}

# Metadata
mkdir -p content/en/metadata/{1.getting-started,2.api-reference,3.architecture,4.deployment,5.security}

# Indexer
mkdir -p content/en/indexer/{1.getting-started,2.domain-architecture,3.api-endpoints,4.deployment}

# ABIs
mkdir -p content/en/abis/{1.getting-started,2.api-reference,3.deployment,4.security}
```

### 2. Create Extraction Script

```typescript
// scripts/extract-readme.ts
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

interface Section {
  title: string
  content: string
  level: number
}

function extractSections(markdown: string): Section[] {
  const sections: Section[] = []
  const lines = markdown.split('\n')

  let currentSection: Section | null = null

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)

    if (headingMatch) {
      if (currentSection) {
        sections.push(currentSection)
      }

      currentSection = {
        title: headingMatch[2],
        content: line + '\n',
        level: headingMatch[1].length
      }
    } else if (currentSection) {
      currentSection.content += line + '\n'
    }
  }

  if (currentSection) {
    sections.push(currentSection)
  }

  return sections
}

function generateFrontmatter(title: string, pkg: string, scope: string): string {
  return `---
title: "${title}"
package: "${pkg}"
lastUpdated: "2024-11-24"
scope: "${scope}"
complexity: "intermediate"
---

`
}

// Extract SDK
const sdkReadme = readFileSync('E:\\zuno-marketplace-sdk\\README.md', 'utf-8')
const sdkSections = extractSections(sdkReadme)

// Write installation page
const installSection = sdkSections.find(s => s.title.includes('Installation'))
if (installSection) {
  const content = generateFrontmatter('Installation', 'sdk', 'guide') + installSection.content
  writeFileSync('content/en/sdk/1.getting-started/installation.md', content)
}

// Repeat for other sections...
```

### 3. Manual Migration Template

For consistency, use this template for each page:

```markdown
---
title: "Page Title"
package: "sdk|metadata|indexer|abis"
lastUpdated: "2024-11-24"
scope: "guide|api-reference|architecture|deployment"
complexity: "beginner|intermediate|advanced"
category: "installation|configuration|api"
relatedTopics:
  - "related-page-1"
  - "related-page-2"
---

# Page Title

<!-- Extract content from README -->

## Overview

Brief introduction...

## Prerequisites

List requirements...

## Implementation

Step-by-step guide...

## Code Examples

\`\`\`typescript
// Code samples from README
\`\`\`

## Next Steps

- [Related Page 1](/sdk/related-page-1)
- [Related Page 2](/sdk/related-page-2)
```

### 4. Migrate SDK Content

**Installation (content/en/sdk/1.getting-started/installation.md):**

```markdown
---
title: "Installation"
package: "sdk"
lastUpdated: "2024-11-24"
scope: "guide"
complexity: "beginner"
category: "installation"
relatedTopics:
  - "quick-start"
  - "configuration"
---

# Installation

## Prerequisites

- Node.js 18+
- npm or pnpm

## Install Package

\`\`\`bash
npm install zuno-marketplace-sdk ethers@6 @tanstack/react-query wagmi viem
\`\`\`

## Verify Installation

\`\`\`bash
npm list zuno-marketplace-sdk
\`\`\`

## Next Steps

- [Quick Start Guide](/sdk/getting-started/quick-start)
- [Core Modules](/sdk/core-modules/exchange)
```

**Quick Start (content/en/sdk/1.getting-started/quick-start.md):**

Extract React examples from SDK README sections 38-93.

### 5. Migrate Metadata Content

Focus on high-value sections:

**API Authentication (content/en/metadata/2.api-reference/authentication.md):**

Extract from lines 176-193 (authentication section).

**Architecture Overview (content/en/metadata/3.architecture/clean-architecture.md):**

Extract from lines 43-74 (architecture + tech stack).

### 6. Migrate Indexer Content

**Event-First Architecture (content/en/indexer/2.domain-architecture/event-first.md):**

Extract from lines 79-154 (database schema section).

### 7. Migrate ABIs Content

Priority sections due to detail:

**API Endpoints (content/en/abis/2.api-reference/abis-endpoints.md):**

Extract collapsible sections from lines 402-474.

**Deployment (content/en/abis/3.deployment/vercel.md):**

Extract from lines 964-1024 (Vercel deployment).

### 8. Add Badges to Index Pages

Convert README badges to Docus format:

```markdown
---
title: "Zuno Marketplace SDK"
---

<div class="flex gap-2 mb-6">
  <UBadge color="blue" variant="subtle">TypeScript 5.6</UBadge>
  <UBadge color="green" variant="subtle">React 19</UBadge>
  <UBadge color="purple" variant="subtle">v1.1.4</UBadge>
</div>

# Zuno Marketplace SDK
```

### 9. Add Cross-References

Link related pages in "See Also" sections:

```markdown
## See Also

- **SDK**: [React Hooks](/sdk/react-hooks/overview)
- **Metadata**: [API Authentication](/metadata/api-reference/authentication)
- **Indexer**: [Event Architecture](/indexer/domain-architecture/event-first)
- **ABIs**: [API Reference](/abis/api-reference/abis-endpoints)
```

### 10. Create Migration Checklist

```bash
# scripts/migration-progress.sh
#!/bin/bash

echo "Content Migration Progress"
echo "=========================="
echo ""

for pkg in sdk metadata indexer abis; do
  total=$(find "content/en/$pkg" -name "*.md" -type f | wc -l)
  echo "$pkg: $total pages migrated"
done
```

## Todo List

- [ ] Create directory structure for all packages
- [ ] Write extract-readme.ts script
- [ ] Migrate SDK installation page
- [ ] Migrate SDK quick-start page
- [ ] Migrate SDK core modules (3 pages)
- [ ] Migrate SDK React hooks page
- [ ] Migrate Metadata installation + config (2 pages)
- [ ] Migrate Metadata API reference (3 pages)
- [ ] Migrate Metadata architecture (2 pages)
- [ ] Migrate Metadata deployment (3 pages)
- [ ] Migrate Indexer getting-started (2 pages)
- [ ] Migrate Indexer domain architecture (3 pages)
- [ ] Migrate Indexer API endpoints (2 pages)
- [ ] Migrate ABIs getting-started (3 pages)
- [ ] Migrate ABIs API reference (5 pages)
- [ ] Migrate ABIs deployment (4 pages)
- [ ] Migrate ABIs security (2 pages)
- [ ] Add frontmatter to all migrated pages
- [ ] Add badges to package index pages
- [ ] Add cross-references between pages
- [ ] Run migration-progress.sh to verify
- [ ] Test all internal links
- [ ] Verify code blocks syntax highlighting

## Success Criteria

1. All 44 pages created (8 SDK + 12 Metadata + 9 Indexer + 15 ABIs)
2. Each page has proper frontmatter metadata
3. Code examples preserved with correct syntax highlighting
4. Tables render properly in Docus
5. Internal links work (/sdk/... → /metadata/...)
6. Badges display in package index pages
7. No broken links in migrated content
8. Cross-references added to related pages
9. Installation instructions accurate for each package
10. API examples functional

## Risk Assessment

**Medium Risk:**
- Code examples may need adjustment for MDC syntax → Test rendering
- Tables with complex HTML may break → Convert to markdown tables
- Badge URLs may be external images → Use UBadge components instead

**Low Risk:**
- Cross-links may break with locale prefixes → Test i18n routing
- Collapsible sections not native to Docus → Use ::collapse MDC component

**Mitigation:**
- Test one complete package (SDK) before migrating others
- Use Docus native components (::card, ::code-group) for consistency
- Validate markdown syntax with linter before committing

## Security Considerations

- Remove any API keys/secrets from code examples
- Ensure no production credentials in deployment examples
- Verify external links to official docs only

## Next Steps

After Phase 5 complete:
1. Verify all 44 pages accessible via navigation
2. Test search indexing includes all migrated content
3. Proceed to Phase 6: Navigation & Search
4. Configure advanced search filters by package
