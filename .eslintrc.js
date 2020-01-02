module.exports = {
  root: true,
  'env': {
    'node': true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    'vue/no-parsing-error': [2, {
      'x-invalid-end-tag': false
    }],
    'no-undef': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
