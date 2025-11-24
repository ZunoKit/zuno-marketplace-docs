import { ref } from 'vue'
import { parseMarkdown } from '@nuxtjs/mdc/runtime'

export async function useMarkdown(path: string) {
  const content = ref('')
  const error = ref(null)
  const loading = ref(true)

  try {
    // Load markdown file from content directory
    const response = await fetch(`/content${path}.md`)
    if (!response.ok) {
      throw new Error(`Failed to load markdown: ${response.statusText}`)
    }

    const markdown = await response.text()
    const parsed = await parseMarkdown(markdown)
    content.value = parsed.body
    loading.value = false
  } catch (e: any) {
    error.value = e.message
    loading.value = false
  }

  return {
    content,
    error,
    loading
  }
}
