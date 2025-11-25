export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    }
  },

  repositories: {
    sdk: 'ZunoKit/zuno-marketplace-sdk',
    metadata: 'ZunoKit/zuno-marketplace-metadata',
    indexer: 'ZunoKit/zuno-marketplace-indexer',
    abis: 'ZunoKit/zuno-marketplace-abis'
  }
})
