// eslint-disable-next-line import/extensions
import config from './.config/eslint/index.js';

export default [
  {
    ignores: [
      '*.config.js',
      '*.config.mjs',
      '*.config.cjs',
      'vite.config*.js',
      'eslint.config.js',
      '.config/**/*',
      '**/*.d.ts',
    ],
  },
  ...config,
  {
    rules: {
      'sonarjs/function-return-type': 'off',
      'arrow-body-style': 'off',
      'react/jsx-handler-names': 'off',
    },
  },
];
