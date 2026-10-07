import { configs } from 'eslint-plugin-sonarjs';
import { defineConfig } from 'eslint/config';

export default defineConfig({
  files: ['**/*.{js,jsx,ts,tsx,mts,cts,mjs,cjs}'],
  extends: [configs.recommended],
  rules: {
    'sonarjs/todo-tag': 'warn',
    'sonarjs/cognitive-complexity': 'off',
  },
});
