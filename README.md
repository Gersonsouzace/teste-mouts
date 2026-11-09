# ServeRest - Automação com Cypress

Testes automatizados **E2E (frontend)** e de **API** da aplicação [ServeRest](https://serverest.dev), feitos com Cypress, com relatório **Allure** e pipeline no **GitHub Actions**.

| Alvo     | URL                          |
| -------- | ---------------------------- |
| Frontend | https://front.serverest.dev/ |
| API      | https://serverest.dev/       |

## Stack

- [Cypress 16](https://www.cypress.io/): testes E2E e de API
- [Allure Report 3](https://allurereport.org/) (`allure-cypress`): relatório HTML
- [@faker-js/faker](https://fakerjs.dev/): massa de dados dinâmica
- [Ajv](https://ajv.js.org/): validação de contrato (JSON Schema)
- ESLint (`eslint-plugin-cypress`) + Prettier: padrão de código
- GitHub Actions: CI/CD

## Cenários

### API (11 testes)

| Spec             | Cenários                                                                                             |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| `usuarios.cy.js` | Cadastrar usuário e persistir os dados · Bloquear e-mail duplicado · Excluir usuário                 |
| `login.cy.js`    | Login válido com token Bearer · Senha incorreta · E-mail não cadastrado · Campos obrigatórios        |
| `produtos.cy.js` | Admin cadastra produto · Nome duplicado · Usuário comum recebe 403 · Requisição sem token recebe 401 |

### Frontend (6 testes)

| Spec                     | Cenários                                                                      |
| ------------------------ | ----------------------------------------------------------------------------- |
| `cadastro.cy.js`         | Cadastrar administrador e ir para a home admin · Bloquear e-mail já utilizado |
| `login.cy.js`            | Login de usuário comum · Senha inválida mostra mensagem de erro               |
| `produtos.cy.js`         | Admin cadastra produto pela UI e o vê na listagem                             |
| `lista-de-compras.cy.js` | Usuário pesquisa produto, adiciona à lista e altera a quantidade              |

## Estrutura

```
cypress/
├── e2e/
│   ├── api/                 # testes de API
│   └── frontend/            # testes E2E
├── fixtures/schemas/        # JSON Schemas (testes de contrato)
└── support/
    ├── commands/            # comandos customizados (api.js, ui.js)
    ├── factories/           # geradores de massa de dados (faker)
    ├── pages/               # Page Objects
    ├── utils/               # mensagens, cleanup, validação de schema, Allure
    └── e2e.js               # setup global
.github/workflows/ci.yml     # pipeline do GitHub Actions
```

## Boas práticas aplicadas

- **Page Objects** com uma classe base (`BasePage`) e seletores `data-testid`.
- **Comandos customizados** que funcionam como camada de serviço da API (`cy.apiCreateUser`, `cy.apiLogin`...).
- **Massa de dados isolada**: cada teste cria seus próprios dados com Faker, sem depender de dados fixos do ambiente.
- **Pré-condições via API** e **login programático** (`cy.loginViaApi` com `cy.session`): a UI só é usada para o fluxo que está sendo testado.
- **Limpeza automática**: usuários e produtos criados são excluídos no `afterEach`.
- **Testes de contrato** com JSON Schema (`.validateSchema('usuario')`).
- **Sem `cy.wait(ms)`**: sincronização com `cy.intercept` e asserções que tentam de novo até passar.
- **Asserções sobre o comportamento**: status, mensagem, persistência dos dados e efeito na tela.
- **Cenários orientados a dados** (data-driven) para variações do mesmo comportamento.
- Mensagens centralizadas em `utils/messages.js` (sem strings soltas nos testes).
- `retries` no modo `run` para reduzir falhas intermitentes de um ambiente público.

## Como executar

**Pré-requisito:** Node.js 20+ (recomendado 22, veja `.nvmrc`).

```bash
npm install
```

| Comando               | Descrição                                      |
| --------------------- | ---------------------------------------------- |
| `npm run cy:open`     | Abre o Cypress no modo interativo              |
| `npm test`            | Roda todos os testes (headless)                |
| `npm run test:api`    | Roda só os testes de API                       |
| `npm run test:e2e`    | Roda só os testes de frontend                  |
| `npm run test:report` | Limpa os resultados, roda tudo e gera o Allure |
| `npm run allure:open` | Abre o relatório Allure gerado                 |
| `npm run lint`        | Roda o ESLint                                  |

As URLs ficam em `cypress.config.js` (`baseUrl` e `expose.apiUrl`) e podem ser trocadas pela linha de comando:

```bash
npx cypress run --config baseUrl=https://outro-front --expose apiUrl=https://outra-api
```

## Relatório Allure

```bash
npm run test:report
```

```bash
npm run allure:open
```

O relatório HTML fica em `allure-report/`. Ele mostra os testes por épico/feature/story, severidade, tags, ambiente e os passos de cada teste.

> O relatório carrega os dados via HTTP, então abra-o com `npm run allure:open` (ou outro servidor), não pelo arquivo `index.html` direto.

## CI/CD (GitHub Actions)

O workflow [`ci.yml`](.github/workflows/ci.yml) roda em push e pull request para `main`, manualmente (`workflow_dispatch`) e de segunda a sexta às 09:00 (BRT).

1. **Lint**: ESLint + Prettier.
2. **Tests**: API e frontend rodam em paralelo (matrix) no Chrome, com `cypress-io/github-action`.
3. **Allure Report**: junta os resultados das duas suítes, gera o HTML e publica como artefato `allure-report`.
4. **Publish report**: no `main`, publica o relatório no **GitHub Pages**.

> Para publicar no Pages, ative em **Settings → Pages → Source: GitHub Actions**.
