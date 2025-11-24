<template>
  <div>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-gray-400" />
    </div>

    <div v-else-if="error" class="text-red-600 dark:text-red-400">
      <p>Error loading content: {{ error }}</p>
      <p class="text-sm mt-2">Path: {{ fullPath }}</p>
    </div>

    <div v-else class="prose dark:prose-invert max-w-none">
      <MDCRenderer v-if="markdown" :body="markdown" :data="{}" />
      <p v-else>Content not available yet. Check back soon!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { parseMarkdown } from '@nuxtjs/mdc/runtime'

const route = useRoute()
const { locale } = useI18n()

const pkg = computed(() => route.params.package as string)
const slug = computed(() => {
  const slugParam = route.params.slug
  return Array.isArray(slugParam) ? slugParam.join('/') : slugParam
})

const fullPath = computed(() => `/content/en/${pkg.value}/${slug.value}.md`)

const markdown = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const response = await fetch(fullPath.value)

    if (!response.ok) {
      throw new Error(`Content not found`)
    }

    const content = await response.text()
    const parsed = await parseMarkdown(content)
    markdown.value = parsed.body
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

definePageMeta({
  layout: 'default'
})
</script>
