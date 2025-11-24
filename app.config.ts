export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    }
  },

  docus: {
    title: 'Zuno Marketplace',
    description: 'Unified documentation for Zuno NFT Marketplace ecosystem',
    url: 'https://docs.zuno.com',

    socials: {
      github: 'ZunoKit/zuno-marketplace-docs'
    },

    aside: {
      level: 1,
      exclude: []
    },

    header: {
      logo: true,
      showLinkIcon: true
    },

    footer: {
      credits: {
        icon: '',
        text: 'Built with ❤️ by Zuno Team',
        href: 'https://zuno.com'
      }
    }
  }
})
