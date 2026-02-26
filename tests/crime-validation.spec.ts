import { test, expect } from '@playwright/test';
import { CrimeReportPage } from '../pages/CrimeReportPage';
const path = require('path');

test.describe('Crime Reporting Form - Validation and Error Handling (Section 2)', () => {

    test('Should prevent progression from Step 1 with missing required inputs', async ({ page }) => {
        const crimePage = new CrimeReportPage(page);
        await crimePage.navigate();

        // Attempt to proceed without filling anything
        await crimePage.clickNext();

        await expect(page.getByText('1/2')).toBeVisible();

        await crimePage.phoneInput.fill('123'); // only 3 digits
        await crimePage.clickNext();
        await expect(page.getByText('Mobile number must be exactly 9 digits.')).toBeVisible();
    });

    test('Should handle phone numbers exceeding 9 digits', async ({ page }) => {
        const crimePage = new CrimeReportPage(page);
        await crimePage.navigate();

        await crimePage.phoneInput.fill('123456789012');
        await crimePage.clickNext();

        await expect(page.getByText('1/2')).toBeVisible();
    });

    test('Should boundary test Name and Surname fields (Max Length)', async ({ page }) => {
        const crimePage = new CrimeReportPage(page);
        await crimePage.navigate();

        // 300 character string
        const excessivelyLongString = 'A'.repeat(300);
        await crimePage.fillPersonalDetails(excessivelyLongString, excessivelyLongString, '821234567', 'test@example.com');
        await crimePage.clickNext();

        // If the form lacks max-length boundaries, it will proceed to 2/2
        // We will assert 2/2 is visible to see if it allows massive string injection
        await expect(page.getByText('2/2')).toBeVisible();
    });

    test.fail('Should handle invalid email formats on Step 1 gracefully', async ({ page }) => {
        // BUG IDENTIFIED: The application currently allows invalid emails through.
        // Expecting this to fail.
        const crimePage = new CrimeReportPage(page);
        await crimePage.navigate();

        await crimePage.nameInput.fill('John');
        await crimePage.surnameInput.fill('Doe');
        await crimePage.phoneInput.fill('821234567');
        await crimePage.emailInput.fill('invalid-email-format'); // Missing @

        await crimePage.clickNext();

        await expect(page.getByText('1/2')).toBeVisible();
    });

    test('Should prevent submission on Step 2 with missing required inputs', async ({ page }) => {
        const crimePage = new CrimeReportPage(page);
        await crimePage.navigate();

        // Valid Step 1
        await crimePage.fillPersonalDetails('John', 'Doe', '821234567', 'john@example.com');
        await crimePage.clickNext();
        await expect(page.getByText('2/2')).toBeVisible();

        // Attempt to submit Step 2 without filling anything
        await crimePage.submitReport();

        // Determine if we are still on the form preventing submission
        // Since we didn't fill out location or description, submission should be blocked
        // We assert the submit button is still in the DOM and visible
        await expect(crimePage.submitButton).toBeVisible();
    });

    test('Should gracefully handle unsupported file uploads (Size/Format)', async ({ page }) => {
        const crimePage = new CrimeReportPage(page);
        await crimePage.navigate();

        // Valid Step 1
        await crimePage.fillPersonalDetails('John', 'Doe', '821234567', 'john@example.com');
        await crimePage.clickNext();

        // For this test, you'd ideally have an intentionally bad file created beforehand
        // Here we just test the upload mechanism behavior as a placeholder.
        const mockInvalidFile = path.resolve(__dirname, '../data/invalid-format.exe');

        await crimePage.uploadEvidence(mockInvalidFile);

        await crimePage.submitReport();

        await expect(page.locator('text=/invalid|unsupported|failed|error/i').first()).toBeVisible({ timeout: 5000 });

    });

    test('Should reject future dates in Date of Incident field', async ({ page }) => {
        const crimePage = new CrimeReportPage(page);
        await crimePage.navigate();

        // Valid Step 1
        await crimePage.fillPersonalDetails('John', 'Doe', '821234567', 'john@example.com');
        await crimePage.clickNext();

        // Fill required fields in Step 2 so only Date validation is isolated
        await crimePage.fillCrimeDetails('Theft', 'Description of theft', 'Location of theft', true);

        await crimePage.submitReport();

        await expect(page.getByText(/cannot be in the future/i)).toBeVisible();
    });

});
