import BasePage from './BasePage';

class ProductFormPage extends BasePage {
  constructor() {
    super('/admin/cadastrarprodutos');
  }

  elements = {
    title: () => cy.get('h1'),
    name: () => cy.getByTestId('nome'),
    price: () => cy.getByTestId('preco'),
    description: () => cy.getByTestId('descricao'),
    quantity: () => cy.getByTestId('quantity'),
    submit: () => cy.getByTestId('cadastarProdutos'),
  };

  /** @param {{ nome: string, preco: number, descricao: string, quantidade: number }} product */
  register({ nome, preco, descricao, quantidade }) {
    this.elements.name().type(nome);
    this.elements.price().type(String(preco));
    this.elements.description().type(descricao);
    this.elements.quantity().type(String(quantidade));
    this.elements.submit().click();
    return this;
  }
}

export default new ProductFormPage();
