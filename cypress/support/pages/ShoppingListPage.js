import BasePage from './BasePage';

class ShoppingListPage extends BasePage {
  constructor() {
    super('/minhaListaDeProdutos');
  }

  elements = {
    title: () => cy.get('h1'),
    productNames: () => cy.getByTestId('shopping-cart-product-name'),
    productQuantities: () => cy.getByTestId('shopping-cart-product-quantity'),
    increaseQuantity: () => cy.getByTestId('product-increase-quantity'),
    clearList: () => cy.getByTestId('limparLista'),
    emptyMessage: () => cy.contains('Seu carrinho está vazio'),
  };

  shouldContainProduct(name, quantity = 1) {
    this.shouldBeOnPage();
    this.elements.title().should('have.text', 'Lista de Compras');
    this.elements.productNames().should('have.length', 1).and('contain.text', name);
    this.elements.productQuantities().should('contain.text', `Total: ${quantity}`);
    return this;
  }

  increaseQuantity() {
    this.elements.increaseQuantity().click();
    return this;
  }

  clear() {
    this.elements.clearList().click();
    return this;
  }
}

export default new ShoppingListPage();
