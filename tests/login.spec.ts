import { test, expect } from '../fixtures';

type InvalidLogin = {
  name: string;
  username: string;
  password: string;
  expectedError: string;
  smoke?: boolean;
};

const invalidLogins: InvalidLogin[] = [
  { name: 'wrong username',    username: 'wrongUser', password: 'Password123',   expectedError: 'Your username is invalid!' },
  { name: 'wrong password',    username: 'student',   password: 'wrongPassword', expectedError: 'Your password is invalid!', smoke: true },
  { name: 'empty username',    username: '',          password: 'Password123',   expectedError: 'Your username is invalid!' },
  { name: 'empty password',    username: 'student',   password: '',              expectedError: 'Your password is invalid!' },
  { name: 'both fields empty', username: '',          password: '',              expectedError: 'Your username is invalid!' },
  { name: 'username in caps',  username: 'STUDENT',   password: 'Password123',   expectedError: 'Your username is invalid!' },
];

test.describe('Login page', { tag: '@regression' }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('valid credentials log the user in', { tag: '@smoke' }, async ({ loginPage, loggedInPage, page }) => {
    await loginPage.login('student', 'Password123');

    await expect(page).toHaveURL(/logged-in-successfully/);
    await expect(loggedInPage.successText).toBeVisible();
    await expect(loggedInPage.logoutLink).toBeVisible();
  });

  test('user can log out and return to the login page', { tag: '@smoke' }, async ({ loginPage, loggedInPage, page }) => {
    await loginPage.login('student', 'Password123');
    await expect(page).toHaveURL(/logged-in-successfully/);

    await loggedInPage.logout();

    await expect(page).toHaveURL(/practice-test-login/);
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  for (const { name, username, password, expectedError, smoke } of invalidLogins) {
    test(`login fails: ${name}`, { tag: smoke ? ['@smoke'] : [] }, async ({ loginPage, page }) => {
      await loginPage.login(username, password);

      await expect(loginPage.errorMessage).toHaveText(expectedError);
      await expect(page).not.toHaveURL(/logged-in-successfully/);
    });
  }
});
