# Phase 4: LLM-Friendly Features

**Parent Plan:** [plan.md](./plan.md)
**Dependencies:** [phase-03-changelog-integration.md](./phase-03-changelog-integration.md)
**Next Phase:** [phase-05-content-migration.md](./phase-05-content-migration.md)
**References:** [researcher-02-llm-features.md](./research/researcher-02-llm-features.md)

## Overview

**Date:** 2024-11-24
**Description:** Implement LLM-optimized markdown export with "Copy for LLM" button and metadata standards.
**Priority:** Medium
**Implementation Status:** ⏳ Pending
**Review Status:** Not Started

## Key Insights

- Markdown 15-16% more token efficient than JSON/HTML
- Structured headings + clear chunks = 20-30% token reduction
- Frontmatter metadata enables better LLM context understanding
- @vueuse/core provides clipboard API with reactivity
- Strip UI elements but preserve semantic markdown structure
- Token estimates help LLMs allocate context window

## Requirements

1. Add YAML frontmatter schema to all markdown files
2. Implement CopyForLLM.vue button component
3. Build markdown optimization pipeline (strip UI, preserve structure)
4. Add token estimation hints
5. Include metadata in copied content
6. Show toast feedback on copy
7. Display "LLM-optimized" badge

## Architecture

### Metadata Schema (YAML Frontmatter)

```yaml
---
# Identity
title: "Page Title"
package: "sdk" | "metadata" | "indexer" | "abis"
version: "1.1.4"

# Tracking
lastUpdated: "2024-11-24"
changeFrequency: "weekly" | "monthly" | "stable"

# LLM Hints
scope: "api-reference" | "guide" | "example" | "architecture"
context: "standalone" | "requires-auth" | "blockchain-specific"
complexity: "beginner" | "intermediate" | "advanced"
tokenEstimate: 450

# Organization
category: "installation" | "configuration" | "deployment"
relatedTopics:
  - "topic-1"
  - "topic-2"
---
```

### Component Architecture

```
components/
└── llm/
    ├── CopyForLLM.vue (button component)
    ├── LLMBadge.vue (optimization indicator)
    └── composables/
        └── useMarkdownOptimizer.ts (processing logic)
```

### Processing Pipeline

```
Raw Markdown Content
  ↓
Extract Frontmatter (preserve)
  ↓
Strip UI Elements (::card, ::callout, etc.)
  ↓
Preserve Code Blocks & Headings
  ↓
Add LLM Consumption Hints
  ↓
Combine with Frontmatter
  ↓
Copy to Clipboard
```

## Related Files

- `E:\zuno-marketplace-docs\content\en\**\*.md` - All markdown content
- `E:\zuno-marketplace-docs\composables\useMarkdownOptimizer.ts` - Processing logic
- `E:\zuno-marketplace-docs\components\llm\CopyForLLM.vue` - Button UI

## Implementation Steps

### 1. Install @vueuse/core

```bash
cd E:\zuno-marketplace-docs
npm install @vueuse/core
```

### 2. Create Markdown Optimizer Composable

