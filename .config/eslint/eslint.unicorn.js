import unicornPlugin from 'eslint-plugin-unicorn';
import { defineConfig } from 'eslint/config';

export default defineConfig({
  files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
  extends: [unicornPlugin.configs.recommended],
  rules: {
    'unicorn/consistent-destructuring': 'error',
    'unicorn/custom-error-definition': 'error',
    'unicorn/no-unused-properties': 'error',
    'unicorn/no-null': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/no-array-method-this-argument': 'off',
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          camelCase: true,
          pascalCase: true,
        },
        multipleFileExtensions: false,
      },
    ],
    'unicorn/prevent-abbreviations': [
      'error',
      {
        replacements: {
          dev: false,
          prod: false,
          props: false,
          ref: false,
          refs: false,
          args: false,
          params: false,
          utils: false,
          env: false,
        },
      },
    ],
  },
});
