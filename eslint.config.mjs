// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    // Configures for antfu's config
    typescript: false,
    vue: true,
    unocss: false,
    markdown: true,
  },
)