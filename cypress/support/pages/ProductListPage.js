import BasePage from './BasePage';

class ProductListPage extends BasePage {
  constructor() {
    super('/admin/listarprodutos');
  }

  elements = {
    title: () => cy.get('h1'),
    table: () => cy.get('table'),
    rowByName: (name) => cy.contains('table tbody tr', name),
  };

  /** Garante que o produto aparece na tabela com nome, preço, descrição e quantidade corretos. */
  shouldListProduct({ nome, preco, descricao, quantidade }) {
    this.shouldBeOnPage();
    this.elements
      .rowByName(nome)
      .should('be.visible')
      .find('td')
      .then(($cells) => {
        const values = [...$cells].map((cell) => cell.innerText.trim());
        expect(values.slice(0, 4)).to.deep.equal([
          nome,
          String(preco),
          descricao,
          String(quantidade),
        ]);
      });
    return this;
  }
}

export default new ProductListPage();
