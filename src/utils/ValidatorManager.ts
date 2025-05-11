import { Validator } from './Validator';
import userRegisterRules from '../json/userRegisterRules.json';
import userUpgradeRules from '../json/userUpgradeRules.json';
import userUpdateOrganizationRules from '../json/userUpdateOrganizationRules.json';
import userUpdateIndividualRules from '../json/userUpdateIndividualRules.json';

export class ValidatorManager {
  static userRegisterValidator = new Validator(userRegisterRules);
  static userUpgradeValidator = new Validator(userUpgradeRules);
  static userUpdateOrganizationValidator = new Validator(userUpdateOrganizationRules);
  static userUpdateIndividualValidator = new Validator(userUpdateIndividualRules);
}