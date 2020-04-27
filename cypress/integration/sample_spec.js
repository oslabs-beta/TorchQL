import { isExportDeclaration, createYield } from "typescript"

    // Arrange - setup initial app state
    // - visit a web page
    // - query for an element 
    // Act - take an action
    // Assert - make an assertion 
    // -make an assertion about the web application

describe('My First Test', () => {
  it('Does not do much', () => {
    expect(true).to.equal(true)
  })
  it('Clicks an element', () => {
    cy.visit('http://example.cypress.io')
    // debugging tool to go step by step of next tests in cypress
    cy.pause();
    // clicks an element
    cy.contains('type').click()
    // makes an assertion
    cy.url()
    .should('include', '/commands/actions')
    // addtional assertions by chaining
    cy.get('.action-email')
      .type('fake@email.com')
      .should('have.value', 'fake@email.com')
  })
});


