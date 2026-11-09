import { buildUser } from '../../support/factories/userFactory';
import { LoginPage, UserHomePage } from '../../support/pages';
import { allureMeta, Severity } from '../../support/utils/allure';
import { MESSAGES } from '../../support/utils/messages';
import { STORAGE_KEYS } from '../../support/utils/storageKeys';

describe('Frontend | Login', () => {
  let user;

  beforeEach(() => {
    allureMeta({ epic: 'Frontend', feature: 'Login', tags: ['e2e'] });
    user = buildUser();
    cy.apiCreateUser(user).its('status').should('eq', 201);
    cy.intercept('POST', '**/login').as('login');
    LoginPage.visit();
  });

  it('deve autenticar um usuário comum e exibir a vitrine de produtos', () => {
    allureMeta({ story: 'Login com sucesso', severity: Severity.BLOCKER });

    LoginPage.login(user);

    cy.wait('@login').its('response.statusCode').should('eq', 200);
    UserHomePage.shouldBeLoggedIn();
    cy.getLocalStorage(STORAGE_KEYS.token).should('match', /^Bearer\s.+/);
  });

  it('não deve autenticar com senha inválida e deve exibir mensagem de erro', () => {
    allureMeta({ story: 'Login inválido', severity: Severity.CRITICAL });

    LoginPage.login({ email: user.email, password: 'senhaInvalida!' });

    cy.wait('@login').its('response.statusCode').should('eq', 401);
    LoginPage.shouldShowAlert(MESSAGES.login.invalidCredentials).shouldBeOnPage();
    cy.getLocalStorage(STORAGE_KEYS.token).should('be.null');
  });
});
