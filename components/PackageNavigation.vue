<template>
  <aside v-if="packageInfo" class="w-64 border-r border-gray-200 dark:border-gray-800 h-full overflow-y-auto p-4">
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {{ packageInfo.label }}
      </h2>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ packageInfo.description }}
      </p>
    </div>

    <nav class="space-y-6">
      <div v-for="section in packageInfo.navigation" :key="section.title" class="space-y-2">
        <div class="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          <UIcon v-if="section.icon" :name="section.icon" class="w-4 h-4" />
          {{ section.title }}
          <UBadge v-if="section.badge" size="xs" color="green" variant="subtle">
            {{ section.badge }}
          </UBadge>
        </div>
        <ul class="space-y-1">
          <li v-for="item in section.items" :key="item.to">
            <UButton
              :to="item.to"
              :color="isActive(item.to) ? 'primary' : 'gray'"
              :variant="isActive(item.to) ? 'soft' : 'ghost'"
              block
              justify="start"
              size="sm"
            >
              <template v-if="item.icon" #leading>
                <UIcon :name="item.icon" class="w-4 h-4" />
              </template>
              {{ item.title }}
            </UButton>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const appConfig = useAppConfig()

const currentPackage = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  // Format: /sdk/... or /metadata/...
  return pathSegments[0] || null
})

const packageInfo = computed(() => {
  if (!currentPackage.value) return null

  const packages = (appConfig as any).packages || []
  return packages.find((pkg: any) =>
    pkg.name.toLowerCase() === currentPackage.value?.toLowerCase()
  ) || null
})

function isActive(to: string) {
  return route.path.includes(to)
}
</script>
