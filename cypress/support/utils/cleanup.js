/**
 * Registro dos recursos criados durante os testes para limpeza automática
 * (mantém a massa de dados do ambiente compartilhado do ServeRest limpa).
 * Produtos são removidos antes dos usuários.
 */
const ORDER = ['produtos', 'usuarios'];
let resources = [];

export const registerForCleanup = (resource) => {
  resources.push(resource);
};

export const cleanupResources = () => {
  const toDelete = [...resources].sort(
    (a, b) => ORDER.indexOf(a.resource) - ORDER.indexOf(b.resource),
  );
  resources = [];

  toDelete.forEach(({ resource, id, token }) => {
    cy.request({
      method: 'DELETE',
      url: `${Cypress.expose('apiUrl')}/${resource}/${id}`,
      headers: token ? { Authorization: token } : {},
      failOnStatusCode: false,
      log: false,
    });
  });
};
