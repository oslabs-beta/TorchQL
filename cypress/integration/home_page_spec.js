describe('The Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('focuses input on load', () => {
    cy.focused()
      .should('have.class', 'input')
  });

  it('has a title', () => {
    cy.get('.header')
    cy.contains('TorchQL')
    expect(2).to.equal(2)
  })

  it('accepts input', () => {
    const typedText = 'Test Input 123'
    cy.get('.input')
      .type(typedText)
      .should('have.value', typedText)
      .click()
  });

  it('mySQL opens div', () => {
    cy.get('.parent > :nth-child(1) > :nth-child(3)')
      .click()
  })

  it('postgreSQL fetch request', () => {
    cy.request('/db/pg/prog?uri=postgres://zybzettu:rqV_nuf1026KuTDybUHYNDKRRtfGA2a-@raja.db.elephantsql.com:5432/zybzettu')
    .its('body')
  })
});
