module.exports = {
  root: true,
  env: {
    es2020: true,
    node: true,
    browser: true,
    webextensions: true,
  },
  plugins: ['vue', 'prettier'],
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
    'prettier',
    './.eslintrc-auto-import.json',
  ],
  rules: {
    'vue/require-default-prop': 'off',
    'vue/no-v-html': 'off',
    'prefer-rest-params': 'off',
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': ['error'],
    'no-console': 0,
    'no-debugger': 0,
    '@typescript-eslint/no-explicit-any': ['off'],
    quotes: [1, 'single'], //引号类型 `` "" ''
    semi: [2, 'never'], // 语句强制分号结尾
    'vue/multi-word-component-names': 0,
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'all', // 多行使用拖尾逗号（默认none）
        tabWidth: 2, // 每个tab相当于多少个空格（默认2）
        semi: false, // 声明结尾使用分号(默认true)
        singleQuote: true, // 使用单引号（默认false）
        bracketSpacing: true, // 对象字面量的大括号间使用空格（默认true）
        eslintIntegration: true,
        printWidth: 120, // 每行代码长度（默认80）
        endOfLine: 'auto',
        plugins: [require('prettier-plugin-tailwindcss')],
      },
    ],
    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        allowSingleExtends: false,
      },
    ],
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
  },
}
