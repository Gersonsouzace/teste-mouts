import { defineConfig } from 'allure';

export default defineConfig({
  name: 'ServeRest - Cypress Automation',
  output: './allure-report',
  historyPath: './allure-history.jsonl',
  plugins: {
    awesome: {
      options: {
        reportName: 'ServeRest - Cypress Automation',
        reportLanguage: 'en',
        singleFile: false,
        groupBy: ['parentSuite', 'suite', 'subSuite'],
      },
    },
  },
});
