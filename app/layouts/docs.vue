<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const route = useRoute()

// Define sections with full configuration
const sections = [
  { label: 'zuno-marketplace-sdk', value: 'sdk' },
  { label: 'zuno-marketplace-indexer', value: 'indexer' },
  { label: 'zuno-marketplace-abis', value: 'abis' },
  { label: 'zuno-marketplace-metadata', value: 'metadata' }
]

// For display in select - using full object
const sectionOptions = computed(() => sections)

// Auto-detect current section from route or default to SDK
const getCurrentSection = () => {
  const path = route.path
  if (path.includes('/indexer')) return 'indexer'
  if (path.includes('/abis')) return 'abis'
  if (path.includes('/metadata')) return 'metadata'
  return 'sdk'
}

const selectedSection = ref(getCurrentSection())

// Get current section object for USelectMenu
const selectedSectionObject = computed({
  get: () => sections.find(s => s.value === selectedSection.value) || sections[0],
  set: (newSection) => {
    selectedSection.value = newSection.value
    onSectionChange(newSection.value)
  }
})

// Get current section label for display
const selectedLabel = computed(() => {
  const section = sections.find(s => s.value === selectedSection.value)
  return section?.label || 'zuno-marketplace-sdk'
})

// Watch route changes to update selected section
watch(() => route.path, () => {
  selectedSection.value = getCurrentSection()
})

// Filter navigation based on selected section
const filteredNavigation = computed(() => {
  if (!navigation?.value) return []

  // Find the navigation item that matches the selected section by stem
  const sectionNav = navigation.value.find(item =>
    item.stem === selectedSection.value
  )

  // Return only the children (index pages are now hidden via navigation: false in frontmatter)
  return sectionNav?.children || []
})

// Navigate when section changes
const onSectionChange = (value: string) => {
  selectedSection.value = value
  navigateTo(`/${value}`)
}
</script>

<template>
  <UContainer>
    <UPage>
      <template #left>
        <UPageAside>
          <USelectMenu
            v-model="selectedSection"
            :items="sections"
            value-key="value"
            class="mb-4"
            @update:model-value="onSectionChange"
          />

          <UContentNavigation
            highlight
            :navigation="filteredNavigation"
          />
        </UPageAside>
      </template>

      <slot />
    </UPage>
  </UContainer>
</template>
