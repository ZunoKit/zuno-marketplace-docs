<template>
  <nav class="breadcrumb-nav">
    <ol class="flex items-center space-x-2 text-sm">
      <!-- Home -->
      <li>
        <UButton
          to="/"
          variant="ghost"
          size="xs"
          color="gray"
        >
          <UIcon name="i-heroicons-home" class="w-4 h-4" />
          Home
        </UButton>
      </li>

      <!-- Package -->
      <li v-if="currentPackage">
        <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400" />
        <UButton
          :to="`/${currentPackage}`"
          variant="ghost"
          size="xs"
          :color="currentPackageColor"
        >
          <UIcon :name="currentPackageIcon" class="w-4 h-4" />
          {{ currentPackage.toUpperCase() }}
        </UButton>
      </li>

      <!-- Category -->
      <li v-if="currentCategory">
        <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400" />
        <span class="text-gray-600 dark:text-gray-400">
          {{ formatCategory(currentCategory) }}
        </span>
      </li>

      <!-- Current Page -->
      <li v-if="currentPage && currentPage !== 'index'">
        <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400" />
        <span class="text-gray-900 dark:text-gray-100 font-medium">
          {{ formatPageTitle(currentPage) }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const appConfig = useAppConfig()

// Parse current route to extract package and category
const currentPackage = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  // Format: /sdk/... or /metadata/...
  return segments[0] || null
})

const currentCategory = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  // Format: /sdk/getting-started/...
  if (segments[1]) {
    return segments[1]
  }
  return null
})

const currentPage = computed(() => {
  const segments = route.path.split('/')
  return segments[segments.length - 1]?.replace('.md', '') || ''
})

// Get package configuration
const packageConfig = computed(() => {
  if (!currentPackage.value) return null
  return (appConfig.packages as any[])?.find(
    pkg => pkg.name.toLowerCase() === currentPackage.value?.toLowerCase()
  )
})

const currentPackageIcon = computed(() => {
  return packageConfig.value?.icon || 'i-heroicons-folder'
})

const currentPackageColor = computed(() => {
  return packageConfig.value?.color || 'gray'
})

// Format category names for display
const formatCategory = (category: string) => {
  return category
    .replace(/^\d+\./, '') // Remove leading numbers
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Format page titles
const formatPageTitle = (page: string) => {
  return page
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>

<style scoped>
.breadcrumb-nav {
  @apply py-2 px-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700;
}
</style>