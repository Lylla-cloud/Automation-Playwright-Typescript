import { Page, Locator } from '@playwright/test';

export class ExceptionsPage {
  readonly page: Page;
  readonly addButton: Locator;
  readonly editButton: Locator;
  readonly row1Input: Locator;
  readonly row1Save: Locator;
  readonly row2Input: Locator;
  readonly row2Save: Locator;
  readonly confirmation: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.locator('#add_btn');
    this.editButton = page.locator('#edit_btn');
    this.row1Input = page.locator('#row1 input');
    this.row1Save = page.locator('#row1').getByRole('button', { name: 'Save' });
    this.row2Input = page.locator('#row2 input');
    this.row2Save = page.locator('#row2').getByRole('button', { name: 'Save' });
    this.confirmation = page.locator('#confirmation');
  }

  async goto() {
    await this.page.goto('/practice-test-exceptions/');
  }

  async editRow1(value: string) {
    await this.editButton.click();
    await this.row1Input.fill(value);
    await this.row1Save.click();
  }

  async addRow2(value: string) {
    await this.addButton.click();
    await this.row2Input.fill(value); // auto-waits for the delayed row
    await this.row2Save.click();
  }
}