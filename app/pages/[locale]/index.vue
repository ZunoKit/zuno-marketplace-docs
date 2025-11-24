<template>
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Welcome to Zuno Marketplace Documentation
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400">
        Unified documentation for Zuno NFT Marketplace ecosystem
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">SDK Documentation</h3>
        </template>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          TypeScript SDK for building marketplace integrations
        </p>
        <UButton to="/en/sdk" block>
          View SDK Docs
        </UButton>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Metadata Service</h3>
        </template>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          NFT metadata management and IPFS storage
        </p>
        <UButton to="/en/metadata" block>
          View Metadata Docs
        </UButton>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Indexer</h3>
        </template>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Real-time blockchain event indexing
        </p>
        <UButton to="/en/indexer" block>
          View Indexer Docs
        </UButton>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">ABIs</h3>
        </template>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Smart contract ABIs and API reference
        </p>
        <UButton to="/en/abis" block>
          View ABIs Docs
        </UButton>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>
