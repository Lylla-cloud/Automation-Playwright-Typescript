import { Page, Locator } from '@playwright/test';

export class TablePage {
  readonly page: Page;
  readonly headers: Locator;
  readonly visibleRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headers = page.locator('#courses_table th');
    this.visibleRows = page.locator('#courses_table tbody tr:visible');
  }

  async goto() {
    await this.page.goto('/practice-test-table/');
  }

  async filterByLanguage(language: string) {
    await this.page.getByLabel(language).check();
  }

  async columnValues(columnIndex: number): Promise<string[]> {
    const cells = this.visibleRows.locator(`td:nth-child(${columnIndex})`);
    return (await cells.allTextContents()).map(t => t.trim());
  }
}