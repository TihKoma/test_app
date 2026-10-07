import { APP_NAME } from 'shared/const/env';

import { LocalStorageService } from './LocalStorageService';

export type AppThemeMode = 'light' | 'dark';

type AppThemeState = {
  theme: AppThemeMode;
};

export const appThemeStorage = new LocalStorageService<AppThemeState>({
  version: 1,
  appName: APP_NAME,
  id: 'themeUi',
  initialState: { theme: 'light' },
});

// eslint-disable-next-line sonarjs/different-types-comparison -- browser-only migration
if (globalThis.window !== undefined) {
  const legacy = localStorage.getItem('app-theme');

  if (legacy === 'light' || legacy === 'dark') {
    appThemeStorage.save({ theme: legacy });
    localStorage.removeItem('app-theme');
  }
}
