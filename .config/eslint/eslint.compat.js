import compatPlugin from 'eslint-plugin-compat';
import { defineConfig } from 'eslint/config';

export default defineConfig({
  files: ['**/*.{js,jsx,ts,tsx,mts,cts,mjs,cjs}'],
  extends: [compatPlugin.configs['flat/recommended']],
});

