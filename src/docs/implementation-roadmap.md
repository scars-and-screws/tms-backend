# Implementation Roadmap

This roadmap verifies each recommendation from `recommendations.md` against the current codebase and turns it into an implementation sequence. No application code was changed during this analysis.

## Verification Summary

Confirmed critical bugs:

- `src/core/config/env.js` exports `TRUSTED_DEVICE_EXPIRATION` from itself instead of `process.env`.
- `src/modules/projects/tasks/core/task.controller.js` contains `new new ApiResponse(...)()`.
- `src/modules/notifications/notification.service.js` calls `countUserNotifications` without importing it.
- `src/modules/notifications/notification.service.js` calls `findUserNotifications` with an object, but `notification.repository.js` expects positional arguments.
- `src/modules/auth/core/auth.service.js` calls `touchTrustedDevice` and `deleteTrustedDevice` without importing them.
- `src/core/activity/activity.service.js` imports `Activity` from `react` and uses `buildActivityMetadata` without importing it.
- Activity constants use `PROJECT_UNARCHIVED` and `TASK_UNARCHIVED`, while the Prisma schema uses `PROJECT_UN_ARCHIVED` and `TASK_UN_ARCHIVED`.

Confirmed production gaps:

- `cors()` is unrestricted.
- `express.json()` has no explicit size limit.
- No rate limiting dependency or middleware exists.
- No structured logger exists.
- No request ID middleware exists.
- Cookie strategy is hard-coded to `sameSite: "strict"`.
- No test framework exists.
- README is behind the current API surface.

## Implementation Order

1. Critical runtime fixes: recommendations 1 and 2.
2. Environment consistency and startup safety: recommendation 8.
3. Request safety controls: recommendations 5, 6, 10, 11, and 12.
4. Data integrity: recommendations 3 and 4.
5. Observability: recommendation 9.
6. API contract consistency: recommendations 7 and 13.
7. Database performance: recommendation 14.
8. Regression safety: recommendation 16.
9. Documentation: recommendations 17 and 19.
10. Later scalability and maintenance: recommendations 15, 20, 21, 18, and 22.

## Recommendation Details

### 1. Fix Boot-Time and Runtime Correctness Issues

- Verification: Exists.
- Category: Critical Bug.
- Effort: 1 hour.
- Implementation order: 1.
- Exact files to modify:
  - `src/core/config/env.js`
  - `src/modules/projects/tasks/core/task.controller.js`
  - `src/modules/notifications/notification.service.js`
  - `src/modules/notifications/notification.repository.js`
  - `src/modules/auth/core/auth.service.js`
  - `src/core/activity/activity.service.js`
  - `src/modules/auth/trusted-device/trusted-device.utils.js`
- Dependencies:
  - None.
- Breaking change risk: No. These are fixes to broken imports, constructor usage, env access, and function signatures.
- Notes:
  - `trusted-device.utils.js` also imports `ms` twice.
  - `activity.service.js` should import `buildActivityMetadata` from `activity.helper.js` and remove the backend-invalid `react` import.

### 2. Align Activity Constants With Prisma Enums

- Verification: Exists.
- Category: Critical Bug.
- Effort: 1 hour.
- Implementation order: 2.
- Exact files to modify:
  - `prisma/schema.prisma`
  - `src/core/activity/activity.constants.js`
  - `src/modules/projects/core/project.service.js`
  - `src/modules/projects/tasks/core/task.service.js`
  - `src/modules/organizations/core/organization.service.js`
- Dependencies:
  - Recommendation 1 should be done first so activity service imports are valid.
  - Requires Prisma migration/generation if schema enum names are changed.
- Breaking change risk: Yes.
  - Renaming Prisma enum values requires a database migration and may affect existing `Activity.type` records.
  - Safer path: update code constants to match existing DB enum names first, then plan a cleanup migration later if nicer enum names are desired.
- Notes:
  - The schema currently lacks `ORGANIZATION_UPDATED` and `ORGANIZATION_DELETED`, while code uses those values.

### 3. Use Prisma Transactions for Multi-Step Writes

