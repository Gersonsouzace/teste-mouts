import BasePage from './BasePage';

class SignUpPage extends BasePage {
  constructor() {
    super('/cadastrarusuarios');
  }

  elements = {
    name: () => cy.getByTestId('nome'),
    email: () => cy.getByTestId('email'),
    password: () => cy.getByTestId('password'),
    adminCheckbox: () => cy.getByTestId('checkbox'),
    submit: () => cy.getByTestId('cadastrar'),
  };

  /** @param {{ nome: string, email: string, password: string, administrador: 'true'|'false' }} user */
  signUp({ nome, email, password, administrador }) {
    this.elements.name().type(nome);
    this.elements.email().type(email);
    this.elements.password().type(password, { log: false });
    if (administrador === 'true') this.elements.adminCheckbox().check();
    this.elements.submit().click();
    return this;
  }
}

export default new SignUpPage();
