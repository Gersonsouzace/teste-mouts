import { STORAGE_KEYS } from '../utils/storageKeys';

/** Seleciona elementos pelo atributo data-testid (seletor resiliente recomendado pelo Cypress). */
Cypress.Commands.add('getByTestId', (testId, options) =>
  cy.get(`[data-testid="${testId}"]`, options),
);

/**
 * Lê um item do localStorage da aplicação.
 * Evita `cy.window().its('localStorage')`, que serializa o objeto Storage no log e
 * pode congelar o renderer quando usado dentro de cy.session.
 */
Cypress.Commands.add('getLocalStorage', (key) =>
  cy.window({ log: false }).then((win) => win.localStorage.getItem(key)),
);

/**
 * Login programático: autentica via API e injeta a sessão no localStorage,
 * evitando repetir o fluxo de login pela UI em todos os testes. Cacheado com cy.session.
 */
Cypress.Commands.add('loginViaApi', (user) => {
  cy.session(
    ['login', user.email],
    () => {
      cy.apiLogin(user).then(({ status, body }) => {
        expect(status, 'pré-condição: login via API').to.eq(200);
        cy.visit('/login');
        cy.window().then((win) => {
          win.localStorage.setItem(STORAGE_KEYS.token, body.authorization);
          win.localStorage.setItem(STORAGE_KEYS.name, user.nome);
          win.localStorage.setItem(STORAGE_KEYS.email, user.email);
          win.localStorage.setItem(STORAGE_KEYS.password, user.password);
        });
      });
    },
    {
      validate() {
        cy.getLocalStorage(STORAGE_KEYS.token).should('match', /^Bearer\s.+/);
      },
    },
  );
});
