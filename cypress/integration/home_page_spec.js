describe('The Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('focuses input on load', () => {
    cy.focused()
      .should('have.class', 'input')
  });

  it('accepts input', () => {
    const typedText = 'Test Input 123'
    cy.get('.input')
      .type(typedText)
      .should('have.value', typedText);
  });
});
