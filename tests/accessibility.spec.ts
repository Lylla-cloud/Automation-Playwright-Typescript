import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../fixtures';

// Known issues on the practice site, which we don't own and can't fix.
// Remove an entry when the site fixes it; add one only after reviewing it.
const knownViolations: Record<string, string[]> = {
  Login: [],
  Exceptions: ['label'], // a form field has no accessible label
  Table: ['aria-required-children'], // enrollment listbox does not directly contain options
};

const pages = [
  { name: 'Login', path: '/practice-test-login/', ready: '#submit' },
  { name: 'Exceptions', path: '/practice-test-exceptions/', ready: '#add_btn' },
  { name: 'Table', path: '/practice-test-table/', ready: '#courses_table tbody tr' },
];

test.describe('Accessibility scan', { tag: ['@a11y', '@regression'] }, () => {
  for (const { name, path, ready } of pages) {
    test(`${name} page: no new WCAG A or AA violations`, async ({ page }) => {
      await page.goto(path);
      await page.locator(ready).first().waitFor();

      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

      await test.info().attach(`axe-${name}`, {
        body: JSON.stringify(results.violations, null, 2),
        contentType: 'application/json',
      });

      const known = knownViolations[name];
      const found = results.violations.map((v) => v.id);

      // Violations that are not in the baseline
      const newOnes = results.violations
        .filter((v) => !known.includes(v.id))
        .map((v) => {
          const targets = v.nodes.map((n) => n.target.join(' ')).join(' | ');
          return `[${v.impact}] ${v.id}: ${v.help} -> ${targets}`;
        });

      // Baseline entries that no longer appear: the site fixed them.
      // Shown as annotations in the HTML report instead of branching in the test.
      const fixed = known.filter((id) => !found.includes(id));
      test.info().annotations.push(
        ...fixed.map((id) => ({
          type: 'baseline-fixed',
          description: `${id} is no longer reported on ${name}; remove it from knownViolations`,
        })),
      );

      expect(newOnes, `New accessibility violations on ${name}`).toEqual([]);
    });
  }
});
