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

const route = useRoute()
const { $i18n } = useNuxtApp()
const appConfig = useAppConfig()

// Get packages from app config
const packages = computed(() => (appConfig as any).packages || [])

const currentPackage = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  // Format: /en/sdk/... or /fr/abis/...
  return pathSegments[1] || null
})

const locale = computed(() => $i18n.locale)
</script>
