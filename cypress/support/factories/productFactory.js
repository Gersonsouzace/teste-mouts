import { faker } from '@faker-js/faker';

/**
 * Gera um produto válido e com nome único para o ServeRest.
 * @param {Partial<{nome: string, preco: number, descricao: string, quantidade: number}>} overrides
 */
export const buildProduct = (overrides = {}) => ({
  nome: `${faker.commerce.productName()} ${faker.string.alphanumeric(8)}`,
  preco: faker.number.int({ min: 10, max: 5000 }),
  descricao: faker.commerce.productDescription().slice(0, 100),
  quantidade: faker.number.int({ min: 1, max: 100 }),
  ...overrides,
});
