import { faker } from '@faker-js/faker';

/**
 * Gera um usuário válido e único para o ServeRest.
 * @param {Partial<{nome: string, email: string, password: string, administrador: 'true'|'false'}>} overrides
 */
export const buildUser = (overrides = {}) => ({
  nome: faker.person.fullName(),
  email: `qa.${Date.now()}.${faker.string.alphanumeric(6).toLowerCase()}@qa.com.br`,
  password: faker.internet.password({ length: 12 }),
  administrador: 'false',
  ...overrides,
});

export const buildAdminUser = (overrides = {}) =>
  buildUser({ administrador: 'true', ...overrides });
