import { REPORT_ENTITY, REPORT_TYPE } from '@/src/utils/constants';
import { ORG_TYPE, USER_ROLE } from '../utils/constants';

export interface IIndividualAttributes {
  firstName: string;
  lastName: string;
}

export interface IOrganizationAttributes {
  type: ORG_TYPE;
  description: string;
  website: string;
  organizationName: string;
}

export interface IUserInfoReponse {
  attributes: IIndividualAttributes & IOrganizationAttributes;
  address: string;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  street: string;
  id: string;
  email: string;
  image: string;
  role: USER_ROLE;
  phone: string;
  birthDate: Date;
}
export interface IResetPasswordRequest {
  email: string;
  resetPasswordToken: string;
  password: string;
}

export interface IChangePasswordRequest {
  newPassword: string;
  oldPassword: string;
}

export interface IUserUpdate {
  phone: string;
  firstName: string;
  lastName: string;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  street: string;
  birthDate: Date;
  website: string;
  description: string;
  organizationName: string;
  type: ORG_TYPE;
}

export interface ICurrentUserCoreResponse {
  id: string;
  email: string;
  image: string;
  role: USER_ROLE;
  name: string;
}

export interface IOtherUserRequest {
  userId: string;
}

export interface IReportRequest {
  id: string;
  entity: REPORT_ENTITY;
  reportTypes: number[];
}

export interface IPreReportRequest {
  id: string;
  entity: REPORT_ENTITY;
}
