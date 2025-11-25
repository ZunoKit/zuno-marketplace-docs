<template>
  <div class="documentation-search">
    <UInput
      v-model="searchQuery"
      :placeholder="placeholder"
      icon="i-heroicons-magnifying-glass"
      size="lg"
      autocomplete="off"
      @focus="showResults = true"
      @blur="handleBlur"
      @keydown.escape="clearSearch"
    />

    <!-- Search Results Dropdown -->
    <div
      v-if="showResults && (searchQuery || recentSearches.length > 0)"
      class="search-results"
    >
      <!-- Loading State -->
      <div v-if="isLoading" class="p-4 text-center">
        <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
        <span class="ml-2 text-sm text-gray-600">Searching...</span>
      </div>

      <!-- Results -->
      <div v-else-if="searchResults.length > 0" class="search-results-list">
        <!-- Package Headers -->
        <template v-for="pkg in groupedResults" :key="pkg.name">
          <div class="package-header">
            <UIcon :name="pkg.icon" class="w-4 h-4" />
            <UBadge :color="pkg.color" variant="soft" size="xs">
              {{ pkg.name }}
            </UBadge>
            <span class="text-xs text-gray-500">{{ pkg.count }} results</span>
          </div>

          <!-- Package Results -->
          <NuxtLink
            v-for="result in pkg.results"
            :key="result.id"
            :to="result.path"
            class="search-result-item"
            @click="clearSearch"
          >
            <div class="result-content">
              <div class="result-title">{{ result.title }}</div>
              <div class="result-path">{{ result.path }}</div>
              <div v-if="result.description" class="result-description">
                {{ result.description }}
              </div>
            </div>
            <UBadge
              v-if="result.complexity"
              :color="getComplexityColor(result.complexity)"
              variant="subtle"
              size="xs"
            >
              {{ result.complexity }}
            </UBadge>
          </NuxtLink>
        </template>
      </div>

      <!-- No Results -->
      <div v-else-if="searchQuery && !isLoading" class="p-4 text-center">
        <UIcon name="i-heroicons-document-magnifying-glass" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p class="text-sm text-gray-600">No results found for "{{ searchQuery }}"</p>
        <p class="text-xs text-gray-500 mt-1">Try different keywords or browse packages</p>
      </div>

      <!-- Recent Searches -->
      <div v-else-if="recentSearches.length > 0" class="recent-searches">
        <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <span class="text-xs font-medium text-gray-600">Recent searches</span>
        </div>
        <div class="recent-search-list">
          <button
            v-for="search in recentSearches"
            :key="search"
            class="recent-search-item"
            @click="selectRecentSearch(search)"
          >
            <UIcon name="i-heroicons-clock" class="w-4 h-4" />
            <span>{{ search }}</span>
          </button>
        </div>
      </div>

      <!-- Quick Links -->
      <div v-else class="quick-links">
        <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <span class="text-xs font-medium text-gray-600">Popular pages</span>
        </div>
        <div class="quick-links-list">
          <NuxtLink
            v-for="link in popularPages"
            :key="link.path"
            :to="link.path"
            class="quick-link-item"
            @click="clearSearch"
          >
            <UIcon :name="link.icon" class="w-4 h-4" />
            <div>
              <div class="font-medium">{{ link.title }}</div>
              <div class="text-xs text-gray-500">{{ link.package }}</div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SearchResult {
  id: string
  title: string
  path: string
  description?: string
  package: string
  complexity?: string
  keywords?: string[]
}

interface GroupedResult {
  name: string
  icon: string
  color: string
  count: number
  results: SearchResult[]
}

const props = defineProps<{
  placeholder?: string
}>()

const appConfig = useAppConfig()
const searchQuery = ref('')
const showResults = ref(false)
const isLoading = ref(false)
const searchResults = ref<SearchResult[]>([])
const recentSearches = ref<string[]>([])

const placeholder = computed(() => props.placeholder || appConfig.navigation?.searchPlaceholder || 'Search documentation...')

