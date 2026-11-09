import { buildAdminUser, buildUser } from '../../support/factories/userFactory';
import { buildProduct } from '../../support/factories/productFactory';
import { allureMeta, Severity } from '../../support/utils/allure';
import { MESSAGES } from '../../support/utils/messages';

describe('API | Produtos', () => {
  beforeEach(() => {
    allureMeta({ epic: 'API', feature: 'Produtos', tags: ['api'] });
  });

  context('usuário administrador', () => {
    let adminToken;

    beforeEach(() => {
      cy.apiCreateUserAndLogin(buildAdminUser()).then(({ token }) => {
        adminToken = token;
      });
    });

    it('deve cadastrar um produto e disponibilizá-lo para consulta', () => {
      allureMeta({ story: 'Cadastro de produto', severity: Severity.CRITICAL });
      const product = buildProduct();

      cy.apiCreateProduct(product, adminToken)
        .validateSchema('cadastro')
        .then(({ status, body }) => {
          expect(status).to.eq(201);
          expect(body.message).to.eq(MESSAGES.product.created);

          cy.apiGetProduct(body._id)
            .validateSchema('produto')
            .its('body')
            .should('deep.equal', { ...product, _id: body._id });

          cy.apiGetProducts({ nome: product.nome })
            .validateSchema('produtos')
            .its('body')
            .should((list) => {
              expect(list.quantidade).to.eq(1);
              expect(list.produtos[0]._id).to.eq(body._id);
            });
        });
    });

    it('não deve permitir cadastrar produto com nome já existente', () => {
      allureMeta({ story: 'Cadastro de produto', severity: Severity.NORMAL });
      const product = buildProduct();

      cy.apiCreateProduct(product, adminToken).its('status').should('eq', 201);

      cy.apiCreateProduct(buildProduct({ nome: product.nome }), adminToken).then(
        ({ status, body }) => {
          expect(status).to.eq(400);
          expect(body.message).to.eq(MESSAGES.product.duplicatedName);
        },
      );
    });
  });

  context('controle de acesso', () => {
    it('não deve permitir que usuário não administrador cadastre produto', () => {
      allureMeta({ story: 'Autorização', severity: Severity.CRITICAL });

      cy.apiCreateUserAndLogin(buildUser()).then(({ token }) => {
        cy.apiCreateProduct(buildProduct(), token).then(({ status, body }) => {
          expect(status).to.eq(403);
          expect(body.message).to.eq(MESSAGES.product.adminOnly);
        });
      });
    });

    it('não deve permitir cadastrar produto sem token de autenticação', () => {
      allureMeta({ story: 'Autorização', severity: Severity.CRITICAL });

      cy.apiCreateProduct(buildProduct()).then(({ status, body }) => {
        expect(status).to.eq(401);
        expect(body.message).to.eq(MESSAGES.auth.invalidToken);
      });
    });
  });
});
