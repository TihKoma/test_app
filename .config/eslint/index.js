/* eslint-disable import/extensions */
import commonConfig from './eslint.common.js';
import compatConfig from './eslint.compat.js';
import importConfig from './eslint.import.js';
import prettierConfig from './eslint.prettier.js';
import reactConfig from './eslint.react.js';
import sonarjsConfig from './eslint.sonarjs.js';
import typescriptConfig from './eslint.typescript.js';
import unicornConfig from './eslint.unicorn.js';
/* eslint-enable import/extensions */

export default [
  ...commonConfig,
  ...importConfig,
  ...typescriptConfig,
  ...reactConfig,
  ...prettierConfig,
  ...unicornConfig,
  ...compatConfig,
  ...sonarjsConfig,
];
