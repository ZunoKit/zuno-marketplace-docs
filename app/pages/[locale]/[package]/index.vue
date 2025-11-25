<template>
  <div>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-gray-400" />
    </div>

    <div v-else-if="error" class="text-red-600 dark:text-red-400">
      <p>Error loading content: {{ error }}</p>
    </div>

    <div v-else>
      <!-- LLM Features Header -->
      <div class="flex items-center justify-end gap-2 mb-6">
        <LLMLLMBadge :token-estimate="tokenEstimate" :scope="frontmatter.scope" />
        <LLMCopyForLLM :markdown="rawMarkdown" />
      </div>

      <!-- Content -->
      <div class="prose dark:prose-invert max-w-none">
        <MDCRenderer :body="markdown" :data="{}" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { parseMarkdown } from '@nuxtjs/mdc/runtime'

const route = useRoute()
const { locale } = useI18n()
const pkg = computed(() => route.params.package as string)

const markdown = ref<any>(null)
const rawMarkdown = ref<string>('')
const frontmatter = ref<Record<string, any>>({})
const tokenEstimate = ref<number>(0)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const path = `/content/en/${pkg.value}/index.md`
    const response = await fetch(path)

    if (!response.ok) {
      throw new Error(`Content not found: ${path}`)
    }

    const content = await response.text()
    rawMarkdown.value = content

    const parsed = await parseMarkdown(content)
    markdown.value = parsed.body
    frontmatter.value = parsed.data || {}
    tokenEstimate.value = frontmatter.value.tokenEstimate || 0
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
