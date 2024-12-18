// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    // Configures for antfu's config
    typescript: false,
    vue: {
      vueVersion: 2
    },
    unocss: false,
    markdown: true,
  },
  {
    // Configures for eslint
    name: 'vue2-apps',
    rules: {
      'vue/v-on-event-hyphenation': 'off',
      'vue/require-explicit-emits': 'off',
      "vue/no-deprecated-v-on-native-modifier": 'off',
    },
  },
)
