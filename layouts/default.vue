<template>
  <div>
    <!-- Header Navigation -->
    <header class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-40">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <!-- Logo and Title -->
          <div class="flex items-center space-x-4">
            <NuxtLink :to="'/' + $i18n.locale" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <UIcon name="i-heroicons-cube-transparent" class="w-5 h-5 text-white" />
              </div>
              <span class="font-bold text-lg text-gray-900 dark:text-white hidden sm:inline">
                Zuno Docs
              </span>
            </NuxtLink>

            <!-- Package Filter (Desktop) -->
            <div class="hidden lg:block">
              <PackageFilter @package-filter-change="handlePackageFilter" />
            </div>
          </div>

          <!-- Search and Actions -->
          <div class="flex items-center space-x-4">
            <!-- Search -->
            <div class="hidden md:block">
              <DocumentationSearch placeholder="Search documentation..." />
            </div>

            <!-- Language Switcher -->
            <UButton
              v-for="locale in $i18n.locales"
              :key="locale.code"
              :color="$i18n.locale === locale.code ? 'primary' : 'neutral'"
              variant="ghost"
              size="xs"
              @click="$i18n.setLocale(locale.code)"
            >
              {{ locale.name }}
            </UButton>

            <!-- Mobile Menu Toggle -->
            <UButton
              icon="i-heroicons-bars-3"
              variant="ghost"
              color="neutral"
              size="sm"
              class="md:hidden"
              @click="showMobileMenu = !showMobileMenu"
            />
          </div>
        </div>

        <!-- Mobile Package Filter -->
        <div v-show="showMobileMenu" class="lg:hidden mt-4 border-t pt-4">
          <PackageFilter @package-filter-change="handlePackageFilter" />
          <div class="mt-4">
            <DocumentationSearch placeholder="Search documentation..." />
          </div>
        </div>
      </div>
    </header>

    <!-- Breadcrumb Navigation -->
    <BreadcrumbNav />

    <!-- Main Content Area -->
    <main class="flex min-h-screen">
      <!-- Sidebar Navigation -->
      <aside
        class="hidden lg:block w-64 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
      >
        <div class="p-4">
          <ContentNavigation
            v-if="navigation"
            class="space-y-2"
          />
        </div>
      </aside>

      <!-- Content -->
      <div class="flex-1">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            © 2024 Zuno Marketplace. Built with ❤️ for the Web3 ecosystem.
          </div>

          <div class="flex items-center space-x-6">
            <NuxtLink
              v-for="link in footerLinks"
              :key="link.to"
              :to="link.to"
              :target="link.to.startsWith('http') ? '_blank' : '_self'"
              class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <UIcon :name="link.icon" class="w-4 h-4" />
              <span>{{ link.label }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { $i18n } = useNuxtApp()
const appConfig = useAppConfig()
const route = useRoute()

// Reactive state
const showMobileMenu = ref(false)
const selectedPackages = ref<string[]>([])

// Get navigation data from Nuxt Content
const { data: navigation } = await useAsyncData('navigation', () =>
  queryContent().where({ _partial: false }).find()
)

// Footer links from app config
const footerLinks = computed(() => (appConfig.footer as any)?.links || [])

// Handle package filter changes
const handlePackageFilter = (packages: any[]) => {
  selectedPackages.value = packages.map(pkg => pkg.name.toLowerCase())
}

// Close mobile menu on route change
watch(() => route.path, () => {
  showMobileMenu.value = false
})

// SEO meta
useHead({
  titleTemplate: '%s - Zuno Marketplace Documentation',
  meta: [
    { name: 'description', content: (appConfig.site as any)?.description || 'Complete documentation for Zuno Marketplace ecosystem' }
  ]
})
</script>

<style scoped>
/* Custom styles for navigation */
:deep(.content-navigation) {
  @apply space-y-1;
}

:deep(.content-navigation a) {
  @apply flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors;
}

:deep(.content-navigation a:hover) {
  @apply text-gray-900 dark:text-white;
}

:deep(.content-navigation a.active) {
  @apply bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium;
}

:deep(.content-navigation .folder) {
  @apply font-medium text-gray-900 dark:text-white mt-4 mb-2;
}

:deep(.content-navigation .folder:first-child) {
  @apply mt-0;
}

/* Mobile menu animations */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>