// Popular pages for quick access
const popularPages = [
  {
    title: 'SDK Installation',
    path: '/en/sdk/getting-started/installation',
    package: 'SDK',
    icon: 'i-heroicons-code-bracket'
  },
  {
    title: 'Metadata API Reference',
    path: '/en/metadata/api-reference/metadata-endpoints',
    package: 'Metadata',
    icon: 'i-heroicons-server-stack'
  },
  {
    title: 'Event-First Architecture',
    path: '/en/indexer/domain-architecture/event-first',
    package: 'Indexer',
    icon: 'i-heroicons-circle-stack'
  },
  {
    title: 'ABIs Installation',
    path: '/en/abis/getting-started/installation',
    package: 'ABIs',
    icon: 'i-heroicons-globe-americas'
  }
]

// Group results by package
const groupedResults = computed((): GroupedResult[] => {
  const packages = appConfig.packages as any[]

  return packages.map(pkg => {
    const pkgResults = searchResults.value.filter(result =>
      result.package.toLowerCase() === pkg.name.toLowerCase()
    )

    return {
      name: pkg.name,
      icon: pkg.icon,
      color: pkg.color,
      count: pkgResults.length,
      results: pkgResults.slice(0, 5) // Limit to 5 results per package
    }
  }).filter(group => group.results.length > 0)
})

// Search functionality
const performSearch = async (query: string) => {
  if (!query.trim()) {
    searchResults.value = []
    return
  }

  isLoading.value = true

  // Simulate search delay for better UX
  await new Promise(resolve => setTimeout(resolve, 200))

  try {
    // In a real implementation, this would hit a search API
    // For now, we'll create mock results based on the query
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: `${query} - Installation Guide`,
        path: '/en/sdk/getting-started/installation',
        description: 'Learn how to install and configure the SDK',
        package: 'SDK',
        complexity: 'beginner'
      },
      {
        id: '2',
        title: `${query} - API Reference`,
        path: '/en/metadata/api-reference/metadata-endpoints',
        description: 'Complete API documentation for metadata management',
        package: 'Metadata',
        complexity: 'intermediate'
      }
    ]

    searchResults.value = mockResults

    // Add to recent searches
    if (query && !recentSearches.value.includes(query)) {
      recentSearches.value.unshift(query)
      if (recentSearches.value.length > 5) {
        recentSearches.value = recentSearches.value.slice(0, 5)
      }
    }
  } catch (error) {
    console.error('Search error:', error)
  } finally {
    isLoading.value = false
  }
}

// Watch for search query changes
watch(searchQuery, (newQuery) => {
  if (newQuery.trim()) {
    performSearch(newQuery)
  } else {
    searchResults.value = []
  }
})

const selectRecentSearch = (search: string) => {
  searchQuery.value = search
  performSearch(search)
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  showResults.value = false
}

const handleBlur = () => {
  // Delay hiding results to allow clicking on results
  setTimeout(() => {
    showResults.value = false
  }, 200)
}

const getComplexityColor = (complexity: string) => {
  switch (complexity.toLowerCase()) {
    case 'beginner': return 'green'
    case 'intermediate': return 'yellow'
    case 'advanced': return 'red'
    default: return 'gray'
  }
}
</script>

<style scoped>
.documentation-search {
  @apply relative;
}

.search-results {
  @apply absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto;
}

.package-header {
  @apply flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600;
  @apply text-sm font-medium text-gray-900 dark:text-gray-100;
}

.search-result-item {
  @apply flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors;
  @apply border-b border-gray-100 dark:border-gray-700 last:border-b-0;
}

.result-content {
  @apply flex-1 min-w-0;
}

.result-title {
  @apply font-medium text-gray-900 dark:text-gray-100 truncate;
}

.result-path {
  @apply text-xs text-gray-500 dark:text-gray-400 truncate;
}

.result-description {
  @apply text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2;
}

.recent-searches,
.quick-links {
  @apply py-2;
}

.recent-search-item,
.quick-link-item {
  @apply flex items-center gap-3 w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors;
  @apply text-sm text-gray-700 dark:text-gray-300;
}

.recent-searches .px-4,
.quick-links .px-4 {
  @apply uppercase tracking-wide;
}
</style>