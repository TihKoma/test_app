import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AppThemeProvider } from '@/app/providers/AppThemeProvider';
import { MainPage } from 'pages/MainPage';
import { useThemeStore } from 'shared/lib/appTheme';

import '@/app/styles/index.scss';

const App = () => {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <AppThemeProvider>
      <Routes>
        <Route path={'/'} element={<MainPage />} />
      </Routes>
    </AppThemeProvider>
  );
};

createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
