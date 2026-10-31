import { Page, Locator } from '@playwright/test';

export class LoggedInPage {
  readonly page: Page;
  readonly successText: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.successText = page.getByText('successfully logged in');
    this.logoutLink = page.getByRole('link', { name: 'Log out' });
  }

  async logout() {
    await this.logoutLink.click();
  }
}