- Verification: Exists.
- Category: Production Safety.
- Effort: Half day.
- Implementation order: 8.
- Exact files to modify:
  - `src/modules/organizations/core/organization.service.js`
  - `src/modules/organizations/core/organization.repository.js`
  - `src/modules/projects/core/project.service.js`
  - `src/modules/projects/core/project.repository.js`
  - `src/modules/projects/members/projectMember.repository.js`
  - `src/modules/organizations/members/organizationMember.repository.js`
  - optionally `src/core/database/prisma.js` if adding transaction helpers
- Dependencies:
  - Recommendation 1 and 2 first.
  - Repository functions may need to accept a Prisma client/transaction client.
- Breaking change risk: Low.
  - API behavior should not change, but repository function signatures may change internally.
- Notes:
  - Prioritize organization creation, project creation, ownership transfer, and member role changes.

### 4. Add Database Constraints for Business Uniqueness

- Verification: Exists.
- Category: Production Safety.
- Effort: Half day.
- Implementation order: 9.
- Exact files to modify:
  - `prisma/schema.prisma`
  - `src/modules/organizations/core/organization.service.js`
  - `src/modules/projects/core/project.service.js`
  - `src/core/middleware/errorHandler.js`
- Dependencies:
  - Recommendation 3 is useful first but not strictly required.
  - Requires checking existing data for duplicates before migration.
- Breaking change risk: Yes.
  - Existing duplicate rows would block migration.
  - Concurrent requests that previously created duplicates will start returning `409`.
- Notes:
  - Add `@@unique([ownerId, name])` for organizations if name uniqueness is per owner.
  - Add `@@unique([organizationId, name])` for projects if name uniqueness is per organization.

### 5. Restrict CORS for Production

- Verification: Exists.
- Category: Production Safety.
- Effort: 1 hour.
- Implementation order: 4.
- Exact files to modify:
  - `src/app.js`
  - `src/core/config/env.js`
  - `.env.example`
  - `README.md`
- Dependencies:
  - Recommendation 8 should be done first or alongside it.
- Breaking change risk: Yes.
  - Frontend requests from unlisted origins will fail.
  - Cookie-based refresh may require `credentials: true` and frontend `withCredentials`.
- Notes:
  - Use permissive defaults only in development.

### 6. Add Rate Limiting to Sensitive Endpoints

- Verification: Exists.
- Category: Production Safety.
- Effort: Half day.
- Implementation order: 5.
- Exact files to modify:
  - `package.json`
  - `package-lock.json`
  - new `src/core/middleware/rateLimit.js` or similar
  - `src/core/middleware/index.js`
  - `src/modules/auth/core/auth.routes.js`
  - `src/modules/auth/password-reset/password-reset.routes.js`
  - `src/modules/auth/verification/verification.routes.js`
  - `src/modules/auth/two-factor/two-factor.routes.js`
  - `src/modules/users/avatar/avatar.routes.js`
  - `src/modules/organizations/logo/logo.routes.js`
  - `src/modules/projects/tasks/attachments/attachment.task.routes.js`
  - `src/modules/projects/tasks/attachments/attachment.comment.routes.js`
- Dependencies:
  - Requires adding a dependency such as `express-rate-limit`.
  - Recommendation 10 helps logging/debugging rate-limit responses.
- Breaking change risk: Yes.
  - Aggressive limits can block legitimate users, tests, or frontend retries.
- Notes:
  - Start with conservative limits and separate auth, OTP, and upload limiters.

### 7. Standardize API Response and Error Shapes

- Verification: Exists.
- Category: Code Quality.
- Effort: Full day.
- Implementation order: 13.
- Exact files to modify:
  - `src/core/utils/ApiResponse.js`
  - `src/core/utils/ApiError.js`
  - `src/core/middleware/errorHandler.js`
  - most `*.controller.js` files under `src/modules`
  - possibly `src/core/activity/activity.controller.js`
- Dependencies:
  - Recommendation 1 first.
  - Recommendation 13 can be done at the same time.
  - Tests from recommendation 16 should ideally exist first.
- Breaking change risk: Yes.
  - Frontend clients depending on the current response/error shape will need updates.
