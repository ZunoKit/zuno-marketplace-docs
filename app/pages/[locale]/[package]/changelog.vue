<template>
  <div class="relative min-h-screen">
    <!-- Animated background -->
    <SkyBg
      :star-count="50"
      color="green"
      speed="normal"
      class="absolute inset-0 pointer-events-none z-[-1]"
    />

    <div class="py-12">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-12 text-center">
          <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {{ packageInfo?.label }} Changelog
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Track updates, new features, and bug fixes for {{ packageInfo?.label }}
          </p>
        </div>

        <!-- Release list -->
        <ChangelogReleaseList v-if="repository" :repository="repository" />
        <div v-else class="text-center py-12 text-red-600">
          Package not found
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getPackage } from '~/config/packages'

const route = useRoute()
const appConfig = useAppConfig()

const pkg = computed(() => route.params.package as string)
const packageInfo = computed(() => pkg.value ? getPackage(pkg.value) : null)
const repository = computed(() => {
  const pkgId = pkg.value
  return appConfig.repositories[pkgId as keyof typeof appConfig.repositories]
})

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: () => `${packageInfo.value?.label || 'Package'} Changelog`,
  description: () => `Release history for Zuno Marketplace ${packageInfo.value?.label}`,
  ogTitle: () => `${packageInfo.value?.label} Changelog | Zuno Marketplace`,
  ogDescription: () => `Track updates and new features for ${packageInfo.value?.label}`
})
</script>
