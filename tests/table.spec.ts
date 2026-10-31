import { test, expect } from '../fixtures';
import { TablePage } from '../pages/TablePage';

const LANGUAGE_COLUMN = 3;
const LEVEL_COLUMN = 4;

const levels = ['Beginner', 'Intermediate', 'Advanced'];

// True when at least one row is visible and every visible row has `value` in the given column
const columnIs = (tablePage: TablePage, column: number, value: string) => async () => {
  const values = await tablePage.columnValues(column);
  return values.length > 0 && values.every(v => v === value);
};

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

    await expect
      .poll(columnIs(tablePage, LANGUAGE_COLUMN, 'Python'), {
        message: 'all visible rows should be Python',
      })
      .toBe(true);
  });

  for (const level of levels) {
    test(`filtering by ${level} shows only ${level} courses`, async ({ tablePage }) => {
      await tablePage.filterByLevel(level);

      await expect
        .poll(columnIs(tablePage, LEVEL_COLUMN, level), {
          message: `all visible rows should be ${level}`,
        })
        .toBe(true);
    });
  }

  test('a filter reduces the number of rows', async ({ tablePage }) => {
    const allRows = await tablePage.rowCount();

    await tablePage.filterByLanguage('Python');

    await expect.poll(() => tablePage.rowCount()).toBeLessThan(allRows);
  });

  test('combining language and level filters applies both', async ({ tablePage }) => {
    await tablePage.filterByLanguage('Python');
    await tablePage.filterByLevel('Beginner');

    await expect
      .poll(columnIs(tablePage, LANGUAGE_COLUMN, 'Python'), {
        message: 'all visible rows should be Python',
      })
      .toBe(true);
    await expect
      .poll(columnIs(tablePage, LEVEL_COLUMN, 'Beginner'), {
        message: 'all visible rows should be Beginner',
      })
      .toBe(true);
  });
});