import { serverGetOptional } from './server-http';
import { INotificationResponse } from '@/src/interfaces/notification';

export const getNotificationsServer = () =>
  serverGetOptional<INotificationResponse[]>('/Notification');
