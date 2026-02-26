import { Page, Locator } from '@playwright/test';

export class CrimeReportPage {
    readonly page: Page;

    // --- Step 1: Personal Details ---
    readonly nameInput: Locator;
    readonly surnameInput: Locator;
    readonly phoneInput: Locator;
    readonly emailInput: Locator;
    readonly nextButton: Locator;

    // --- Step 2: Crime Details ---
    readonly crimeTypeDropdown: Locator;
    readonly crimeDescriptionTextarea: Locator;
    readonly locationInput: Locator;
    readonly fileUploadInput: Locator;
    readonly reportedToPoliceNoRadio: Locator;
    readonly reportedToPoliceYesRadio: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Locators for Step 1
        this.nameInput = page.locator('input#name');
        this.surnameInput = page.locator('input#surname');
        this.phoneInput = page.locator('input[name="phone"]');
        this.emailInput = page.locator('input#email');
        this.nextButton = page.getByRole('button', { name: 'Next' });
        this.submitButton = page.getByRole('button', { name: 'Submit Report' });

        // Locators for Step 2
        this.crimeTypeDropdown = page.getByRole('combobox', { name: 'Crime Type' });
        this.crimeDescriptionTextarea = page.locator('textarea#crime-description');
        this.locationInput = page.locator('input#crimeLocation');
        // File input is typically hidden, we should target input[type="file"]
        this.fileUploadInput = page.locator('input[type="file"]');
        this.reportedToPoliceNoRadio = page.locator('button[value="No"]');
        this.reportedToPoliceYesRadio = page.locator('button[value="Yes"]');
        this.submitButton = page.getByRole('button', { name: 'Submit Report' });
    }

    async navigate() {
        await this.page.goto('https://deploy-preview-2--safercitywebapp.netlify.app/crime');
    }

    async fillPersonalDetails(name: string, surname: string, phone: string, email: string) {
        await this.nameInput.click();
        await this.page.keyboard.type(name);

        await this.surnameInput.click();
        await this.page.keyboard.type(surname);

        // React-tel-input is notoriously tricky with standard .fill()
        await this.phoneInput.click();
        await this.page.keyboard.press('Control+A');
        await this.page.keyboard.press('Backspace');
        await this.page.keyboard.type(phone);

        await this.emailInput.click();
        await this.page.keyboard.type(email);
    }

    async clickNext() {
        await this.nextButton.click();
    }

    async fillCrimeDetails(crimeType: string, description: string, location: string, reportedToPolice: boolean) {
        // Open dropdown and select type
        await this.crimeTypeDropdown.click();
        // Since it's a select element that might be hidden or custom, we might need a more generic way or directly target the option
        // Wait for the native select and select by value, or click the custom item
        const selectNative = this.page.locator('select').first();
        if (await selectNative.isVisible()) {
            await selectNative.selectOption({ value: crimeType });
        } else {
            // fallback: if there's a custom dropdown menu opened
            await this.page.getByRole('option', { name: crimeType, exact: true }).click();
        }

        await this.crimeDescriptionTextarea.fill(description);
        await this.locationInput.fill(location);

        if (reportedToPolice) {
            await this.reportedToPoliceYesRadio.click({ force: true });
        } else {
            await this.reportedToPoliceNoRadio.click({ force: true });
        }
    }

    async uploadEvidence(filePath: string) {
        // Playwright handles hidden inputs well with setInputFiles
        await this.fileUploadInput.setInputFiles(filePath);
    }

    async submitReport() {
        await this.submitButton.click();
    }
}
