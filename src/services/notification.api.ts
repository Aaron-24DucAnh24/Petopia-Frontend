import { http } from './http';

export const checkNotification = async (id: string) =>
  await http.put(`/Notification/${id}`);

export const markAllAsSeen = async () =>
  await http.get('/Notification/MarkAsSeen');

export const deleteNotification = async (id: string) =>
  await http.delete(`/Notification/${id}`);