- Notes:
  - This is valuable but should not be mixed into critical bug fixes.

### 8. Improve Environment Validation

- Verification: Exists.
- Category: Production Safety.
- Effort: 1 hour.
- Implementation order: 3.
- Exact files to modify:
  - `src/core/config/env.js`
  - `src/core/config/otp.config.js`
  - `.env.example`
  - `README.md`
- Dependencies:
  - None, but it supports recommendations 5 and 12.
- Breaking change risk: Yes.
  - Adding new required env vars can prevent startup until deployment config is updated.
- Notes:
  - Fix `OTP_RESEND_COOL_DOWN_SECONDS` vs `OTP_RESEND_COOLDOWN_SECONDS`.
  - Add `JWT_TEMP_TOKEN_SECRET`, `JWT_TEMP_TOKEN_EXPIRATION`, `TRUSTED_DEVICE_EXPIRATION`, and any CORS/cookie vars to `.env.example`.

### 9. Replace Console Logging With Structured Logging

- Verification: Exists.
- Category: Production Safety.
- Effort: Half day.
- Implementation order: 12.
- Exact files to modify:
  - `package.json`
  - `package-lock.json`
  - new `src/core/logger/logger.js` or `src/core/logging/logger.js`
  - `src/core/middleware/errorHandler.js`
  - `src/server.js`
  - `src/core/activity/activity.service.js`
  - `src/core/upload/upload.service.js`
  - `src/modules/auth/core/auth.service.js`
  - `src/modules/organizations/core/organization.service.js`
- Dependencies:
  - Recommendation 10 should be done first for request IDs.
  - Requires dependency such as `pino`.
- Breaking change risk: Low.
  - Runtime behavior should not change, but log format changes for deployment tooling.
- Notes:
  - Keep `morgan` for dev or replace it with structured HTTP request logging.

### 10. Add Request IDs

- Verification: Exists.
- Category: Production Safety.
- Effort: 1 hour.
- Implementation order: 6.
- Exact files to modify:
  - `src/app.js`
  - `src/core/middleware/errorHandler.js`
  - optionally new `src/core/middleware/requestId.js`
  - `src/core/middleware/index.js`
- Dependencies:
  - None.
- Breaking change risk: No.
- Notes:
  - Add `x-request-id` to error responses after response shape strategy is chosen.

### 11. Add Explicit Body Size Limits

- Verification: Exists.
- Category: Production Safety.
- Effort: 15 minutes.
- Implementation order: 7.
- Exact files to modify:
  - `src/app.js`
  - optionally `src/core/config/env.js`
  - `.env.example` if body limits are configurable
- Dependencies:
  - None.
- Breaking change risk: Yes.
  - Very large JSON payloads that currently pass will start failing with `413`.
- Notes:
  - This does not affect multipart uploads handled by Multer.

### 12. Clarify Cookie Strategy for Frontend Deployments

- Verification: Exists.
- Category: Production Safety.
- Effort: 1 hour.
- Implementation order: 10.
- Exact files to modify:
  - `src/core/security/cookies.js`
  - `src/core/security/deviceCookie.js`
  - `src/core/config/env.js`
  - `.env.example`
  - `README.md`
- Dependencies:
  - Recommendation 5 because CORS credentials and cookie policy must agree.
  - Recommendation 8 for env-backed cookie settings.
- Breaking change risk: Yes.
  - Changing `sameSite`, `secure`, cookie domain, or credentials behavior can break login/refresh across environments.
- Notes:
  - Decide the real deployment topology first: same-site app, subdomain app, or fully cross-site app.

### 13. Improve Pagination Contract

- Verification: Exists.
- Category: Code Quality.
- Effort: Half day.
- Implementation order: 14.
- Exact files to modify:
  - `src/core/pagination/pagination.utils.js`
  - `src/modules/organizations/core/organization.service.js`
  - `src/modules/projects/core/project.service.js`
  - `src/modules/projects/tasks/core/task.service.js`
  - `src/modules/projects/tasks/attachments/attachment.service.js`
  - `src/modules/notifications/notification.service.js`
  - `src/core/activity/activity.service.js`
  - related controllers if response envelope changes
