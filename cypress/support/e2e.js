import 'allure-cypress';
import './commands/api';
import './commands/ui';
import { cleanupResources } from './utils/cleanup';

afterEach(() => {
  cleanupResources();
});
