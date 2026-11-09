/** Mensagens retornadas pela API/Front do ServeRest, centralizadas para evitar strings mágicas. */
export const MESSAGES = Object.freeze({
  login: {
    success: 'Login realizado com sucesso',
    invalidCredentials: 'Email e/ou senha inválidos',
  },
  user: {
    created: 'Cadastro realizado com sucesso',
    deleted: 'Registro excluído com sucesso',
    duplicatedEmail: 'Este email já está sendo usado',
    notFound: 'Usuário não encontrado',
  },
  product: {
    created: 'Cadastro realizado com sucesso',
    duplicatedName: 'Já existe produto com esse nome',
    adminOnly: 'Rota exclusiva para administradores',
  },
  auth: {
    invalidToken: 'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais',
  },
});
