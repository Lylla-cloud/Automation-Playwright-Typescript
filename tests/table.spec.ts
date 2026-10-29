import { test, expect } from '../fixtures';

test.describe('Table page', () => {
  test.beforeEach(async ({ tablePage }) => {
    await tablePage.goto();
  });

  test('table has the expected headers', async ({ tablePage }) => {
    await expect(tablePage.headers).toHaveText([
      'ID', 'Course Name', 'Language', 'Level', 'Enrollments', 'Link',
    ]);
  });

  test('filtering by Python shows only Python courses', async ({ tablePage }) => {
    await tablePage.filterByLanguage('Python');

    expect(await tablePage.visibleRows.count()).toBeGreaterThan(0);
    const languages = await tablePage.columnValues(3);
    for (const lang of languages) {
      expect(lang).toBe('Python');
    }
  });
});