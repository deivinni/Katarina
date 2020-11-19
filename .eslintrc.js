module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'linebreak-style': 0,
    'no-use-before-define': 0,
    'no-shadow': 0,
    'no-underscore-dangle': 0,
    'import/extensions': 0,
    'import/prefer-default-export': 0,
    'import/no-unresolved': 0,
    'max-len': 0,
    'lines-between-class-members': 0,
    'no-restricted-syntax': 0,
    'no-param-reassign': 0,
    'no-console': 0,
    'class-methods-use-this': 0,
    camelcase: 0,
  },
};
