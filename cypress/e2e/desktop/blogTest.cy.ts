import {
  BLOG_INFO,
  ORG_ACCOUNT,
  RESOLUTION,
} from '../../support/constant';

describe('Blog - Create and View', () => {
  beforeEach(() => {
    cy.viewport(RESOLUTION.PC_WIDTH, RESOLUTION.PC_HEIGHT);
  });

  it('Create blog - OK', () => {
    cy.login(ORG_ACCOUNT.EMAIL, ORG_ACCOUNT.PASSWORD);
    cy.visit('http://localhost:3000/blog/new');

    cy.get('#blog-title').type(BLOG_INFO.TITLE);
    cy.get('#blog-excerpt').type(BLOG_INFO.EXCERPT);
    cy.get('#blog-category').select(BLOG_INFO.CATEGORY);
    cy.get('[test-id=image-dropzone]').attachFile(BLOG_INFO.IMAGE);
    cy.get('.ck-content[contenteditable=true]').type(BLOG_INFO.CONTENT);
    cy.get('[test-id=blog-post-button]').click();

    cy.url().should('include', '/blog/');
    cy.get('[test-id=blog-page-title]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).to.equal(BLOG_INFO.TITLE);
      });
  });

  it('View blog - OK', () => {
    cy.visit('http://localhost:3000/blog');

    let blogTitleOnCard: string;
    cy.get('[test-id=blog-card-0-title]')
      .invoke('text')
      .then((text) => {
        blogTitleOnCard = text.trim();
      });

    cy.get('[test-id=blog-card-0]').click();

    cy.get('[test-id=blog-page-title]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).to.equal(blogTitleOnCard);
      });
  });
});
