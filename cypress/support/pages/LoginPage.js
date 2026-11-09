import BasePage from './BasePage';

class LoginPage extends BasePage {
  constructor() {
    super('/login');
  }

  elements = {
    email: () => cy.getByTestId('email'),
    password: () => cy.getByTestId('senha'),
    submit: () => cy.getByTestId('entrar'),
    signUpLink: () => cy.getByTestId('cadastrar'),
  };

  login({ email, password }) {
    this.elements.email().clear().type(email);
    this.elements.password().clear().type(password, { log: false });
    this.elements.submit().click();
    return this;
  }

  goToSignUp() {
    this.elements.signUpLink().click();
    return this;
  }
}

export default new LoginPage();
