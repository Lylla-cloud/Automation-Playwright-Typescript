import { Page, Locator, expect } from '@playwright/test';

const ALL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

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
    await this.page
      .getByRole('group', { name: 'Language' })
      .getByLabel(language, { exact: true })
      .check();
  }

  // Ticks the given levels and unticks all the others
  async selectLevels(...selected: string[]) {
    const group = this.page.getByRole('group', { name: 'Level' });
    for (const level of ALL_LEVELS) {
      await group.getByLabel(level, { exact: true }).setChecked(selected.includes(level));
    }
  }

  async filterByLevel(level: string) {
    await this.selectLevels(level);
  }

  // option is the visible text: 'Any', '5,000+', '10,000+' or '50,000+'
  async filterByMinEnrollments(option: string) {
    const dropdown = this.page.locator('#enrollDropdown');

    await dropdown.getByRole('button').click();
    await dropdown.getByRole('option', { name: option, exact: true }).click();

    // The button label updates once the choice is applied
    await expect(dropdown.locator('.dropdown-label')).toHaveText(option);
  }

  // label is the visible text: 'ID', 'Course Name', 'Language', 'Level' or 'Enrollments'
  async sortBy(label: string) {
    await this.page.locator('#sortBy').selectOption({ label });
  }
  async reset() {
    await this.page.getByRole('button', { name: 'Reset filters' }).click();
  }

  // Current ticked state of the Level checkboxes, in the order Beginner, Intermediate, Advanced
  async levelStates(): Promise<boolean[]> {
    const group = this.page.getByRole('group', { name: 'Level' });
    return Promise.all(
      ALL_LEVELS.map((level) => group.getByLabel(level, { exact: true }).isChecked()),
    );
  }
  async rowCount(): Promise<number> {
    return this.visibleRows.count();
  }

  async columnValues(columnIndex: number): Promise<string[]> {
    const cells = this.visibleRows.locator(`td:nth-child(${columnIndex})`);
    return (await cells.allTextContents()).map((t) => t.trim());
  }

  async columnNumbers(columnIndex: number): Promise<number[]> {
    const values = await this.columnValues(columnIndex);
    return values.map((v) => Number(v.replace(/,/g, '')));
  }
}
