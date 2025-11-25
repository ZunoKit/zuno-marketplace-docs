<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const route = useRoute()
const router = useRouter()

const appConfig = useAppConfig()
const header = computed(() => appConfig.header || {})

// Language switcher
const { locale, locales } = useI18n()

const currentLocale = computed(() => {
  const loc = (locales.value as any[]).find(l => l.code === locale.value)
  return loc || { code: 'en', name: 'English' }
})

const languageOptions = computed(() =>
  (locales.value as any[]).map(l => ({
    label: l.name,
    value: l.code,
    icon: l.code === 'en' ? 'i-circle-flags-us' : 'i-circle-flags-fr'
  }))
)

function switchLocale(newLocale: string) {
  const pathSegments = route.path.split('/').filter(Boolean)
  if (pathSegments.length > 1) {
    router.push(`/${newLocale}/${pathSegments.slice(1).join('/')}`)
  } else {
    router.push(`/${newLocale}`)
  }
}
</script>

<template>
  <UHeader
    :ui="{ center: 'flex-1' }"
    :to="header?.to || '/'"
  >
    <UContentSearchButton
      v-if="header?.search"
      :collapsed="false"
      class="w-full"
    />

    <template
      v-if="header?.logo?.dark || header?.logo?.light || header?.title"
      #title
    >
      <UColorModeImage
        v-if="header?.logo?.dark || header?.logo?.light"
        :light="header?.logo?.light!"
        :dark="header?.logo?.dark!"
        :alt="header?.logo?.alt"
        class="h-6 w-auto shrink-0"
      />

      <span v-else-if="header?.title">
        {{ header.title }}
      </span>
    </template>

    <template
      v-else
      #left
    >
      <NuxtLink :to="header?.to || '/'">
        <AppLogo class="w-auto h-6 shrink-0" />
      </NuxtLink>

      <TemplateMenu />
    </template>

    <template #right>
      <UContentSearchButton
        v-if="header?.search"
        class="lg:hidden"
      />

      <!-- Language Switcher -->
      <USelectMenu
        v-model="locale"
        :options="languageOptions"
        size="xs"
        @update:model-value="switchLocale"
      >
        <template #label>
          <span class="flex items-center gap-1.5">
            <UIcon
              :name="currentLocale.code === 'en' ? 'i-circle-flags-us' : 'i-circle-flags-fr'"
              class="size-4"
            />
            <span class="text-xs font-medium">{{ currentLocale.code.toUpperCase() }}</span>
          </span>
        </template>
      </USelectMenu>

      <UColorModeButton v-if="header?.colorMode" />

      <template v-if="header?.links">
        <UButton
          v-for="(link, index) of header.links"
          :key="index"
          v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
        />
      </template>
    </template>

    <template #body>
      <UContentNavigation
        highlight
        :navigation="navigation"
      />
    </template>
  </UHeader>
</template>
