import BasePage from './BasePage';

class AdminHomePage extends BasePage {
  constructor() {
    super('/admin/home');
  }

  elements = {
    title: () => cy.get('h1').first(),
    navRegisterProduct: () => cy.getByTestId('cadastrar-produtos'),
    navListProducts: () => cy.getByTestId('listar-produtos'),
    logout: () => cy.getByTestId('logout'),
  };

  shouldWelcome(name) {
    this.shouldBeOnPage();
    // normaliza espaços (o front renderiza &nbsp; entre "Bem Vindo" e o nome)
    this.elements
      .title()
      .invoke('text')
      .should((text) => {
        expect(text.replace(/\s+/g, ' ').trim()).to.eq(`Bem Vindo ${name}`);
      });
    return this;
  }

  goToRegisterProduct() {
    this.elements.navRegisterProduct().click();
    return this;
  }
}

export default new AdminHomePage();
