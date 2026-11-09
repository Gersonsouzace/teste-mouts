/**
 * Classe base dos Page Objects: concentra comportamentos comuns a todas as páginas.
 */
export default class BasePage {
  /** @param {string} path rota relativa ao baseUrl */
  constructor(path) {
    this.path = path;
  }

  visit() {
    cy.visit(this.path);
    return this;
  }

  shouldBeOnPage() {
    cy.location('pathname').should('eq', this.path);
    return this;
  }

  /** Alerta de feedback exibido pelo front (ex.: erros de validação). */
  alert() {
    return cy.get('[role="alert"]');
  }

  shouldShowAlert(message) {
    this.alert().should('be.visible').and('contain.text', message);
    return this;
  }
}
