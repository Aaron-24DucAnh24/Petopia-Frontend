import { ORG_TYPE, PET_SPECIES, USER_ROLE } from './constants';
import { ValueText } from './ValueText';

export class ValueTextManager {
  static UserRole = new ValueText([
    { value: USER_ROLE.STANDARD_USER.toString(), text: 'Người dùng' },
    { value: USER_ROLE.SYSTEM_ADMIN.toString(), text: 'Quản trị viên' },
    { value: USER_ROLE.ORGANIZATION.toString(), text: 'Tổ chức' },
  ]);

  static OrganizationType = new ValueText([
    { value: ORG_TYPE.BUSINESS.toString(), text: 'Doanh nghiệp' },
    { value: ORG_TYPE.OTHER.toString(), text: 'Tổ chức' },
    { value: ORG_TYPE.VET.toString(), text: 'Thú y' },
    { value: ORG_TYPE.RESCUE.toString(), text: 'Cứu hộ' },
  ]);

  static PetSpecies = new ValueText([
    { value: PET_SPECIES.DOG.toString(), text: 'Chó' },
    { value: PET_SPECIES.CAT.toString(), text: 'Mèo' },
    { value: PET_SPECIES.OTHER.toString(), text: 'Khác' },
  ]);
}