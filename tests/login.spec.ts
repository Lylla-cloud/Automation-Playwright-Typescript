import { test, expect } from '../fixtures';

test.describe('Login page', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('valid credentials log the user in', async ({ loginPage, loggedInPage, page }) => {
    await loginPage.login('student', 'Password123');

    await expect(page).toHaveURL(/logged-in-successfully/);
    await expect(loggedInPage.successText).toBeVisible();
    await expect(loggedInPage.logoutLink).toBeVisible();
  });

  test('invalid username shows an error', async ({ loginPage }) => {
    await loginPage.login('wrongUser', 'Password123');
    await expect(loginPage.errorMessage).toHaveText('Your username is invalid!');
  });

  test('invalid password shows an error', async ({ loginPage }) => {
    await loginPage.login('student', 'wrongPassword');
    await expect(loginPage.errorMessage).toHaveText('Your password is invalid!');
  });
});
