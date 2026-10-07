import type { NotificationInstance } from 'antd/es/notification/interface';

let notificationApi: NotificationInstance | null = null;

export const setNotificationApi = (api: NotificationInstance): void => {
  notificationApi = api;
};

export const getNotificationApi = (): NotificationInstance | null => notificationApi;
