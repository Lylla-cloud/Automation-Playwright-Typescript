import { test, expect } from '../fixtures';
import { TablePage } from '../pages/TablePage';

const LANGUAGE_COLUMN = 3;
const LEVEL_COLUMN = 4;
const ENROLLMENTS_COLUMN = 5;

const levels = ['Beginner', 'Intermediate', 'Advanced'];

const enrollmentFilters = [
  { option: '5,000+', min: 5000 },
  { option: '10,000+', min: 10000 },
  { option: '50,000+', min: 50000 },
];

const sortOptions = [
  { label: 'ID', column: 1, numeric: true },
  { label: 'Course Name', column: 2, numeric: false },
  { label: 'Language', column: 3, numeric: false },
  { label: 'Level', column: 4, numeric: false },
  { label: 'Enrollments', column: 5, numeric: true },
];

const isAscendingNumbers = (values: number[]) =>
  values.every((v, i) => i === 0 || values[i - 1] <= v);

const isAscendingText = (values: string[]) =>
  values.every(
    (v, i) => i === 0 || values[i - 1].localeCompare(v, 'en', { sensitivity: 'base' }) <= 0,
  );

// True when at least one row is visible and every visible row has `value` in the given column
const columnIs = (tablePage: TablePage, column: number, value: string) => async () => {
  const values = await tablePage.columnValues(column);
  return values.length > 0 && values.every(v => v === value);
};

test.describe('Table page', { tag: '@regression' }, () => {
  test.beforeEach(async ({ tablePage }) => {
    await tablePage.goto();
  });

  test('table has the expected headers', { tag: '@smoke' }, async ({ tablePage }) => {
    await expect(tablePage.headers).toHaveText([
      'ID', 'Course Name', 'Language', 'Level', 'Enrollments', 'Link',
    ]);
  });

  test('filtering by Python shows only Python courses', { tag: '@smoke' }, async ({ tablePage }) => {
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

  for (const { option, min } of enrollmentFilters) {
    test(`min enrollments ${option} keeps only courses with ${min} or more`, async ({ tablePage }) => {
      const before = await tablePage.columnNumbers(ENROLLMENTS_COLUMN);
      const expectedCount = before.filter(n => n >= min).length;

      await tablePage.filterByMinEnrollments(option);

      await expect.poll(() => tablePage.rowCount()).toBe(expectedCount);
      const after = await tablePage.columnNumbers(ENROLLMENTS_COLUMN);
      expect(after.every(n => n >= min)).toBe(true);
    });
  }

  test('choosing Any restores all courses after an enrollment filter', async ({ tablePage }) => {
    const total = await tablePage.rowCount();

    await tablePage.filterByMinEnrollments('50,000+');
    await expect.poll(() => tablePage.rowCount()).toBeLessThan(total);

    await tablePage.filterByMinEnrollments('Any');
    await expect.poll(() => tablePage.rowCount()).toBe(total);
  });

  for (const { label, column, numeric } of sortOptions) {
    test(`sorting by ${label} orders that column ascending`, async ({ tablePage }) => {
      await tablePage.sortBy(label);

      await expect
        .poll(
          async () => {
            const raw = await tablePage.columnValues(column);
            if (raw.length === 0) return false;
            return numeric
              ? isAscendingNumbers(raw.map(v => Number(v.replace(/,/g, ''))))
              : isAscendingText(raw);
          },
          { message: `${label} column should be sorted ascending` },
        )
        .toBe(true);
    });
  }

  test('Reset restores the default filters and all rows', async ({ page, tablePage }) => {
    const total = await tablePage.rowCount();
    const initialLevels = await tablePage.levelStates();

    await tablePage.filterByLanguage('Python');
    await tablePage.filterByLevel('Beginner');
    await tablePage.filterByMinEnrollments('5,000+');
    await expect.poll(() => tablePage.rowCount()).toBeLessThan(total);

    await tablePage.reset();

    await expect.poll(() => tablePage.rowCount()).toBe(total);
    await expect(
      page.getByRole('group', { name: 'Language' }).getByLabel('Any', { exact: true }),
    ).toBeChecked();
    await expect(page.locator('#enrollDropdown .dropdown-label')).toHaveText('Any');
    expect(await tablePage.levelStates()).toEqual(initialLevels);
  });
});