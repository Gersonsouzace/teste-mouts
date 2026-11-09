import { buildAdminUser, buildUser } from '../../support/factories/userFactory';
import { AdminHomePage, LoginPage, SignUpPage } from '../../support/pages';
import { allureMeta, Severity } from '../../support/utils/allure';
import { MESSAGES } from '../../support/utils/messages';

describe('Frontend | Cadastro de usuário', () => {
  beforeEach(() => {
    allureMeta({ epic: 'Frontend', feature: 'Cadastro de usuário', tags: ['e2e'] });
    cy.intercept('POST', '**/usuarios').as('createUser');
    LoginPage.visit().goToSignUp();
    SignUpPage.shouldBeOnPage();
  });

  it('deve cadastrar um administrador e direcioná-lo para a home administrativa', () => {
    allureMeta({ story: 'Cadastro com sucesso', severity: Severity.CRITICAL });
    const admin = buildAdminUser();

    SignUpPage.signUp(admin);

    cy.wait('@createUser').then(({ request, response }) => {
      expect(request.body).to.include({ email: admin.email, administrador: 'true' });
      expect(response.statusCode).to.eq(201);
    });
    cy.trackUserForCleanup(admin.email);

    AdminHomePage.shouldWelcome(admin.nome);
  });

  it('não deve cadastrar usuário com e-mail já utilizado', () => {
    allureMeta({ story: 'Validação de cadastro', severity: Severity.NORMAL });
    const existingUser = buildUser();
    cy.apiCreateUser(existingUser).its('status').should('eq', 201);

    SignUpPage.signUp(buildUser({ email: existingUser.email }));

    cy.wait('@createUser').its('response.statusCode').should('eq', 400);
    SignUpPage.shouldShowAlert(MESSAGES.user.duplicatedEmail).shouldBeOnPage();
  });
});
