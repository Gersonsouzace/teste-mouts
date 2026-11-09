import { buildUser } from '../../support/factories/userFactory';
import { allureMeta, Severity } from '../../support/utils/allure';
import { MESSAGES } from '../../support/utils/messages';

describe('API | Login', () => {
  let user;

  beforeEach(() => {
    allureMeta({ epic: 'API', feature: 'Login', tags: ['api'] });
    user = buildUser();
    cy.apiCreateUser(user).its('status').should('eq', 201);
  });

  it('deve autenticar com credenciais válidas e retornar um token Bearer', () => {
    allureMeta({ story: 'Autenticação', severity: Severity.BLOCKER });

    cy.apiLogin(user)
      .validateSchema('login')
      .then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.message).to.eq(MESSAGES.login.success);
        expect(body.authorization).to.match(/^Bearer\s.+/);
      });
  });

  // Cenário orientado a dados: mesmo comportamento validado com entradas diferentes
  const invalidCredentials = [
    {
      caso: 'senha incorreta',
      build: (u) => ({ email: u.email, password: 'senhaErrada123' }),
    },
    {
      caso: 'e-mail não cadastrado',
      build: (u) => ({ email: `inexistente.${Date.now()}@qa.com.br`, password: u.password }),
    },
  ];

  invalidCredentials.forEach(({ caso, build }) => {
    it(`não deve autenticar com ${caso}`, () => {
      allureMeta({ story: 'Autenticação', severity: Severity.CRITICAL });

      cy.apiLogin(build(user)).then(({ status, body }) => {
        expect(status).to.eq(401);
        expect(body.message).to.eq(MESSAGES.login.invalidCredentials);
        expect(body).to.not.have.property('authorization');
      });
    });
  });

  it('deve validar os campos obrigatórios do login', () => {
    allureMeta({ story: 'Validação de campos', severity: Severity.NORMAL });

    cy.apiLogin({ email: '', password: '' }).then(({ status, body }) => {
      expect(status).to.eq(400);
      expect(body).to.deep.equal({
        email: 'email não pode ficar em branco',
        password: 'password não pode ficar em branco',
      });
    });
  });
});
