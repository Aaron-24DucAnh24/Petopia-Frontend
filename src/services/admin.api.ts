import { IPaginationRequest } from '../interfaces/common';
import { IAdminSearchFilter } from '../interfaces/admin';
import { http } from './http';

export const getAdminUsers = async (data: IPaginationRequest<IAdminSearchFilter>) =>
  await http.post('/Admin/User/Search', data);

export const deactivateUser = async (id: string) =>
  await http.put(`/Admin/User/${id}/Deactivate`);

export const activateUser = async (id: string) =>
  await http.put(`/Admin/User/${id}/Activate`);

export const getAdminPets = async (data: IPaginationRequest<IAdminSearchFilter>) =>
  await http.post('/Admin/Pet/Search', data);

export const deactivatePet = async (id: string) =>
  await http.put(`/Admin/Pet/${id}/Deactivate`);

export const activatePet = async (id: string) =>
  await http.put(`/Admin/Pet/${id}/Activate`);

export const getAdminPosts = async (data: IPaginationRequest<IAdminSearchFilter>) =>
  await http.post('/Admin/Post/Search', data);

export const deactivatePost = async (id: string) =>
  await http.put(`/Admin/Post/${id}/Deactivate`);

export const activatePost = async (id: string) =>
  await http.put(`/Admin/Post/${id}/Activate`);

export const getAdminBlogs = async (data: IPaginationRequest<IAdminSearchFilter>) =>
  await http.post('/Admin/Blog/Search', data);

export const deactivateBlog = async (id: string) =>
  await http.put(`/Admin/Blog/${id}/Deactivate`);

export const activateBlog = async (id: string) =>
  await http.put(`/Admin/Blog/${id}/Activate`);

export const getAdminPayments = async (data: IPaginationRequest<IAdminSearchFilter>) =>
  await http.post('/Admin/Payment/Search', data);

export const getAdminReports = async (data: IPaginationRequest<IAdminSearchFilter>) =>
  await http.post('/Admin/Report/Search', data);

export const resolveReport = async (data: { targetId: string; targetType: number }) =>
  await http.put('/Admin/Report/Resolve', data);

export const getAdminUpgrades = async (data: IPaginationRequest<IAdminSearchFilter>) =>
  await http.post('/Admin/Upgrade/Search', data);

export const approveUpgrade = async (id: string) =>
  await http.put(`/Admin/Upgrade/${id}/Approve`);

export const rejectUpgrade = async (id: string) =>
  await http.put(`/Admin/Upgrade/${id}/Reject`);

export const getAdminEmailTemplates = async () =>
  await http.get('/Admin/EmailTemplate');

