import { test, expect } from '../fixtures';

test.describe('Exceptions page', { tag: '@regression' }, () => {
  test.beforeEach(async ({ exceptionsPage }) => {
    await exceptionsPage.goto();
  });

  test('edit and save Row 1', { tag: '@smoke' }, async ({ exceptionsPage }) => {
    await exceptionsPage.editRow1('Sushi');
    await expect(exceptionsPage.confirmation).toHaveText('Row 1 was saved');
  });

  test('add Row 2 and save it', async ({ exceptionsPage }) => {
    await exceptionsPage.addRow2('Pasta');
    await expect(exceptionsPage.confirmation).toHaveText('Row 2 was saved');
  });
});