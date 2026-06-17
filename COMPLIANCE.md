# ZekoAudit Compliance Maintenance Workflow

This document establishes the mandatory compliance and security maintenance workflow for the ZekoAudit platform. 

## 1. Feature Trigger Categories
Whenever features in the following categories are added, removed, or modified, a compliance review MUST be triggered:

1. Authentication
2. User accounts
3. Audit history
4. Saved reports
5. File uploads
6. Website screenshots
7. Visual Audit
8. Gemini integration
9. User-provided API keys
10. Analytics
11. Local storage
12. Cookies

## 2. Required Documentation Updates
Upon triggering a compliance review, the following documents must be automatically reviewed and updated to reflect the new state of the system:

- **Privacy Policy** (`/privacy`): Update data collection disclosures, retention periods, and third-party subprocessors.
- **Terms of Service** (`/terms`): Update liabilities, acceptable use policies, and API rate limit constraints.
- **Security Page** (`/security`): Update the technical details regarding how data is transmitted, what is stored/not stored, and how keys/secrets are handled.
- **FAQ / Documentation** (`/docs`): Add user-facing explanations, feature limitations, and security implications.
- **Changelog** (`/changelog`): Record all privacy, security, and data handling modifications.

## 3. Strict User API Key Security Rules (BYOK)
For any feature utilizing the Bring Your Own Key (BYOK) model (e.g., Gemini Visual Audits, Rate Limit Overrides), the following engineering rules are **NON-NEGOTIABLE**:

- **NEVER** store user API keys in Firestore or any other database.
- **NEVER** log user API keys anywhere in the system infrastructure.
- **NEVER** expose user API keys in client-side console logs or error boundaries.
- **PREFER** browser `localStorage` or `sessionStorage` for persistence.
- **MUST** clearly disclose to the user exactly where and how their keys are stored.
- **MUST** provide a clear and accessible "Delete API Key" action in the UI.

## 4. Final Review Gate
Before finalizing any PR or feature implementation branch, engineers must confirm:
*Are legal, security, FAQ, or documentation updates required based on these changes?*
If yes, the feature cannot be shipped until the compliance updates are merged alongside the code.
