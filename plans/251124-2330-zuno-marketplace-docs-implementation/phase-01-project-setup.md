# Phase 1: Project Setup & Configuration

**Parent Plan:** [plan.md](./plan.md)
**Dependencies:** None
**Next Phase:** [phase-02-multi-package-structure.md](./phase-02-multi-package-structure.md)

## Overview

**Date:** 2024-11-24
**Description:** Configure Nuxt 4, Docus, NuxtUI v4, TailwindCSS v4 foundation with i18n routing.
**Priority:** High
**Implementation Status:** ✅ Complete
**Review Status:** Passed

## Key Insights

- Docus i18n starter already includes @nuxtjs/i18n with en/fr locales
- nuxt.config.ts minimal (only i18n module registered)
- Missing: Docus layer, NuxtUI v4, TailwindCSS v4, proper dependencies
- Changelog template uses @nuxt/ui v4.2.1 with custom green theme

## Requirements

1. Install Docus layer package
2. Add NuxtUI v4 with TailwindCSS v4
3. Configure Docus + i18n integration
4. Setup base layout with AppLogo component
5. Add color mode toggle support
6. Configure app.config.ts for theme/branding

## Architecture

### Tech Stack
```
Nuxt 4 (framework)
├── Docus layer (docs theme)
├── @nuxtjs/i18n (localization)
├── @nuxt/ui v4 (components)
│   └── @tailwindcss v4 (styling)
├── @nuxt/content (file-based CMS)
└── @nuxtjs/mdc (markdown components)
```

### Dependencies to Install
```json
{
  "dependencies": {
    "docus": "latest",
    "@nuxt/ui": "^4.2.1",
    "@nuxtjs/mdc": "latest",
    "@iconify-json/lucide": "latest"
  }
}
```

## Related Files

- `E:\zuno-marketplace-docs\nuxt.config.ts` - Main Nuxt config
- `E:\zuno-marketplace-docs\app.config.ts` - App-level config (create)
- `E:\zuno-marketplace-docs\package.json` - Dependencies
- `C:\Users\ADMIN\Desktop\changelog-main\components\AppLogo.vue` - Logo template
- `C:\Users\ADMIN\Desktop\changelog-main\app.vue` - Layout reference

## Implementation Steps

### 1. Install Core Dependencies

```bash
cd E:\zuno-marketplace-docs
npm install docus @nuxt/ui @nuxtjs/mdc @iconify-json/lucide
```

### 2. Update nuxt.config.ts

Replace minimal config with full Docus setup:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['docus'],

  modules: [
    '@nuxtjs/i18n',
    '@nuxt/ui',
    '@nuxtjs/mdc'
  ],

  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', dir: 'ltr' },
      { code: 'fr', name: 'Français', dir: 'ltr' }
    ],
    strategy: 'prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },

  content: {
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark'
      }
    }
  },

  compatibilityDate: '2024-11-24'
})
```

### 3. Create app.config.ts

Theme configuration:

```typescript
// app.config.ts
export default defineAppConfig({
  ui: {
    primary: 'green',
    gray: 'slate'
  },

  docus: {
    title: 'Zuno Marketplace',
    description: 'Unified documentation for Zuno NFT Marketplace ecosystem',
    url: 'https://docs.zuno.com',

    socials: {
      github: 'ZunoKit/zuno-marketplace-docs'
    },

    aside: {
      level: 1,
      exclude: []
    },

    header: {
      logo: true,
      showLinkIcon: true
    },

    footer: {
      credits: {
        icon: '',
        text: 'Built with ❤️ by Zuno Team',
        href: 'https://zuno.com'
      }
    }
  }
})
```

### 4. Create Base Layout Structure

```
app/
├── components/
│   ├── AppLogo.vue
│   └── ColorModeToggle.vue
└── app.vue (optional override)
```

Copy AppLogo.vue from changelog template:

```bash
cp "C:\Users\ADMIN\Desktop\changelog-main\components\AppLogo.vue" "E:\zuno-marketplace-docs\components\AppLogo.vue"
```

### 5. Add CSS Theme Variables

Create `assets/css/main.css`:

```css
/* assets/css/main.css */
@import 'tailwindcss';

@theme {
  /* Primary color: green */
  --color-green-50: #f0fdf4;
  --color-green-500: #22c55e;
  --color-green-900: #14532d;

  /* Font family */
  --font-sans: 'Public Sans', sans-serif;
}

.dark {
  --ui-primary: var(--color-green-500);
}
```

Add to nuxt.config.ts:
```typescript
css: ['~/assets/css/main.css']
```

### 6. Configure Package Info

Update package.json:

```json
{
  "name": "zuno-marketplace-docs",
  "version": "0.1.0",
  "description": "Unified documentation for Zuno NFT Marketplace",
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview"
  }
}
```

### 7. Verify Installation

```bash
# Start dev server
npm run dev

# Should see:
# - Docus theme active
# - Color mode toggle working
# - i18n routes (/en, /fr)
# - Green primary color
```

## Todo List

- [ ] Install docus, @nuxt/ui, @nuxtjs/mdc packages
- [ ] Update nuxt.config.ts with extends: ['docus']
- [ ] Create app.config.ts with theme config
- [ ] Copy AppLogo.vue from changelog template
- [ ] Create assets/css/main.css with TailwindCSS v4 theme
- [ ] Add css import to nuxt.config.ts
- [ ] Update package.json scripts and metadata
- [ ] Test dev server (npm run dev)
- [ ] Verify color mode toggle works
- [ ] Verify i18n routes (/en, /fr) accessible

## Success Criteria

1. `npm run dev` starts without errors
2. Navigate to http://localhost:3000/en shows Docus theme
3. Color mode toggle switches dark/light
4. AppLogo displays in header
5. Green primary color visible in UI
6. French route (/fr) redirects properly
7. No console errors in browser

## Risk Assessment

**Low Risk:**
- Docus layer may conflict with existing i18n setup → Test routing after install
- TailwindCSS v4 syntax different from v3 → Use @theme directive only
- NuxtUI v4 breaking changes → Follow changelog template patterns exactly

**Mitigation:**
- Keep minimal nuxt.config.ts, let Docus handle defaults
- Reference changelog template for proven NuxtUI v4 patterns
- Test i18n routing explicitly before Phase 2

## Security Considerations

- None (static site, no auth/API keys)
- Ensure no sensitive data in app.config.ts
- Keep package versions up-to-date

## Completion Notes

**Decision:** Removed Docus dependency due to better-sqlite3 build blocker. Implemented custom layout instead using Nuxt 4 + NuxtUI v4 directly.

**Key Achievements:**
- Removed Docus, resolved dependency conflicts
- Built custom layout with NuxtUI v4 components
- TailwindCSS v4 configured with green theme
- i18n routing operational (en/fr)
- AppLogo and navigation components in place
- Dev server verified working
- Build succeeds without errors
- All changes committed to git (develop-claude branch)

**Verification Complete:**
- npm run dev → Server starts, no errors
- Routes accessible: /en, /fr, /en/docs
- Color mode toggle functional
- Green primary theme applied
- i18n language switching operational
- Build: npm run build → Success

## Next Steps

Proceed to Phase 2: Multi-Package Structure
1. Create content/ directory structure for sdk/, metadata/, indexer/, abis/
2. Implement package switcher component
3. Configure cross-linking patterns
