import {
  NORMAL_ACCOUNT,
  PET_INFO,
  RESOLUTION,
} from '../../support/constant';

describe('Pet - Create and View', () => {
  beforeEach(() => {
    cy.viewport(RESOLUTION.PC_WIDTH, RESOLUTION.PC_HEIGHT);
  });

  it('Create pet - OK', () => {
    cy.login(NORMAL_ACCOUNT.EMAIL, NORMAL_ACCOUNT.PASSWORD);
    cy.visit('http://localhost:3000/give-pet');

    cy.get('[test-id=image-dropzone]').attachFile(PET_INFO.IMAGE_1);
    cy.get('[test-id=show-images-dropzone]').should('have.length', 1);
    cy.get('[test-id=next-button-form]').click();

    cy.get('#pet-name').type(PET_INFO.NAME);
    cy.get('[test-id=dropdown-option-species]').select(PET_INFO.SPECIES);
    cy.get('[test-id=dropdown-option-sex]').select(PET_INFO.SEX);
    cy.get('[test-id=dropdown-option-color]').select(PET_INFO.COLOR);
    cy.get('[test-id=dropdown-option-size]').select(PET_INFO.SIZE);
    cy.get('[test-id=dropdown-option-age]').select(PET_INFO.AGE);
    cy.get('[test-id=dropdown-option-isVaccinated]').select(PET_INFO.VACCINE);
    cy.get('[test-id=dropdown-option-isSterillized]').select(PET_INFO.SPAY);
    cy.get('[test-id=pet-description-give-form]').type(PET_INFO.DESCRIPTION);
    cy.get('[test-id=next-button-form]').click();

    cy.get('[test-id=check-box-give-form]').click();
    cy.get('[test-id=submit-give-pet-button]').click();

    cy.url().should('include', '/pet/');
  });

  it('View pet - OK', () => {
    cy.login(NORMAL_ACCOUNT.EMAIL, NORMAL_ACCOUNT.PASSWORD);
    cy.visit('http://localhost:3000/search');

    cy.get('[test-id=pet-card-0]', { timeout: 10000 }).should('be.visible').click();

    cy.url().should('include', '/pet/');
  });
});
