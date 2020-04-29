describe('The Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('focuses input on load', () => {
    cy.focused()
      .should('have.class', 'input')
  });

  // it('has a title', () => {
  //   cy.contains('TORCHQL')
  //   expect(2).to.equal(2)
  // })
  it('checks for button', () => {
    cy.get('button')
      .click()
      .should('have.class', 'main-btn')
  })

  it('accepts input', () => {
    const typedText = 'Test Input 123'
    cy.get('.input')
      .type(typedText)
      .should('have.value', typedText);
  });
});
