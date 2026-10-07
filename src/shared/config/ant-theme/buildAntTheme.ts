import { type ThemeConfig, theme as antTheme } from 'antd';

import darkThemeJson from './dark.theme.json';
import lightThemeJson from './light.theme.json';
import type { AntThemeJson, AppThemeMode } from './types';

const themeByMode: Record<AppThemeMode, AntThemeJson> = {
  light: lightThemeJson,
  dark: darkThemeJson,
};

export const buildAntTheme = (mode: AppThemeMode): ThemeConfig => {
  const themeJson = themeByMode[mode];

  return {
    token: themeJson.token,
    components: themeJson.components,
    algorithm: mode === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    cssVar: { key: mode },
  };
};