```typescript
// composables/useMarkdownOptimizer.ts
import { parse } from 'yaml'

interface OptimizedMarkdown {
  content: string
  metadata: Record<string, any>
  tokenEstimate: number
}

export function useMarkdownOptimizer() {
  /**
   * Extract frontmatter from markdown
   */
  function extractFrontmatter(markdown: string) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/
    const match = markdown.match(frontmatterRegex)

    if (!match) {
      return { frontmatter: {}, body: markdown }
    }

    const frontmatter = parse(match[1])
    const body = markdown.slice(match[0].length)

    return { frontmatter, body }
  }

  /**
   * Strip UI components while preserving semantic markdown
   */
  function stripUIElements(markdown: string): string {
    return markdown
      // Remove Vue component blocks (::card, ::callout, etc.)
      .replace(/::[\w-]+{[^}]*}\n/g, '')
      .replace(/::[\w-]+\n/g, '')
      .replace(/  ::/g, '')

      // Remove HTML tags
      .replace(/<[^>]+>/g, '')

      // Normalize whitespace
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }

  /**
   * Estimate token count (rough approximation)
   */
  function estimateTokens(text: string): number {
    // Rough estimate: ~4 chars per token for English
    return Math.ceil(text.length / 4)
  }

  /**
   * Optimize markdown for LLM consumption
   */
  function optimizeForLLM(rawMarkdown: string): OptimizedMarkdown {
    const { frontmatter, body } = extractFrontmatter(rawMarkdown)
    const cleanedBody = stripUIElements(body)

    // Add LLM consumption hints as comments
    const hints = [
      '<!-- LLM-Optimized Documentation -->',
      `<!-- Package: ${frontmatter.package || 'unknown'} -->`,
      `<!-- Scope: ${frontmatter.scope || 'general'} -->`,
      `<!-- Complexity: ${frontmatter.complexity || 'intermediate'} -->`,
      ''
    ].join('\n')

    const optimizedContent = [
      '---',
      Object.entries(frontmatter)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}:\n${value.map(v => `  - ${v}`).join('\n')}`
          }
          return `${key}: ${JSON.stringify(value)}`
        })
        .join('\n'),
      '---',
      '',
      hints,
      cleanedBody
    ].join('\n')

    return {
      content: optimizedContent,
      metadata: frontmatter,
      tokenEstimate: estimateTokens(optimizedContent)
    }
  }

  return {
    extractFrontmatter,
    stripUIElements,
    estimateTokens,
    optimizeForLLM
  }
}
```

### 3. Create CopyForLLM Button Component

```vue
<!-- components/llm/CopyForLLM.vue -->
<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

interface Props {
  markdown: string
  showToast?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showToast: true
})

const { copy, copied } = useClipboard()
const { optimizeForLLM } = useMarkdownOptimizer()
const toast = useToast()

async function copyOptimized() {
  const optimized = optimizeForLLM(props.markdown)

  await copy(optimized.content)

  if (props.showToast && toast) {
    toast.add({
      title: 'Copied to clipboard',
      description: `${optimized.tokenEstimate} tokens (${optimized.metadata.scope || 'general'} context)`,
      icon: 'i-heroicons-check-circle',
      color: 'green',
      timeout: 3000
    })
  }
}
</script>

<template>
  <UButton
    :icon="copied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'"
    :color="copied ? 'green' : 'gray'"
    :variant="copied ? 'solid' : 'outline'"
    size="sm"
    @click="copyOptimized"
  >
    {{ copied ? 'Copied!' : 'Copy for LLM' }}
  </UButton>
</template>
```

### 4. Create LLM Badge Component

```vue
<!-- components/llm/LLMBadge.vue -->
<script setup lang="ts">
interface Props {
  tokenEstimate?: number
  scope?: string
}

const props = defineProps<Props>()
</script>

<template>
  <UBadge
    color="green"
    variant="subtle"
    size="sm"
  >
    <UIcon name="i-heroicons-sparkles" class="w-3 h-3 mr-1" />
    LLM-Optimized
    <span v-if="tokenEstimate" class="ml-1 opacity-70">
      (~{{ tokenEstimate }} tokens)
    </span>
  </UBadge>
</template>
```

### 5. Add Frontmatter to Content Files

Update all markdown files with metadata. Example (content/en/sdk/getting-started/installation.md):

```markdown
---
title: "SDK Installation"
package: "sdk"
version: "1.1.4"
lastUpdated: "2024-11-24"
changeFrequency: "monthly"
scope: "guide"
context: "standalone"
complexity: "beginner"
tokenEstimate: 350
category: "installation"
relatedTopics:
  - "quick-start"
  - "configuration"
---

# SDK Installation

Get started with the Zuno Marketplace SDK...
```

Create template script to add frontmatter:

```bash
# scripts/add-frontmatter.sh
#!/bin/bash

# Add frontmatter to all markdown files
find content/en -name "*.md" -type f | while read file; do
  if ! grep -q "^---" "$file"; then
    echo "Adding frontmatter to $file"
    # Prepend frontmatter template
    cat > temp.md << EOF
---
title: "$(basename "$file" .md)"
package: "$(echo "$file" | cut -d'/' -f3)"
lastUpdated: "$(date +%Y-%m-%d)"
scope: "guide"
complexity: "intermediate"
---

EOF
    cat "$file" >> temp.md
    mv temp.md "$file"
  fi
