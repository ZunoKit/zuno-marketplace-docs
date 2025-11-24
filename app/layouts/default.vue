<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <!-- Header -->
    <header class="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
      <div class="container mx-auto px-4">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center gap-6">
            <NuxtLink to="/en" class="flex items-center gap-2">
              <AppLogo class="h-8 w-auto" />
              <span class="text-xl font-bold text-gray-900 dark:text-white">Zuno Marketplace</span>
            </NuxtLink>
          </div>

          <div class="flex items-center gap-4">
            <!-- Language Switcher -->
            <USelectMenu
              v-model="selectedLocale"
              :options="locales"
              option-attribute="name"
              value-attribute="code"
              @update:model-value="switchLocale"
            />

            <!-- Color Mode Toggle -->
            <UButton
              :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
              color="gray"
              variant="ghost"
              @click="colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'"
            />

            <!-- GitHub Link -->
            <UButton
              icon="i-simple-icons-github"
              to="https://github.com/ZunoKit/zuno-marketplace-docs"
              target="_blank"
              color="gray"
              variant="ghost"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 dark:border-gray-800 mt-16">
      <div class="container mx-auto px-4 py-8">
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          Built with ❤️ by Zuno Team
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { locale, locales } = useI18n()
const colorMode = useColorMode()

const selectedLocale = computed({
  get: () => locale.value,
  set: (value) => value
})

const switchLocale = (newLocale: string) => {
  navigateTo(`/${newLocale}`)
}
</script>
