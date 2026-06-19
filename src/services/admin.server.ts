import { serverGet } from './server-http';
import { IAdminStatistics } from '@/src/interfaces/admin';

export const getAdminStatisticsServer = () =>
  serverGet<IAdminStatistics>('/Admin/Statistics');
