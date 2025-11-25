<script setup lang="ts">
interface Props {
  tokenEstimate?: number
  scope?: string
}

const props = defineProps<Props>()
</script>

<template>
  <UBadge
    color="green"
    variant="subtle"
    size="sm"
  >
    <UIcon name="i-lucide-sparkles" class="w-3 h-3 mr-1" />
    LLM-Optimized
    <span v-if="tokenEstimate" class="ml-1 opacity-70">
      (~{{ tokenEstimate }} tokens)
    </span>
  </UBadge>
</template>
