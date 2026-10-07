import { appThemeStorage } from 'shared/lib/appThemeStorage';
import { createStore } from 'shared/lib/zustand';

const getInitialTheme = (): 'light' | 'dark' => {
  // eslint-disable-next-line sonarjs/different-types-comparison -- SSR guard
  if (globalThis.window === undefined) {
    return 'light';
  }

  return appThemeStorage.data.theme;
};

export const useThemeStore = createStore(
  { theme: getInitialTheme() },
  (set) => ({
    toggleTheme: () => {
      set((draft) => {
        const next = draft.theme === 'light' ? 'dark' : 'light';

        draft.theme = next;
        appThemeStorage.save({ theme: next });

        if (typeof document !== 'undefined') {
          document.documentElement.dataset.theme = next;
        }
      });
    },
  }),
  'themeUiStore',
);

export const useTheme = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return { theme, toggleTheme };
};
