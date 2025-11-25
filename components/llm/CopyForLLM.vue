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
  try {
    const optimized = optimizeForLLM(props.markdown)

    await copy(optimized.content)

    if (props.showToast && toast) {
      toast.add({
        title: 'Copied to clipboard',
        description: `${optimized.tokenEstimate} tokens (${optimized.metadata.scope || 'general'} context)`,
        icon: 'i-lucide-check-circle',
        color: 'green'
      })
    }
  } catch (error) {
    console.error('Failed to copy:', error)
    if (props.showToast && toast) {
      toast.add({
        title: 'Copy failed',
        description: 'Please try again',
        icon: 'i-lucide-alert-circle',
        color: 'red'
      })
    }
  }
}
</script>

<template>
  <UButton
    :icon="copied ? 'i-lucide-check' : 'i-lucide-clipboard'"
    :color="copied ? 'green' : 'gray'"
    :variant="copied ? 'solid' : 'outline'"
    size="sm"
    @click="copyOptimized"
  >
    {{ copied ? 'Copied!' : 'Copy for LLM' }}
  </UButton>
</template>
