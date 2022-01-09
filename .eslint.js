module.exports = {
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'prettier'
  ],
  "rules": {
    "vetur.validation.template": false,
    "vue/require-default-prop": "off",
    "no-console": 0,
    "no-debugger": 0,
    'quotes': [1, 'single'], //引号类型 `` "" ''
    'semi': [2, 'never'], // 语句强制分号结尾
    'prettier/prettier': [
        'error',
        {
            trailingComma: 'all',
            tabWidth: 2,
            semi: false,
            singleQuote: true,
            bracketSpacing: true,
            eslintIntegration: true,
            printWidth: 120,
            endOfLine: 'auto'
        },
    ]
},
  "parserOptions": {
    "ecmaVersion": 2020,
    "parser": "babel-eslint",
    "sourceType": "module",
    "ecmaFeatures": {
        "experimentalObjectRestSpread": true
      },
  },
}