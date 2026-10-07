import { ConfigProvider, message, notification } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import type React from 'react';
import { useEffect, useMemo } from 'react';

import { buildConfigProviderProps } from '@/shared/config/ant-theme';
import { useThemeStore } from 'shared/lib/appTheme';
import { setNotificationApi } from 'shared/lib/errors';
import { setMessageApi } from 'shared/lib/message';

type AppThemeProviderProps = {
  children: React.ReactNode;
};

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  const mode = useThemeStore((state) => state.theme);
  const configProviderProps = useMemo(() => buildConfigProviderProps(mode), [mode]);
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [messageApi, messageContextHolder] = message.useMessage();

  useEffect(() => {
    setNotificationApi(notificationApi);
  }, [notificationApi]);

  useEffect(() => {
    setMessageApi(messageApi);
  }, [messageApi]);

  return (
    <ConfigProvider {...configProviderProps} locale={ruRU}>
      {notificationContextHolder}
      {messageContextHolder}
      {children}
    </ConfigProvider>
  );
};
