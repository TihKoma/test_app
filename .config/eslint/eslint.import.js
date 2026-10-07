import importPlugin from 'eslint-plugin-import';
import { defineConfig } from 'eslint/config';

export default defineConfig({
  files: ['**/*.{js,jsx,ts,tsx,mts,cts,mjs,cjs}'],
  extends: [importPlugin.flatConfigs.recommended, importPlugin.flatConfigs.typescript],
  rules: {
    'import/newline-after-import': 'error',
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: [['builtin', 'external'], ['internal'], ['parent'], ['sibling', 'index', 'object']],
        pathGroups: [
          {
            pattern: '{.,..}/**/*.{css,scss}',
            group: 'sibling',
            position: 'after',
          },
        ],
        alphabetize: {
          order: 'asc',
          caseInsensitive: false,
        },
      },
    ],
    'import/no-duplicates': [
      'error',
      {
        considerQueryString: true,
      },
    ],
    'import/prefer-default-export': 'off',
    'import/extensions': [
      'error',
      'never',
      {
        js: 'never',
        json: 'ignorePackages',
      },
    ],
    'import/no-unresolved': ['error', {}],
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
});
