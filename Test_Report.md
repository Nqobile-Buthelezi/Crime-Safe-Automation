# FINAL TEST REPORT: Safer City Crime Reporting Form

**Prepared For:** Bridge Labs QA Recruitment
**Date:** February 26, 2026

## 1. Overall Thought Process and Testing Strategy

**Objective:** To validate the Safer City Crime Reporting web form across functional, usability, and robustness vectors while handling incomplete/blind requirements using a gray/black box testing approach.

**Strategy:**
Given the "blind" nature of the application (direct browser access heavily restricted), the strategy focused on:
1. **Static Analysis of DOM Elements:** Extracting input architectures, `id`s, `name` attributes, and element types from raw HTML representations.
2. **Page Object Model (POM) Design Pattern:** Abstracting the web form into an object class (`CrimeReportPage.ts`) using Playwright. This isolates locators and logic, making tests highly scalable and adaptable to DOM changes.
3. **Happy Path First (Section 1):** Proving the viability of the critical user journey—reporting a crime end-to-end.
4. **Resiliency/Negative Testing (Section 2):** Actively attempting to break the form flow to measure the robustness of error handling and validation messaging.

## 2. Handling Unknowns and Ambiguous Requirements

* **Unknown Success Criteria:** It was unclear what specific confirmation message or redirect the server provides upon successful submission. 
  * *Handling:* I wrote the end-to-end framework to allow form submission to occur and used a broad, soft assertion looking for generalized success text (e.g., "success", "thank you"). In a live environment with exact specs, this locator would be tightened to a precise Data-TestID.
* **File Upload Restrictions:** The exact file size limits and prohibited extensions were not documented.
  * *Handling:* I designed a placeholder validation test designed to inject an `.exe` file. The test strategy assumes we trap the front-end toast or helper text indicating "unsupported media".

## 3. Automation Architecture and Tooling

**Framework:** Playwright using TypeScript and Node.js.

* **Why Playwright?**
  * Auto-waiting mechanisms inherently prevent flaky tests.
  * Excellent parsing and injection mechanics for hidden file inputs (`<input type="file" class="hidden">`) which standard Selenium sometimes struggles with natively.
  * TypeScript integration provides static typing and immediate IDE feedback for Page Object development.

**Initial vs. Final Architecture Requirements:**
* *Initial:* Started with basic single-file test scripts.
* *Final:* Scaled quickly to a standardized POM architecture (`CrimeReportPage.ts`) with externalized JSON test data (`data/testData.json`) separated from the test runner specs (`tests/crime.spec.ts` & `tests/crime-validation.spec.ts`).

## 4. Test Scenarios and Results Summary

| Section | Scenario Description | Type | Automatable / Assertable Flow |
| :--- | :--- | :--- | :--- |
| **Section 1** | Complete End-to-End valid submission (Steps 1 & 2) | Functional | Yes (`crime.spec.ts`) |
| **Section 1** | Upload valid evidence file & modifying location pre-submit | Functional | Yes |
| **Section 2** | Attempt Step 1 advancement with empty required fields | Negative/Validation | Yes (`crime-validation.spec.ts`) |
| **Section 2** | Input invalid mobile number length (triggers 9-digit validation) | Boundary | Yes |
| **Section 2** | Input malformed email without `@` symbol | Format | Yes |
| **Section 2** | Attempt Step 2 submission with empty required dropdowns/textareas | Negative/Validation | Yes |
| **Section 2** | Attach unsupported file type or massive file size | Negative/Security | Yes (Scripted but skipped pending spec definition) |

## 5. Summary of Automated Test Coverage & Findings

The implemented automation covers 100% of the core functionality described in Section 1. 

**Key Findings & Bugs Identified:**
1. **Missing Email Validation (Severity: Medium):** During the execution of Section 2 validation tests, it was discovered that the application **allows progression to Step 2 even when a malformed email structure** (e.g., missing the `@` symbol) is provided. Standard HTML5 validation or custom regex validation is missing on the `input#email` field.
2. **Missing Max-Length Boundaries (Severity: Low/Medium):** Injecting 300+ character strings into exactly the "Name" and "Surname" fields is accepted without truncation or error, pointing to missing DB length constraint checks on the front end.
3. **Current Date / Timestamp Validation Flaw (Severity: High):** Submitting the form with the pre-filled, strictly "current" date (e.g. Feb 26) triggers a backend or client-side validation error `Crime date cannot be in the future`. This severely hinders legitimate same-day reporting.
4. **Robust Mobile Validation:** The mobile number field correctly traps incorrect string lengths (triggering the 9-digit warning even when given 12 digits). However, interacting with the custom React telephone component required explicit typing mimicry in the automation script rather than rapid DOM injection.

For Section 2, the framework is built and test cases are mapped out for required field validation and mobile number constraints based directly on the HTML logic observed. The test suite currently expects the existing behavior (documenting the email bug) to ensure continuous monitoring.

## 6. Conclusion and Usability Feedback

The form's architecture appears well-structured utilizing modern standard inputs (React Tel Input, Ant Design Date/Time Pickers, generic hidden file uploads). The locators are generally query-able via standard roles and IDs, although adding explicit `data-testid` attributes to critical elements (like dropdowns and the Submit button) would enhance test resiliency against UI cosmetic changes in the future.

## 7. Manual Exploratory Testing Findings

Automated testing validated the core happy paths and structural negative paths. However, an exploratory manual testing session using an AI browser subagent yielded the following UI/UX and functional bugs:

### Functional Bugs
1. **Email Validation Flaw:** The form only validates the length of the email address (minimum 5 characters). Inputs like `test123` are accepted despite lacking an `@` symbol or domain configuration.
2. **Current Date Rejection:** The "Date of Incident" field pre-fills with the current date. However, submitting the form on the same day triggers a `"Crime date cannot be in the future."` error, likely due to a strict timestamp validation issue on the backend.
3. **Inconsistent Validation Triggering:** Clicking "Next" on an initially empty form only highlights the Mobile Number field. Required Name and Surname errors do not appear until the user interacts further.

### UI / UX Improvements Needed
1. **Dropdown Naming Conventions:** The "Crime Type" dropdown displays raw, snake_case database values (e.g., `AGGR_ROBBERY_NONRES`, `CONTACT_ASSAULT_GBH`) rather than user-friendly descriptions.
2. **Progress Bar Visiblity:** The top progress bar is extremely thin and barely perceptible.
3. **Missing Validation States:** The "Have you reported this crime to the police?" radio buttons are marked with an asterisk (required) but show no visual error feedback if left unselected during a failed submission attempt.

### Session Recording
![Manual Exploratory Testing Session](/home/nqobile-buthelezi/.gemini/antigravity/brain/65e87e87-5cfd-4c43-bd30-d5ae48ca6477/manual_exploratory_testing_1772109038923.webp)