- Dependencies:
  - Recommendation 1 first.
  - Recommendation 7 if changing the top-level envelope.
- Breaking change risk: Yes.
  - Frontend code expecting keys like `tasks`, `projects`, `organizations`, or `notifications` may need changes if renamed to `items`.
- Notes:
  - A lower-risk approach is to keep existing collection keys and standardize only the `pagination` object.

### 14. Add Compound Indexes for Common List Queries

- Verification: Exists.
- Category: Scalability.
- Effort: 1 hour.
- Implementation order: 15.
- Exact files to modify:
  - `prisma/schema.prisma`
- Dependencies:
  - Requires Prisma migration.
  - Should be coordinated with recommendation 4 if both alter schema.
- Breaking change risk: Low.
  - Index additions are usually non-breaking but can lock tables during migration depending on database size and migration strategy.
- Notes:
  - Candidate indexes: `Notification(userId, isRead, createdAt)`, `Activity(organizationId, createdAt)`, `Activity(projectId, createdAt)`, `Activity(taskId, createdAt)`, and possibly `Task(projectId, status, priority, assigneeId)`.

### 15. Keep SSE Simple Now, Plan Redis for Multiple Servers

- Verification: Exists.
- Category: Scalability.
- Effort: Full day when implemented; 15 minutes if only documented.
- Implementation order: 20.
- Exact files to modify:
  - `src/modules/notifications/sse/sse.manager.js`
  - `src/modules/notifications/sse/sse.controller.js`
  - `src/core/activity/sse/activity.sse.manager.js`
  - `src/core/activity/sse/activity.sse.controller.js`
  - `src/modules/notifications/notification.service.js`
  - `src/core/activity/activity.service.js`
  - `package.json`
  - `package-lock.json`
  - `.env.example`
- Dependencies:
  - Requires Redis or another pub/sub backend.
  - Recommendation 9 helps observe pub/sub failures.
- Breaking change risk: Medium.
  - Real-time delivery behavior can change.
  - Infrastructure dependency must be available in production.
- Notes:
  - Do not implement until the app actually runs more than one backend instance.

### 16. Add Small Integration Tests for Critical Flows

- Verification: Exists.
- Category: Code Quality.
- Effort: Full day.
- Implementation order: 11.
- Exact files to modify:
  - `package.json`
  - `package-lock.json`
  - new test config file if using Jest/Vitest
  - new test files under `tests/` or `src/**/*.test.js`
  - `.env.example` for test database variables
  - possibly `src/server.js` if app/server separation needs refinement
- Dependencies:
  - Requires choosing test framework and test database strategy.
  - Critical fixes in recommendation 1 should be done before meaningful integration tests pass.
- Breaking change risk: Low.
  - Adds dev tooling, but may expose hidden startup/config assumptions.
- Notes:
  - Start with auth login, task listing, notification listing, and organization/project creation flows.

### 17. Document the Route Map

- Verification: Exists.
- Category: Code Quality.
- Effort: Half day.
- Implementation order: 17.
- Exact files to modify:
  - `README.md` or new `docs/api.md`
  - possibly `docs/auth.md`
- Dependencies:
  - Recommendation 7 and 13 should be decided first if response shapes change.
- Breaking change risk: No.
- Notes:
  - Include nested route examples for organizations, projects, tasks, comments, attachments, notifications, and activity streams.

### 18. Normalize File and Directory Naming

- Verification: Exists.
- Category: Nice To Have.
- Effort: Full day.
- Implementation order: 22.
- Exact files to modify:
  - Many imports across `src/modules` and `src/core`
  - Potentially route/module directory names under auth, organization members, and project members
- Dependencies:
  - Tests from recommendation 16 should exist first.
- Breaking change risk: Medium.
  - Internal imports can break easily.
  - External API routes should not change, but accidental route changes are possible during refactor.
- Notes:
  - Defer this. Prefer applying one naming convention to new files only until there is a strong reason to refactor.

### 19. Add Lightweight API Documentation

