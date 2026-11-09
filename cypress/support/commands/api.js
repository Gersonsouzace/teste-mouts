import { validateSchema } from '../utils/schemaValidator';
import { registerForCleanup } from '../utils/cleanup';

const apiUrl = () => Cypress.expose('apiUrl');

/**
 * Wrapper de cy.request para a API do ServeRest.
 * Não falha automaticamente em status != 2xx para que o próprio teste faça as asserções.
 */
Cypress.Commands.add('api', ({ method = 'GET', path, body, token, qs } = {}) =>
  cy.request({
    method,
    url: `${apiUrl()}${path}`,
    body,
    qs,
    headers: token ? { Authorization: token } : {},
    failOnStatusCode: false,
  }),
);

// ---------- Usuários ----------
Cypress.Commands.add('apiCreateUser', (user) =>
  cy.api({ method: 'POST', path: '/usuarios', body: user }).then((response) => {
    if (response.status === 201)
      registerForCleanup({ resource: 'usuarios', id: response.body._id });
    return response;
  }),
);

Cypress.Commands.add('apiGetUser', (id) => cy.api({ path: `/usuarios/${id}` }));

Cypress.Commands.add('apiDeleteUser', (id) =>
  cy.api({ method: 'DELETE', path: `/usuarios/${id}` }),
);

// ---------- Login ----------
Cypress.Commands.add('apiLogin', ({ email, password }) =>
  cy.api({ method: 'POST', path: '/login', body: { email, password } }),
);

/**
 * Cria um usuário via API e realiza login, retornando { user, id, token }.
 */
Cypress.Commands.add('apiCreateUserAndLogin', (user) =>
  cy.apiCreateUser(user).then(({ status, body }) => {
    expect(status, 'pré-condição: usuário criado').to.eq(201);
    const id = body._id;
    return cy.apiLogin(user).then((login) => {
      expect(login.status, 'pré-condição: login realizado').to.eq(200);
      return { user, id, token: login.body.authorization };
    });
  }),
);

// ---------- Produtos ----------
Cypress.Commands.add('apiCreateProduct', (product, token) =>
  cy.api({ method: 'POST', path: '/produtos', body: product, token }).then((response) => {
    if (response.status === 201) {
      registerForCleanup({ resource: 'produtos', id: response.body._id, token });
    }
    return response;
  }),
);

Cypress.Commands.add('apiGetProducts', (qs) => cy.api({ path: '/produtos', qs }));

Cypress.Commands.add('apiGetProduct', (id) => cy.api({ path: `/produtos/${id}` }));

Cypress.Commands.add('apiDeleteProduct', (id, token) =>
  cy.api({ method: 'DELETE', path: `/produtos/${id}`, token }),
);

// ---------- Limpeza de massa criada pela UI ----------
/** Registra para limpeza um usuário criado pela interface, localizando-o pelo e-mail. */
Cypress.Commands.add('trackUserForCleanup', (email) =>
  cy.api({ path: '/usuarios', qs: { email } }).then(({ body }) => {
    body.usuarios?.forEach(({ _id }) => registerForCleanup({ resource: 'usuarios', id: _id }));
  }),
);

/** Registra para limpeza um produto criado pela interface, localizando-o pelo nome. */
Cypress.Commands.add('trackProductForCleanup', (nome, token) =>
  cy.apiGetProducts({ nome }).then(({ body }) => {
    body.produtos?.forEach(({ _id }) =>
      registerForCleanup({ resource: 'produtos', id: _id, token }),
    );
  }),
);

// ---------- Contrato ----------
/**
 * Valida o body da resposta contra um JSON Schema em cypress/fixtures/schemas.
 * Uso: cy.apiGetUser(id).validateSchema('usuario')
 */
Cypress.Commands.add('validateSchema', { prevSubject: true }, (response, schemaName) =>
  cy.fixture(`schemas/${schemaName}.schema.json`).then((schema) => {
    const { valid, errors } = validateSchema(schema, response.body);
    expect(valid, `contrato "${schemaName}" válido${errors ? `:\n${errors}` : ''}`).to.be.true;
    return response;
  }),
);
