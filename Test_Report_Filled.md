# Safer City Crime Reporting - Test Report

| Test Date Run | Test Case ID | Test Case Description | Test case Link | Testing Method | Maestro PDF Link | Status | Test Type | Notes | Bug ID | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 26/02/2026 | CRF-001 | Verify successful submission with valid inputs | `tests/crime.spec.ts` | Automated | N/A | Pass | End-to-End | Test script dynamically mimics typing to bypass React Tel Input quirks. | N/A | HIGH |
| 26/02/2026 | CRF-002 | Modify location before submission | `tests/crime.spec.ts` | Automated | N/A | Pass | End-to-End | Validates location is mutable during user journey. | N/A | HIGH |
| 26/02/2026 | CRF-003 | Verify required field validation on Step 1 | `tests/crime-validation.spec.ts` | Automated | N/A | Pass | Negative | Next button click is trapped by form validation correctly. | N/A | HIGH |
| 26/02/2026 | CRF-004 | Verify mobile number 9-digit constraint | `tests/crime-validation.spec.ts` | Automated | N/A | Pass | Boundary | Error text "Mobile number must be exactly 9 digits." is verified. | N/A | HIGH |
| 26/02/2026 | CRF-005 | Verify invalid email format rejection | `tests/crime-validation.spec.ts` | Automated / Manual | N/A | **Fail** | Negative | **BUG IDENTIFIED:** Form accepts malformed email strings missing `@` domains, validating length only. | BUG-001 | MEDIUM |
| 26/02/2026 | CRF-006 | Verify required field validation on Step 2 | `tests/crime-validation.spec.ts` | Automated | N/A | Pass | Negative | Submit button remains trapped by missing Crime Type and Crime Info. | N/A | HIGH |
| 26/02/2026 | CRF-007 | Verify current date acceptance | Manual | N/A | N/A | **Fail** | Validation | **BUG IDENTIFIED:** Setting the field to today's date prevents submission with 'cannot be in the future'. | BUG-002 | HIGH |
| 26/02/2026 | CRF-008 | Verify unsupported file type handling | Manual | N/A | N/A | Skipped | Exploratory | Place-holder pending acceptance criteria definitions. | N/A | LOW |
| 26/02/2026 | CRF-009 | Verify boundary input for oversized phone lengths | `tests/crime-validation.spec.ts` | Automated | N/A | Pass | Boundary | Typing 12 digits blocks progression properly. | N/A | HIGH |
| 26/02/2026 | CRF-010 | Verify Max-Length boundary for character inputs | `tests/crime-validation.spec.ts` | Automated | N/A | **Fail** | Boundary | **BUG IDENTIFIED:** Form accepts ridiculous lengths (e.g. 300 'A' characters) for Name/Surname without truncating. | BUG-003 | MEDIUM |
| 26/02/2026 | CRF-011 | Verify current date acceptance (Automated Proof) | `tests/crime-validation.spec.ts` | Automated | N/A | **Fail** | Validation | **BUG VERIFIED:** Automation proves that submitting the pre-filled current date always soft-locks the user with a future date error. | BUG-002 | HIGH |
