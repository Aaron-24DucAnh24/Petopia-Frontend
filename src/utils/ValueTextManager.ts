import { ValueText } from './ValueText';
import valueTextsData from '../json/valueTexts.json';

export class ValueTextManager {
  static UserRole = new ValueText(valueTextsData.userRoles);
  static OrganizationType = new ValueText(valueTextsData.orgTypes);
  static PetSpecies = new ValueText(valueTextsData.petSpecies);
  static PetSex = new ValueText(valueTextsData.petSex);
  static PetColor = new ValueText(valueTextsData.petColor);
  static PetSize = new ValueText(valueTextsData.petSize);
  static PetAge = new ValueText(valueTextsData.petAge);
  static PetVaccinated = new ValueText(valueTextsData.petVaccinated);
  static PetSterilized = new ValueText(valueTextsData.petSterilized);
  static HouseType = new ValueText(valueTextsData.houseTypes);
  static AdoptDelay = new ValueText(valueTextsData.adoptDelays);
  static BlogCategory = new ValueText(valueTextsData.blogCategories);
  static UpgradeStatus = new ValueText(valueTextsData.upgradeStatuses);
}
