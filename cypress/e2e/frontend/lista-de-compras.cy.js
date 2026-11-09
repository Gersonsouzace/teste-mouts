import { buildAdminUser, buildUser } from '../../support/factories/userFactory';
import { buildProduct } from '../../support/factories/productFactory';
import { ShoppingListPage, UserHomePage } from '../../support/pages';
import { allureMeta, Severity } from '../../support/utils/allure';

describe('Frontend | Lista de compras (usuário comum)', () => {
  let product;

  beforeEach(() => {
    allureMeta({ epic: 'Frontend', feature: 'Lista de compras', tags: ['e2e'] });
    product = buildProduct();

    // Massa de dados isolada: produto exclusivo do teste, criado por um admin via API
    cy.apiCreateUserAndLogin(buildAdminUser()).then(({ token }) => {
      cy.apiCreateProduct(product, token).its('status').should('eq', 201);
    });

    const customer = buildUser();
    cy.apiCreateUser(customer).its('status').should('eq', 201);
    cy.loginViaApi(customer);
    UserHomePage.visit().shouldBeLoggedIn();
  });

  it('deve pesquisar um produto e adicioná-lo à lista de compras', () => {
    allureMeta({ story: 'Adicionar produto à lista', severity: Severity.CRITICAL });

    UserHomePage.searchProduct(product.nome);
    UserHomePage.elements.productCards().should('have.length', 1);
    UserHomePage.addToShoppingList(product.nome);

    ShoppingListPage.shouldContainProduct(product.nome, 1);

    ShoppingListPage.increaseQuantity();
    ShoppingListPage.elements.productQuantities().should('contain.text', 'Total: 2');
  });
});
