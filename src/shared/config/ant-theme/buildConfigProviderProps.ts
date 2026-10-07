import type { ConfigProviderProps } from 'antd';

import { buildAntTheme } from './buildAntTheme';
import componentConfigJson from './componentConfig.json';
import type { AntComponentConfigJson, AppThemeMode } from './types';

const componentConfig = componentConfigJson as AntComponentConfigJson;

export const buildConfigProviderProps = (mode: AppThemeMode): ConfigProviderProps => ({
  theme: buildAntTheme(mode),
  ...componentConfig,
});
