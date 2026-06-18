import {
  NORMAL_ACCOUNT,
  PET_INFO,
  KEYWORDS,
  RESOLUTION,
} from '../../support/constant';

describe('Post - Create and View', () => {
  beforeEach(() => {
    cy.viewport(RESOLUTION.PC_WIDTH, RESOLUTION.PC_HEIGHT);
    cy.login(NORMAL_ACCOUNT.EMAIL, NORMAL_ACCOUNT.PASSWORD);
  });

  it('Create post - OK', () => {
    cy.visit('http://localhost:3000');

    cy.get('[test-id=create-new-button]').click();
    cy.get('[test-id=create-post-option]').click();

    cy.get('[test-id=image-dropzone]').attachFile(PET_INFO.IMAGE_1);
    cy.get('.ck-content[contenteditable=true]').type('Test post content');
    cy.get('[test-id=create-post-submit]').click();

    cy.get('[test-id=alert]').should('be.visible').should('contain.text', KEYWORDS.SUCCESS);
  });

  it('View post - OK', () => {
    cy.visit('http://localhost:3000');

    cy.get('[test-id=feed-post-card]', { timeout: 10000 }).first()
      .find('[test-id=post-image-carousel]').click();

    cy.get('[test-id=post-detail-modal]').should('be.visible');
  });
});