- Verification: Exists.
- Category: Nice To Have.
- Effort: Full day.
- Implementation order: 18.
- Exact files to modify:
  - `package.json`
  - `package-lock.json`
  - `src/app.js` if serving Swagger UI
  - new `docs/openapi.yaml` or `docs/openapi.json`
  - optionally `README.md`
- Dependencies:
  - Recommendation 17 can come first as a simpler manual route map.
  - Recommendation 7 and 13 should be settled before documenting response schemas.
- Breaking change risk: No, unless Swagger middleware changes app routing unexpectedly.
- Notes:
  - A static OpenAPI YAML file is lower risk than introducing annotation-heavy route docs.

### 20. Add Cleanup Jobs for Expired Data

- Verification: Exists.
- Category: Scalability.
- Effort: Half day.
- Implementation order: 21.
- Exact files to modify:
  - new `src/jobs/cleanupExpiredData.js` or `src/core/jobs/cleanupExpiredData.js`
  - `package.json`
  - `package-lock.json` if adding cron tooling
  - `src/server.js` if running jobs in-process
  - `.env.example` for schedule/config
- Dependencies:
  - Decide whether jobs run in-process, via external scheduler, or via a worker.
  - Recommendation 9 helps log cleanup results.
- Breaking change risk: Medium.
  - Incorrect cleanup criteria can delete useful audit/session data.
- Notes:
  - Start with expired OTPs, expired/revoked refresh tokens, and expired trusted devices.

### 21. Add Current User Role to Scoped Responses

- Verification: Exists as a product/API improvement, not a bug.
- Category: Nice To Have.
- Effort: Half day.
- Implementation order: 19.
- Exact files to modify:
  - `src/modules/organizations/core/organization.service.js`
  - `src/modules/organizations/core/organization.controller.js`
  - `src/modules/projects/core/project.service.js`
  - `src/modules/projects/core/project.controller.js`
  - `src/modules/projects/tasks/core/task.service.js`
  - `src/modules/projects/tasks/core/task.controller.js`
  - possibly member repositories for efficient role lookup
- Dependencies:
  - Recommendation 7 if response envelopes are being changed.
  - Frontend requirements should guide exact fields.
- Breaking change risk: Low to Medium.
  - Adding fields is usually non-breaking, but changing existing response nesting would be breaking.
- Notes:
  - Prefer additive fields like `currentUserRole` or `permissions` without renaming existing data.

### 22. Keep Business Logic Out of Controllers

- Verification: Mostly already true.
- Category: Code Quality.
- Effort: 15 minutes for guideline; Half day if refactoring existing controller signatures.
- Implementation order: 23.
- Exact files to modify:
  - No immediate required code changes.
  - Optional future changes in controller/service pairs under `src/modules`.
  - README or contributor docs if documenting the guideline.
- Dependencies:
  - None.
- Breaking change risk: No if treated as a guideline; Medium if broad refactoring is attempted.
- Notes:
  - Current controllers are already thin enough. This should be enforced during future development rather than treated as urgent work.

## Breaking Change Watchlist

High attention:

- Recommendation 2: activity enum migration can affect existing database values.
- Recommendation 4: new unique constraints can fail if duplicate data already exists.
- Recommendation 5: CORS restrictions can block frontend deployments.
- Recommendation 7: response/error shape changes affect frontend clients.
- Recommendation 12: cookie strategy can break refresh/login behavior.
- Recommendation 13: pagination response changes can affect frontend list rendering.

Medium attention:

- Recommendation 6: rate limits can block legitimate flows if too strict.
- Recommendation 11: body size limits can reject existing large payloads.
- Recommendation 15: Redis-backed SSE changes delivery behavior and infrastructure needs.
- Recommendation 18: naming refactors can break imports.
- Recommendation 20: cleanup jobs can delete data if criteria are too broad.

## Recommended First Sprint

1. Fix recommendation 1.
2. Fix recommendation 2 with the least disruptive enum approach.
3. Fix recommendation 8.
4. Add recommendation 11.
5. Add recommendation 10.
6. Add conservative recommendation 5.
7. Add minimal recommendation 6 for auth and OTP routes.

This first sprint removes runtime failures and closes the largest production safety gaps without forcing a broad API redesign.

