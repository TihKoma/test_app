import type { ThemeConfig } from 'antd';

export type AppThemeMode = 'light' | 'dark';

export type AntThemeJson = {
  token: ThemeConfig['token'];
  components: ThemeConfig['components'];
};

export type AntComponentConfigJson = {
  datePicker?: Record<string, unknown>;
  timePicker?: Record<string, unknown>;
  button?: Record<string, unknown>;
  card?: Record<string, unknown>;
  tabs?: Record<string, unknown>;
  empty?: Record<string, unknown>;
  select?: Record<string, unknown>;
  statistic?: Record<string, unknown>;
};
