# Bridge Labs QA Assessment - Automation

This document outlines the approach, tools, and instructions for running the automated tests for the Safer City Crime Reporting Form.

## Framework and Tools

**Framework:** Playwright (TypeScript/Node.js)

**Justification:**
Playwright was chosen for several reasons:
1. **Speed and Reliability:** It executes tests extremely fast out of the process, features auto-wait functionalities that reduce flakiness drastically, and supports modern web applications seamlessly.
2. **Cross-Browser Support:** Natively supports Chromium, Firefox, and WebKit without additional driver configurations.
3. **Built-in Assertions and Selectors:** Offers powerful locators and built-in web-first assertions out of the box.
4. **TypeScript Support:** Excellent out-of-the-box TypeScript support providing better tooling, maintainability, and compilation checks. I use React quite often so I really find it useful

## Scenarios Tested

The suite covers **Section 1: Complete Crime Reporting Process (End-to-End Testing)** and **Section 2: Form Validation and Error Handling**.

- Navigation to the Crime Reporting application.
- Filling out Step 1 (Personal Details) and verifying successful progression to Step 2.
- Filling out Step 2 (Crime Details) including custom selects and text areas.
- **Modifying Location Details:** Entering a new location immediately prior to submission.
- **Mock File Upload:** Testing the `input[type="file"]` ability to receive and attach a mock log file as evidence.
- **Form Submission:** Triggering the final submission.
- **Validation (Step 1):** Testing boundary limits on character length, empty required fields, digit limits on phone numbers, and invalid email formatting.
- **Validation (Step 2):** Testing empty submission states for Step 2 and verification of invalid file types.
- **Success Verification:** Attempting to verify the success response/confirmation phrase.

## Summary of Automated Test Coverage

The implemented test scripts `tests/crime.spec.ts` and `tests/crime-validation.spec.ts` cover the full end-to-end user journey as well as extensive functional, negative, and boundary testing. This covers 100% of the Success Criteria listed in Section 1 and automates the major validation paths listed in Section 2.

* The Page Object Model (`CrimeReportPage.ts`) abstracts the locators and makes it highly reusable.
* Data is externalized into `data/testData.json` allowing for rapid data-driven testing in future iterations.
* Several tests document known bugs (e.g., the email validation bug) and are marked expected to fail or skip pending feature maturity.

## Assumptions Made

Due to working in a black-box environment with limited immediate feedback from the actual live submission endpoint:
1. **Success Confirmation:** It is assumed that upon successful submission, some form of feedback containing the word "success" or "Thank you" is displayed. A loose assertion is handled in the script for this reason.
2. **Phone Number Input:** The `react-tel-input` is assumed to handle `.fill()` directly. If it has strict mask properties, more exact keystrokes might be theoretically needed, but Playwright usually handles inputs comprehensively.

## Instructions on How to Run the Tests Locally

**Prerequisites:** Node.js must be installed on your machine.

1. **Navigate to the assessment directory:**
```bash
cd /path/to/playwright-assessment
```

2. **Install necessary dependencies and Playwright browsers:**
```bash
npm install
npx playwright install
```

3. **Run the tests (headless mode defaults):**
```bash
npx playwright test
```

4. **Run the tests with UI mode (great for debugging):**
```bash
npx playwright test --ui
```

5. **Generate an HTML Report:**
```bash
npx playwright show-report
```
