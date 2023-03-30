
module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    "plugin:prettier/recommended",
    'eslint:recommended'
  ],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/no-unused-vars': 'off',
    'vue/script-setup-uses-vars': 'off',
    'no-mixed-spaces-and-tabs': 'off'
  }
}
