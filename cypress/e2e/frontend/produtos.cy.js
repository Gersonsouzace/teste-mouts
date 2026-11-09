import { buildAdminUser } from '../../support/factories/userFactory';
import { buildProduct } from '../../support/factories/productFactory';
import { AdminHomePage, ProductFormPage, ProductListPage } from '../../support/pages';
import { allureMeta, Severity } from '../../support/utils/allure';

describe('Frontend | Gestão de produtos (administrador)', () => {
  let adminToken;

  beforeEach(() => {
    allureMeta({ epic: 'Frontend', feature: 'Produtos', tags: ['e2e'] });
    const admin = buildAdminUser();

    // Pré-condição via API + login programático: o foco do teste é o cadastro de produto
    cy.apiCreateUserAndLogin(admin).then(({ token }) => {
      adminToken = token;
    });
    cy.loginViaApi(admin);
    AdminHomePage.visit().shouldWelcome(admin.nome);
  });

  it('deve cadastrar um produto e exibi-lo na listagem de produtos', () => {
    allureMeta({ story: 'Cadastro de produto', severity: Severity.CRITICAL });
    const product = buildProduct();
    cy.intercept('POST', '**/produtos').as('createProduct');

    AdminHomePage.goToRegisterProduct();
    ProductFormPage.shouldBeOnPage().register(product);

    cy.wait('@createProduct').then(({ response }) => {
      expect(response.statusCode).to.eq(201);
    });
    cy.trackProductForCleanup(product.nome, adminToken);

    ProductListPage.shouldListProduct(product);
  });
});
