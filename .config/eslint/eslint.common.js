import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';

export default defineConfig({
  files: ['**/*.{js,jsx,ts,tsx,mts,cts,mjs,cjs}'],
  plugins: { '@stylistic': stylistic },
  extends: [eslint.configs.recommended, stylistic.configs.all],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-undef': 'off',
    'prefer-template': 'error',
    'arrow-body-style': ['error', 'always'],
    'no-return-assign': 'off',
    'newline-before-return': ['error'],
    radix: 'off',
    camelcase: [
      'error',
      {
        allow: ['_zero$', '_one$', '_few$', '_many$', '_other$'],
        properties: 'never',
      },
    ],
    'no-shadow': 'off',
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true,
      },
    ],
    'object-shorthand': 'error',
    'prefer-const': 'error',
    'class-methods-use-this': 'off',
    'no-restricted-syntax': [
      'error',
      {
        selector: 'WithStatement',
        message: '`with` statement are not allowed.',
      },
      {
        selector: 'MemberExpression[object.name="React"]',
        message: 'Use named imports from react.',
      },
      {
        selector:
          'CallExpression[callee.property.name="replaceAll"] > Literal[regex.flags=/^[^g]*$/].arguments:first-child',
        message: 'Missing "g" flag in regular expression.',
      },
    ],
    curly: ['error', 'all'],
    complexity: ['error'],

    // stylistic/js

    '@stylistic/object-curly-newline': 'off',
    '@stylistic/operator-linebreak': 'off',
    '@stylistic/function-paren-newline': 'off',
    '@stylistic/no-confusing-arrow': 'off',
    '@stylistic/newline-per-chained-call': 'off',
    '@stylistic/indent': 'off',
    '@stylistic/implicit-arrow-linebreak': 'off',
    '@stylistic/lines-between-class-members': [
      'error',
      'always',
      {
        exceptAfterSingleLine: true,
      },
    ],
    '@stylistic/no-mixed-operators': 'off',
    '@stylistic/max-len': [
      'error',
      {
        code: 120,
        tabWidth: 2,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTrailingComments: true,
      },
    ],
    '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
    '@stylistic/spaced-comment': ['error', 'always'],
    '@stylistic/object-curly-spacing': ['error', 'always', { objectsInObjects: true }],
    '@stylistic/padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'if' },
      { blankLine: 'always', prev: 'if', next: 'if' },
      { blankLine: 'always', prev: ['const', 'let'], next: '*' },
      { blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let'] },
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: '*', next: 'case' },
      { blankLine: 'always', prev: 'if', next: '*' },
    ],
  },
});
