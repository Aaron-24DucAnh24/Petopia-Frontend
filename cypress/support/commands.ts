/// <reference types="cypress" />

import 'cypress-file-upload';

Cypress.Commands.add('login', (email: string, password: string) => {
    cy.visit('http://localhost:3000');
    cy.get('[test-id=login-button]').click();
    cy.get('#inputEmail').type(email);
    cy.get('#inputPassword').type(password);
    cy.get('button').contains('Đăng nhập').click();
    cy.wait(1500);
  });





  
