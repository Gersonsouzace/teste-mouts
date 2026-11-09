import { buildUser } from '../../support/factories/userFactory';
import { allureMeta, Severity } from '../../support/utils/allure';
import { MESSAGES } from '../../support/utils/messages';

describe('API | Usuários', () => {
  beforeEach(() => {
    allureMeta({ epic: 'API', feature: 'Usuários', tags: ['api'] });
  });

  it('deve cadastrar um usuário e persistir os dados informados', () => {
    allureMeta({ story: 'Cadastro de usuário', severity: Severity.CRITICAL });
    const user = buildUser();

    cy.apiCreateUser(user)
      .validateSchema('cadastro')
      .then(({ status, body }) => {
        expect(status).to.eq(201);
        expect(body.message).to.eq(MESSAGES.user.created);

        cy.apiGetUser(body._id)
          .validateSchema('usuario')
          .then((getResponse) => {
            expect(getResponse.status).to.eq(200);
            expect(getResponse.body).to.deep.equal({ ...user, _id: body._id });
          });
      });
  });

  it('não deve permitir cadastrar usuário com e-mail já utilizado', () => {
    allureMeta({ story: 'Cadastro de usuário', severity: Severity.NORMAL });
    const user = buildUser();

    cy.apiCreateUser(user).its('status').should('eq', 201);

    cy.apiCreateUser(buildUser({ email: user.email }))
      .validateSchema('erro')
      .then(({ status, body }) => {
        expect(status).to.eq(400);
        expect(body.message).to.eq(MESSAGES.user.duplicatedEmail);
      });
  });

  it('deve excluir um usuário existente', () => {
    allureMeta({ story: 'Exclusão de usuário', severity: Severity.NORMAL });

    cy.apiCreateUser(buildUser()).then(({ body: { _id: id } }) => {
      cy.apiDeleteUser(id).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.message).to.eq(MESSAGES.user.deleted);
      });

      cy.apiGetUser(id).then(({ status, body }) => {
        expect(status).to.eq(400);
        expect(body.message).to.eq(MESSAGES.user.notFound);
      });
    });
  });
});