done
```

### 6. Integrate CopyForLLM into Page Layouts

Add to Docus layout or create custom slot:

```vue
<!-- components/content/ProseCode.vue (override) -->
<script setup>
const { markdown } = useContent()
</script>

<template>
  <div class="relative group">
    <!-- Page header actions -->
    <div class="flex items-center gap-2 mb-4">
      <LLMLLMBadge
        :token-estimate="markdown?.tokenEstimate"
        :scope="markdown?.scope"
      />
      <CopyForLLM :markdown="markdown?.body" />
    </div>

    <!-- Original content -->
    <slot />
  </div>
</template>
```

Or add to app.vue:

```vue
<!-- app.vue -->
<template>
  <UApp>
    <UPageSection>
      <div class="max-w-4xl mx-auto">
        <!-- Header actions bar -->
        <div v-if="page" class="flex justify-end items-center gap-2 mb-6">
          <LLMLLMBadge
            :token-estimate="page.tokenEstimate"
            :scope="page.scope"
          />
          <LLMCopyForLLM :markdown="page.body" />
        </div>

        <NuxtPage />
      </div>
    </UPageSection>
  </UApp>
</template>

<script setup>
const { page } = useContent()
</script>
```

### 7. Add Toast Configuration

Update app.config.ts:

```typescript
export default defineAppConfig({
  // ... existing config

  ui: {
    notifications: {
      position: 'top-right'
    }
  }
})
```

### 8. Test LLM Export

Manual test script:

```typescript
// test-llm-export.ts
import { useMarkdownOptimizer } from './composables/useMarkdownOptimizer'

const sampleMarkdown = `
---
title: "Test Page"
package: "sdk"
scope: "guide"
---

# Test Page

::card
Sample card content
::

This is **regular** markdown.

\`\`\`typescript
const code = 'preserved'
\`\`\`
`

const { optimizeForLLM } = useMarkdownOptimizer()
const result = optimizeForLLM(sampleMarkdown)

console.log('Optimized:', result.content)
console.log('Tokens:', result.tokenEstimate)
```

## Todo List

- [ ] Install @vueuse/core package
- [ ] Create composables/useMarkdownOptimizer.ts
- [ ] Implement extractFrontmatter function
- [ ] Implement stripUIElements function
- [ ] Implement estimateTokens function
- [ ] Implement optimizeForLLM function
- [ ] Create components/llm/CopyForLLM.vue
- [ ] Create components/llm/LLMBadge.vue
- [ ] Add frontmatter template to all markdown files
- [ ] Create add-frontmatter.sh script
- [ ] Integrate CopyForLLM into page layouts
- [ ] Configure toast notifications in app.config.ts
- [ ] Test clipboard copy functionality
- [ ] Test markdown optimization pipeline
- [ ] Verify token estimation accuracy
- [ ] Test on multiple content types (guides, API refs, examples)

## Success Criteria

1. "Copy for LLM" button visible on all doc pages
2. Button copies optimized markdown to clipboard
3. Toast shows token estimate and scope
4. UI components stripped from output
5. Frontmatter preserved in copied content
6. Code blocks remain intact
7. Headings preserved for structure
8. LLM badge displays token estimate
9. Button state updates on copy (checkmark)
10. Works on mobile devices

## Risk Assessment

**Low Risk:**
- Token estimation inaccurate → Use rough 4 chars/token heuristic (acceptable)
- UI stripping too aggressive → Test with varied content, adjust regex
- Clipboard API blocked → @vueuse/core handles fallback

**Medium Risk:**
- Frontmatter YAML parsing fails → Add try-catch, fallback to no metadata
- Toast library not available → Make toast optional with showToast prop

**Mitigation:**
- Test stripUIElements with diverse Docus component syntax
- Add comprehensive error handling in useMarkdownOptimizer
- Provide graceful degradation if toast unavailable

## Security Considerations

- No sensitive data in frontmatter (public docs)
- Clipboard API requires user interaction (secure by default)
- YAML parsing limited to trusted content (no user input)

## Next Steps

After Phase 4 complete:
1. Test LLM export with actual LLM tools (ChatGPT, Claude)
2. Gather feedback on token estimates accuracy
3. Proceed to Phase 5: Content Migration
4. Extract and migrate package README content
