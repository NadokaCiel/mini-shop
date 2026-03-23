import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  theme: {
    colors: {
      page: '#f6f7fb',
      sidebar: '#f0f2f6',
    },
  },
  blocklist: ['?'],
})
