import { ORG_TYPE, UPGRADE_STATUS } from '../utils/constants';

export interface IOrgUpgradeRequest {
  entityName: string;
  email: string;
  organizationName: string;
  phone: string;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  street: string;
  website: string;
  taxCode: string;
  type: ORG_TYPE;
  description: string;
}

export interface IUpgradeResponse {
  id: string;
  status: UPGRADE_STATUS;
  isCreatedAt: string;
  entityName: string;
  email: string;
  organizationName: string;
  phone: string;
  address: string;
  website: string;
  taxCode: string;
  type: ORG_TYPE;
  description: string;
}
