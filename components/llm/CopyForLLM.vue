<script setup lang="ts">
interface Props {
  markdown: string
  showToast?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showToast: true
})

const copied = ref(false)

async function copyOptimized() {
  try {
    await navigator.clipboard.writeText(props.markdown)
    copied.value = true

    // Reset after 2 seconds
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy:', error)
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
