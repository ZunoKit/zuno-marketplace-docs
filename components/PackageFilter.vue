<template>
  <div class="package-filter">
    <div class="flex items-center gap-2 mb-4">
      <UBadge
        v-for="pkg in packages"
        :key="pkg.name"
        :color="isSelected(pkg) ? pkg.color : 'gray'"
        :variant="isSelected(pkg) ? 'solid' : 'subtle'"
        class="cursor-pointer transition-all hover:scale-105"
        @click="togglePackage(pkg)"
      >
        <UIcon :name="pkg.icon" class="w-4 h-4 mr-1" />
        {{ pkg.name }}
      </UBadge>
    </div>

    <div v-if="selectedPackages.length > 0" class="flex items-center gap-2 text-sm text-gray-600">
      <span>Showing:</span>
      <UBadge
        v-for="pkg in selectedPackages"
        :key="pkg.name"
        :color="pkg.color"
        variant="soft"
        size="xs"
      >
        {{ pkg.name }}
      </UBadge>
      <UButton
        v-if="selectedPackages.length > 0"
        size="xs"
        color="gray"
        variant="ghost"
        @click="clearFilters"
      >
        Clear
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Package {
  name: string
  description: string
  icon: string
  color: string
  path: string
  tags: string[]
}

const appConfig = useAppConfig()
const packages = appConfig.packages as Package[]

const selectedPackages = ref<Package[]>([])

// Initialize with all packages selected
onMounted(() => {
  selectedPackages.value = [...packages]
})

const isSelected = (pkg: Package) => {
  return selectedPackages.value.some(p => p.name === pkg.name)
}

const togglePackage = (pkg: Package) => {
  const index = selectedPackages.value.findIndex(p => p.name === pkg.name)
  if (index === -1) {
    selectedPackages.value.push(pkg)
  } else {
    selectedPackages.value.splice(index, 1)
  }

  // Emit selection change for parent components
  emit('package-filter-change', selectedPackages.value)
}

const clearFilters = () => {
  selectedPackages.value = []
  emit('package-filter-change', [])
}

defineEmits<{
  'package-filter-change': [packages: Package[]]
}>()
</script>

<style scoped>
.package-filter {
  @apply border-b border-gray-200 dark:border-gray-800 pb-4;
}
</style>