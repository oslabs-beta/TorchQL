describe('The Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('focuses input on load', () => {
    cy.visit('/');

    cy.get('.input')
      .should('have.class', 'input');
  });
});
