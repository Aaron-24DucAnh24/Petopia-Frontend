import { IOrgUpgradeRequest } from '../interfaces/org';
import {
  IChangePasswordRequest,
  IOtherUserRequest,
  IPreReportRequest,
  IReportRequest,
  IResetPasswordRequest,
  IUserUpdate,
} from '../interfaces/user';
import { http } from './http';

export const resetPassword = async (data: IResetPasswordRequest) =>
  await http.post('/User/ResetPassword', data);

export const forgotPassword = async (data: string) =>
  await http.post('/User/ForgotPassword', data);

export const getCurrentUserCore = async () =>
  await http.get('/User/CurrentUserCore');

export const updateUser = async (data: IUserUpdate) => {
  if (data.organizationName) {
    await http.put('/User/Organization', data);
  }
  else {
    await http.put('/User/User', data);
  }
};

export const getUserInfo = async () => await http.get('/User/CurrentUser');

export const getOtherUserInfo = async (data: IOtherUserRequest) =>
  await http.get('/User/OtherUser', data);

export const updateAvatar = async (data: FormData) =>
  await http.put('/User/UpdateAvatar', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const changePassword = async (data: IChangePasswordRequest) =>
  await http.post('/User/ChangePassword', data);

export const upgradeToOrg = async (data: IOrgUpgradeRequest) =>
  await http.post('/User/UpgradeAccount', data);

export const getPreUpgrade = async () => await http.get('/User/PreUpgrade');

export const report = async (data: IReportRequest) =>
  await http.post('/Report/Report', data);

export const getPreReport = async (data: IPreReportRequest) =>
  await http.post('/Report/PreReport', data);
