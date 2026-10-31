# Automation-Playwright-Typescript

[![Playwright Tests](https://github.com/Lylla-cloud/playwright2/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/Lylla-cloud/playwright2/actions/workflows/playwright.yml)

End-to-end test automation for [Practice Test Automation](https://practicetestautomation.com/), built with [Playwright](https://playwright.dev/) and TypeScript using the Page Object Model (POM). Tests run on **Chromium** and **Firefox**, locally and in GitHub Actions.

## What is covered

| Area | Page under test | Scenarios |
|------|-----------------|-----------|
| Login | `/practice-test-login/` | Valid login, invalid username, invalid password |
| Exceptions | `/practice-test-exceptions/` | Edit and save Row 1, add and save Row 2 (delayed element) |
| Table | `/practice-test-table/` | Header validation, language, level and combined filters |

## Project structure

```
.
├── pages/                  # Page objects: locators and actions per page
│   ├── LoginPage.ts
│   ├── LoggedInPage.ts
│   ├── ExceptionsPage.ts
│   └── TablePage.ts
├── fixtures/
│   └── index.ts            # Custom fixtures that inject page objects into tests
├── tests/                  # Test specs: behaviour only, no raw locators
│   ├── login.spec.ts
│   ├── exceptions.spec.ts
│   └── table.spec.ts
├── playwright.config.ts    # Browsers, base URL, reporters, retries
└── .github/workflows/
    └── playwright.yml      # CI pipeline
```

## Design approach

- **Page Object Model:** each page class owns its locators and user actions. If the UI changes, only one file needs updating.
- **Custom fixtures:** page objects are provided to tests automatically, which keeps specs short and readable.
- **Auto-waiting assertions:** Playwright's web-first assertions retry until they pass or time out, so there are no hard-coded sleeps.
- **Base URL:** configured once in `playwright.config.ts`, so page objects use relative paths.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later (LTS recommended)
- Git

### Installation

```bash
git clone https://github.com/<your-username>/practice-test-automation.git
cd practice-test-automation
npm ci
npx playwright install chromium firefox
```

## Running the tests

```bash
npx playwright test                          # all tests, both browsers
npx playwright test --project=chromium       # Chromium only
npx playwright test --project=firefox        # Firefox only
npx playwright test tests/login.spec.ts      # a single file
npx playwright test --headed                 # watch the browser
npx playwright test --ui                     # interactive UI mode
npx playwright test --debug                  # step-through debugging
```

### View the report

```bash
npx playwright show-report
```

Traces and screenshots are captured on failure and included in the HTML report.

## Continuous integration

Tests run automatically on every push and pull request via GitHub Actions. The HTML report is uploaded as a build artifact on each run (open the run in the **Actions** tab and download `playwright-report`).

## Useful tools

- **Codegen:** record interactions and generate locators
  ```bash
  npx playwright codegen https://practicetestautomation.com/
  ```
- **Trace viewer:** inspect a failed test step by step
  ```bash
  npx playwright show-trace path/to/trace.zip
  ```

## Roadmap

- [ ] Data-driven negative login tests
- [ ] Logout scenario
- [x] Table filters: language, level (checkbox), combined
- [ ] Enrollment filter, sorting and reset
- [ ] Test tagging for smoke and regression runs

## Author
Lylla