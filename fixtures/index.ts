import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LoggedInPage } from '../pages/LoggedInPage';
import { ExceptionsPage } from '../pages/ExceptionsPage';
import { TablePage } from '../pages/TablePage';

type Pages = {
  loginPage: LoginPage;
  loggedInPage: LoggedInPage;
  exceptionsPage: ExceptionsPage;
  tablePage: TablePage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  loggedInPage: async ({ page }, use) => {
    await use(new LoggedInPage(page));
  },
  exceptionsPage: async ({ page }, use) => {
    await use(new ExceptionsPage(page));
  },
  tablePage: async ({ page }, use) => {
    await use(new TablePage(page));
  },
});

export { expect } from '@playwright/test';
