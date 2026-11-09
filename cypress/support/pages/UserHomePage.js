import BasePage from './BasePage';

class UserHomePage extends BasePage {
  constructor() {
    super('/home');
  }

  elements = {
    title: () => cy.get('h1').first(),
    search: () => cy.getByTestId('pesquisar'),
    searchButton: () => cy.getByTestId('botaoPesquisar'),
    productCards: () => cy.get('.card'),
    productCard: (name) => cy.contains('.card', name),
    navShoppingList: () => cy.getByTestId('lista-de-compras'),
    logout: () => cy.getByTestId('logout'),
  };

  shouldBeLoggedIn() {
    this.shouldBeOnPage();
    this.elements.logout().should('be.visible');
    this.elements.search().should('be.visible');
    return this;
  }

  searchProduct(name) {
    this.elements.search().clear().type(name);
    this.elements.searchButton().click();
    return this;
  }

  addToShoppingList(name) {
    this.elements.productCard(name).within(() => {
      cy.getByTestId('adicionarNaLista').click();
    });
    return this;
  }
}

export default new UserHomePage();
