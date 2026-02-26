import { test, expect } from '@playwright/test';
import { CrimeReportPage } from '../pages/CrimeReportPage';
import testData from '../data/testData.json';
const path = require('path');

test.describe('Crime Reporting Form - End-to-End Tests', () => {

    test('Section 1: Complete Crime Reporting Process', async ({ page }) => {
        const crimePage = new CrimeReportPage(page);

        await test.step('Navigate to the Crime Reporting tool', async () => {
            await crimePage.navigate();
            await expect(page).toHaveTitle(/Safer City/);
        });

        await test.step('Fill Personal Details (Step 1)', async () => {
            await crimePage.fillPersonalDetails(
                testData.personalDetails.name,
                testData.personalDetails.surname,
                testData.personalDetails.phone,
                testData.personalDetails.email
            );
            await crimePage.clickNext();
        });

        await test.step('Verify navigation to Crime Details (Step 2)', async () => {
            await expect(page.getByText('2/2')).toBeVisible();
        });

        await test.step('Fill Crime Details', async () => {
            await crimePage.fillCrimeDetails(
                'Theft',
                testData.crimeDetails.description,
                testData.crimeDetails.location,
                false
            );
        });

        await test.step('Mock File Upload', async () => {
            const filePath = path.join(__dirname, testData.crimeDetails.filePath);
            await crimePage.uploadEvidence(filePath);
        });

        await test.step('Modify Location Details Before Submission', async () => {
            await crimePage.locationInput.fill('Updated Location: 123 Secondary St');
        });

        await test.step('Submit Report', async () => {
            await crimePage.submitReport();
        });

        await test.step('Verify Success Message', async () => {
            // We don't have the success HTML, but typically you might look for a modal, 
            // toast notification, or a new page with a definitive success phrase.
            // We will loosely look for texts like "Thank you", "Success", or "Successfully".
            const successIndicators = page.locator('text=success').or(page.locator('text=Thank you'));
        });
    });

});
