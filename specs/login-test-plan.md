# Login Page Test Plan

**Target:** https://practicetestautomation.com/practice-test-login/  
**Scope:** Login page form, successful authentication, and documented invalid-credential feedback.  
**Project setup:** Playwright config uses `./tests`; tests should use the existing `loginPage` and `loggedInPage` fixtures from `../fixtures`.

## Preconditions and test data

- Start each scenario from a fresh page context at the login URL.
- The login form has Username and Password fields and a Submit button.
- Documented valid credentials: username `student`, password `Password123`.
- Scenarios are independent; do not rely on another scenario's login state.

## Scenario 1: Valid credentials log in successfully

1. Navigate to the login page.
2. Verify the Username and Password fields and Submit button are available.
3. Enter `student` in Username.
4. Enter `Password123` in Password.
5. Submit the form.
6. Verify the URL contains `/logged-in-successfully/`.
7. Verify the page displays success text such as “Congratulations” or “successfully logged in”.
8. Verify the Log out link is visible.

**Pass criteria:** All fields/actions are usable and the success URL, message, and Log out link are present.  
**Fail criteria:** Login is rejected, the expected destination/message is absent, or Log out is not visible.

## Scenario 2: Invalid username is rejected

1. Navigate to the login page in a fresh page context.
2. Enter `incorrectUser` in Username.
3. Enter the valid password `Password123` in Password.
4. Submit the form.
5. Verify an error message is visible.
6. Verify its exact text is `Your username is invalid!`.

**Pass criteria:** The login is rejected and the documented username error is displayed.  
**Fail criteria:** Login succeeds, no error is shown, or the message differs.

## Scenario 3: Invalid password is rejected

1. Navigate to the login page in a fresh page context.
2. Enter the valid username `student` in Username.
3. Enter `incorrectPassword` in Password.
4. Submit the form.
5. Verify an error message is visible.
6. Verify its exact text is `Your password is invalid!`.

**Pass criteria:** The login is rejected and the documented password error is displayed.  
**Fail criteria:** Login succeeds, no error is shown, or the message differs.

## Implementation notes

- Prefer accessible locators (labels and button role) where supported; otherwise use the existing page-object locators.
- Use Playwright web-first assertions for visibility, text, and URL checks.
- Keep scenarios isolated and avoid fixed sleeps; rely on locator/actionability and assertion auto-waiting.
- Do not add empty-field or logout-action behavior assertions without confirming the site's expected behavior.

## Existing coverage comparison

The current `tests/login.spec.ts` already covers the three documented credential scenarios and checks the success URL, success text, Log out visibility, and exact negative error texts. Before generating replacements, compare for meaningful improvements such as explicit form availability checks, accessible locator usage, and the same independent starting-state guarantees. Preserve existing coverage unless a clear improvement is demonstrated.
