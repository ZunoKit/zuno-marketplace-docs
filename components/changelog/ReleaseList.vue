<template>
  <div>
    <div v-if="pending" class="text-center py-12">
      <UIcon name="i-lucide-loader-2" class="animate-spin w-8 h-8 text-gray-400" />
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading releases...</p>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <UIcon name="i-lucide-alert-triangle" class="w-8 h-8 text-red-500" />
      <p class="mt-4 text-red-600 dark:text-red-400">Failed to load releases</p>
      <p class="text-sm text-gray-500 mt-2">{{ error }}</p>
    </div>

    <div v-else-if="!versions || versions.length === 0" class="text-center py-12">
      <UIcon name="i-lucide-inbox" class="w-8 h-8 text-gray-400" />
      <p class="mt-4 text-gray-600 dark:text-gray-400">No releases yet</p>
    </div>

    <div v-else class="space-y-8">
      <div
        v-for="version in versions"
        :key="version.tag"
        class="border border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
      >
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ version.title }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ formatDate(version.date) }}
            </p>
          </div>
          <UBadge color="green" variant="subtle">
            {{ version.tag }}
          </UBadge>
        </div>

        <div class="prose dark:prose-invert max-w-none">
          <MDCRenderer v-if="version.markdown" :body="parsedMarkdown[version.tag]" :data="{}" />
          <p v-else class="text-gray-600 dark:text-gray-400">No release notes available.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { parseMarkdown } from '@nuxtjs/mdc/runtime'

interface Props {
  repository: string
}

const props = defineProps<Props>()

const versions = ref<any[]>([])
const parsedMarkdown = ref<Record<string, any>>({})
const pending = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const response = await fetch(`https://ungh.cc/repos/${props.repository}/releases`)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.releases || !Array.isArray(data.releases)) {
      throw new Error('Invalid response format')
    }

    versions.value = data.releases.map((release: any) => ({
      tag: release.tag,
      title: release.name || release.tag,
      date: release.publishedAt || release.createdAt,
      markdown: release.markdown || release.body || ''
    }))

    // Parse markdown for each release
    for (const version of versions.value) {
      if (version.markdown) {
        const parsed = await parseMarkdown(version.markdown)
        parsedMarkdown.value[version.tag] = parsed.body
      }
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to fetch releases'
  } finally {
    pending.value = false
  }
})

function formatDate(dateString: string) {
  if (!dateString) return 'Unknown date'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
