import config from '@uni-helper/eslint-config'

export default config({
  ignores: ['tmp-uni-base/**', '.scaffold_tmp/**', 'create-uni-*.tgz', 'node_modules/**', 'skills/**'],
  stylistic: {
    semi: false,
    quotes: 'single',
  },
})
