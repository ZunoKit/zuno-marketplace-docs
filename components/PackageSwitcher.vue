<template>
  <div class="flex items-center gap-2 overflow-x-auto">
    <UButton
      v-for="pkg in packages"
      :key="pkg.id"
      :to="`/${locale}/${pkg.id}`"
      :color="currentPackage === pkg.id ? 'primary' : 'gray'"
      :variant="currentPackage === pkg.id ? 'solid' : 'ghost'"
      size="sm"
    >
      <template #leading>
        <UIcon :name="pkg.icon" class="w-4 h-4" />
      </template>
      {{ pkg.label }}
      <UBadge v-if="pkg.version" size="xs" color="green" variant="subtle" class="ml-2">
        {{ pkg.version }}
      </UBadge>
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getAllPackages } from '@/app/config/packages'

const route = useRoute()
const { locale } = useI18n()

const packages = getAllPackages()

const currentPackage = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  // Format: /en/sdk/... or /fr/abis/...
  return pathSegments[1] || null
})
</script>
