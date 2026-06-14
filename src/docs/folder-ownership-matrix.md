# Folder Ownership Matrix

This matrix is based on `architecture-restructure-plan.md`. It is a planning artifact only; no code has been moved.

Difficulty scale:

- Low: import-only or documentation-level move.
- Medium: several imports/routes affected.
- High: many imports, route ownership, or generated/migration behavior affected.

Risk scale:

- Low: internal-only or no runtime behavior change.
- Medium: runtime imports, route mounting, or build tooling may break.
- High: public API, database, generated client, or critical startup behavior may break.

## Root And Prisma

| Current Location | Recommended Location | Reason | Migration Difficulty | Breaking Risk |
|---|---|---|---|---|
| `README.md` | `README.md` | Root project overview belongs at repository root. | Low | Low |
| `recommendations.md` | `docs/recommendations.md` | Architecture/review docs are easier to manage under `docs`. | Low | Low |
| `implementation-roadmap.md` | `docs/implementation-roadmap.md` | Roadmap docs should be grouped with project documentation. | Low | Low |
| `architecture-restructure-plan.md` | `docs/architecture-restructure-plan.md` | Architecture docs should live under `docs`. | Low | Low |
| `folder-ownership-matrix.md` | `docs/folder-ownership-matrix.md` | This matrix is documentation, not runtime source. | Low | Low |
| `.env.example` | `.env.example` | Environment template belongs at root for onboarding. | Low | Low |
| `package.json` | `package.json` | Node package manifest belongs at root. | Low | High |
| `package-lock.json` | `package-lock.json` | Lockfile belongs with package manifest. | Low | High |
| `prisma.config.ts` | `prisma.config.ts` | Prisma CLI config belongs at root. | Low | Medium |
| `prisma` | `prisma` | Prisma schema and migrations belong outside runtime source. | Low | High |
| `prisma/schema.prisma` | `prisma/schema.prisma` | Database schema is correctly placed. | Low | High |
| `prisma/migrations` | `prisma/migrations` | Migration history belongs with Prisma schema. | Low | High |
| `prisma/migrations/migration_lock.toml` | `prisma/migrations/migration_lock.toml` | Prisma-managed migration lock should stay in migrations. | Low | High |
| `prisma/migrations/20260526201327_fresh_start` | `prisma/migrations/20260526201327_fresh_start` | Existing migration folder should remain stable. | Low | High |
| `prisma/migrations/20260526201327_fresh_start/migration.sql` | `prisma/migrations/20260526201327_fresh_start/migration.sql` | Existing migration SQL should not be relocated. | Low | High |

## Source Entrypoints And Top-Level Folders

| Current Location | Recommended Location | Reason | Migration Difficulty | Breaking Risk |
|---|---|---|---|---|
| `src` | `src` | Runtime source root is correct. | Low | Low |
| `src/app.js` | `src/app.js` | Express app composition belongs at source root. | Low | Medium |
| `src/server.js` | `src/server.js` | Server startup/shutdown belongs at source root. | Low | Medium |
| `src/core` | `src/core` | Keep as infrastructure/generic shared runtime code. | Medium | Medium |
| `src/modules` | `src/modules` | Product/domain modules belong here. | Low | Low |
| `src/generated` | `src/generated` or default Prisma output | Generated artifacts may stay ignored here, but should not be hand-edited. | Medium | Medium |

## Core, Shared, And Infrastructure

| Current Location | Recommended Location | Reason | Migration Difficulty | Breaking Risk |
|---|---|---|---|---|
| `src/core/config` | `src/core/config` | Environment/provider config is infrastructure. | Low | Medium |
| `src/core/config/env.js` | `src/core/config/env.js` | Runtime env parsing belongs in config. | Low | High |
| `src/core/config/mail.config.js` | `src/core/config/mail.config.js` | Mail provider configuration belongs in config. | Low | Medium |
| `src/core/config/otp.config.js` | `src/core/config/otp.config.js` | OTP runtime config can stay shared. | Low | Medium |
| `src/core/database` | `src/core/database` | Prisma client setup is infrastructure. | Low | High |
| `src/core/database/prisma.js` | `src/core/database/prisma.js` | Prisma client singleton belongs in database infrastructure. | Low | High |
| `src/core/validation` | `src/shared/validation` | Generic primitive schemas are shared, not infrastructure. | Medium | Medium |
| `src/core/validation/index.js` | `src/shared/validation/schemas.js` | Shared Zod primitives should live under shared validation. | Medium | Medium |
| `src/core/pagination` | `src/shared/pagination` | Pagination helpers are reusable API utilities. | Medium | Medium |
| `src/core/pagination/pagination.constants.js` | `src/shared/pagination/pagination.constants.js` | Generic pagination constants belong in shared. | Medium | Medium |
| `src/core/pagination/pagination.utils.js` | `src/shared/pagination/pagination.utils.js` | Generic pagination builder belongs in shared. | Medium | Medium |
| `src/core/pagination/pagination.validation.js` | `src/shared/pagination/pagination.validation.js` | Pagination query schemas are shared validation. | Medium | Medium |
| `src/core/utils` | `src/shared/utils` plus module mappers | Generic utilities move to shared; domain utilities move to modules. | Medium | Medium |
| `src/core/utils/ApiError.js` | `src/core/http/errors/api-error.js` | HTTP error primitive belongs in HTTP infrastructure. | Medium | Medium |
| `src/core/utils/ApiResponse.js` | `src/core/http/responses/api-response.js` | HTTP response envelope belongs in HTTP infrastructure. | Medium | Medium |
| `src/core/utils/asyncHandler.js` | `src/shared/utils/async-handler.js` | Generic async wrapper belongs in shared utils. | Medium | Medium |
| `src/core/utils/getRequestMeta.js` | `src/shared/utils/request-meta.js` | Generic request metadata helper belongs in shared utils. | Medium | Medium |
| `src/core/utils/buildAuthResponse.js` | `src/modules/auth/auth-response.mapper.js` | Auth response shaping is auth-domain behavior. | Medium | Medium |
| `src/core/utils/buildTokenPayload.js` | `src/modules/auth/token-payload.mapper.js` | Auth token payload shape is auth-domain behavior. | Medium | Medium |
| `src/core/utils/sanitizeUser.js` | `src/modules/users/user.mapper.js` | User sanitization is user-domain response shaping. | Medium | Medium |
| `src/core/utils/index.js` | `src/shared/utils/index.js` and module barrels | Current barrel mixes generic and domain exports. | Medium | Medium |

## Core Middleware

| Current Location | Recommended Location | Reason | Migration Difficulty | Breaking Risk |
|---|---|---|---|---|
| `src/core/middleware` | `src/core/middleware` plus module middleware folders | Generic middleware stays; domain guards move near owners. | High | Medium |
| `src/core/middleware/authenticate.js` | `src/core/middleware/authenticate.js` | Generic auth guard is cross-cutting. | Low | High |
| `src/core/middleware/validate.js` | `src/core/middleware/validate.js` | Generic validation middleware is cross-cutting. | Low | High |
| `src/core/middleware/errorHandler.js` | `src/core/middleware/error-handler.js` | Generic error middleware stays in core; rename to kebab-case. | Medium | High |
| `src/core/middleware/notFound.js` | `src/core/middleware/not-found.js` | Generic not-found middleware stays in core; rename to kebab-case. | Medium | Medium |
| `src/core/middleware/requireVerifiedEmail.js` | `src/modules/auth/middleware/require-verified-email.js` | Verified email is auth/account policy. | Medium | Medium |
| `src/core/middleware/requireOrganizationMember.js` | `src/modules/organizations/middleware/require-organization-member.js` | Organization membership guard belongs to organizations. | Medium | Medium |
| `src/core/middleware/requireOrganizationRole.js` | `src/modules/organizations/middleware/require-organization-role.js` | Organization RBAC belongs to organizations. | Medium | Medium |
| `src/core/middleware/requireProjectMember.js` | `src/modules/projects/middleware/require-project-member.js` | Project membership guard belongs to projects. | Medium | Medium |
| `src/core/middleware/requireProjectRole.js` | `src/modules/projects/middleware/require-project-role.js` | Project RBAC belongs to projects. | Medium | Medium |
| `src/core/middleware/requireActiveProject.js` | `src/modules/projects/middleware/require-active-project.js` | Active-project policy belongs to projects. | Medium | Medium |
| `src/core/middleware/requireTaskAccess.js` | `src/modules/projects/tasks/middleware/require-task-access.js` | Task access policy belongs to tasks. | Medium | Medium |
| `src/core/middleware/requireActiveTask.js` | `src/modules/projects/tasks/middleware/require-active-task.js` | Active-task policy belongs to tasks. | Medium | Medium |
| `src/core/middleware/requireTaskAttachmentAccess.js` | `src/modules/projects/tasks/attachments/middleware/require-attachment-access.js` | Attachment access belongs to task attachments. | Medium | Medium |
| `src/core/middleware/requireCommentAccess.js` | `src/modules/projects/tasks/comments/middleware/require-comment-access.js` | Comment access belongs to comments. | Medium | Medium |
| `src/core/middleware/index.js` | `src/core/middleware/index.js` plus module barrels | Barrel should export only generic core middleware after moves. | Medium | Medium |

## Security, OTP, Mail, Upload

| Current Location | Recommended Location | Reason | Migration Difficulty | Breaking Risk |
|---|---|---|---|---|
| `src/core/security` | `src/core/security` | Security primitives are infrastructure. | Low | High |
| `src/core/security/cookies.js` | `src/core/security/cookies.js` | Generic cookie helper can stay in security. | Low | High |
| `src/core/security/device.js` | `src/core/security/device.js` | Device primitive can stay in security. | Low | Medium |
| `src/core/security/deviceCookie.js` | `src/core/security/device-cookie.js` | Cookie primitive stays; rename to kebab-case. | Medium | Medium |
| `src/core/security/deviceParser.js` | `src/core/security/device-parser.js` | Device parsing primitive stays; rename to kebab-case. | Medium | Low |
| `src/core/security/expiry.js` | `src/core/security/expiry.js` | Expiry helper is generic security utility. | Low | Medium |
| `src/core/security/fingerprint.js` | `src/core/security/fingerprint.js` | Fingerprint primitive belongs in security. | Low | Medium |
| `src/core/security/hash.js` | `src/core/security/hash.js` | Generic hashing helper belongs in security. | Low | Medium |
| `src/core/security/password.js` | `src/core/security/password.js` | Password hashing primitive belongs in security. | Low | High |
| `src/core/security/session.js` | `src/core/security/session.js` | Session token primitive may stay; auth workflow remains in module. | Low | High |
| `src/core/security/token.js` | `src/core/security/token.js` | Token signing/verification primitive belongs in security. | Low | High |
| `src/core/security/index.js` | `src/core/security/index.js` | Security barrel is acceptable if kept focused. | Low | Medium |
| `src/core/otp` | `src/core/otp` | OTP primitive service can stay as shared security capability. | Low | Medium |
| `src/core/otp/otp.constants.js` | `src/core/otp/otp.constants.js` | OTP primitive constants can stay. | Low | Medium |
| `src/core/otp/otp.service.js` | `src/core/otp/otp.service.js` | Generic OTP generation/hash behavior can stay. | Low | Medium |
| `src/core/otp/otp.validation.js` | `src/core/otp/otp.validation.js` or `src/shared/validation/otp.validation.js` | Generic OTP schema is shared validation. | Medium | Medium |
| `src/core/otp/index.js` | `src/core/otp/index.js` | Focused OTP barrel is acceptable. | Low | Low |
| `src/core/mail` | `src/core/mail` | Mail delivery is infrastructure/platform service. | Low | Medium |
| `src/core/mail/mail.service.js` | `src/core/mail/mail.service.js` | Generic send-mail service belongs in mail infrastructure. | Low | Medium |
| `src/core/mail/index.js` | `src/core/mail/index.js` | Focused mail barrel is acceptable. | Low | Low |
| `src/core/mail/templates` | `src/core/mail/templates` | Shared transactional templates can stay if treated as platform assets. | Low | Low |
| `src/core/mail/templates/base.template.js` | `src/core/mail/templates/base.template.js` | Shared base template belongs with mail templates. | Low | Low |
| `src/core/mail/templates/emailVerification.template.js` | `src/modules/auth/email-verification/email-verification-email.template.js` | Verification template is auth-specific. | Medium | Low |
| `src/core/mail/templates/passwordReset.template.js` | `src/modules/auth/password-reset/password-reset-email.template.js` | Password reset template is auth-specific. | Medium | Low |
| `src/core/mail/templates/twoFactor.template.js` | `src/modules/auth/two-factor/two-factor-email.template.js` | 2FA template is auth-specific. | Medium | Low |
| `src/core/mail/templates/components` | `src/core/mail/templates/components` | Generic template components can stay. | Low | Low |
| `src/core/mail/templates/components/otpBlock.js` | `src/core/mail/templates/components/otp-block.js` | Shared OTP display component can stay; rename to kebab-case. | Medium | Low |
| `src/core/upload` | `src/core/upload` | Generic upload infrastructure can stay. | Low | Medium |
| `src/core/upload/cloudinary.js` | `src/core/providers/cloudinary.provider.js` | Provider client setup belongs in providers. | Medium | Medium |
| `src/core/upload/upload.config.js` | `src/core/config/upload.config.js` | Upload config belongs with config. | Medium | Medium |
| `src/core/upload/upload.constants.js` | `src/core/upload/upload.constants.js` | Generic upload constants can stay. | Low | Low |
| `src/core/upload/upload.middleware.js` | `src/core/upload/upload.middleware.js` | Generic Multer middleware belongs in upload infrastructure. | Low | Medium |
| `src/core/upload/upload.service.js` | `src/core/upload/upload.service.js` | Generic upload/delete service belongs in upload infrastructure. | Low | Medium |
| `src/core/upload/upload.validation.js` | `src/core/upload/upload.validation.js` | Generic file validation belongs in upload infrastructure. | Low | Medium |
| `src/core/upload/index.js` | `src/core/upload/index.js` | Focused upload barrel is acceptable. | Low | Low |

## Activity

| Current Location | Recommended Location | Reason | Migration Difficulty | Breaking Risk |
|---|---|---|---|---|
| `src/core/activity` | `src/modules/activity` | Activity is domain-aware and shaped like a full module. | High | Medium |
| `src/core/activity/activity.constants.js` | `src/modules/activity/activity.constants.js` | Activity types are domain constants. | Medium | Medium |
| `src/core/activity/activity.controller.js` | `src/modules/activity/activity.controller.js` | Activity HTTP handler belongs in activity module. | Medium | Medium |
| `src/core/activity/activity.entity.js` | `src/modules/activity/activity.mapper.js` | Entity shaping belongs in module mapper. | Medium | Medium |
| `src/core/activity/activity.helper.js` | `src/modules/activity/activity.helpers.js` | Activity metadata helpers belong to activity module. | Medium | Medium |
| `src/core/activity/activity.repository.js` | `src/modules/activity/activity.repository.js` | Prisma activity queries belong to activity module. | Medium | Medium |
| `src/core/activity/activity.service.js` | `src/modules/activity/activity.service.js` | Activity workflow belongs to activity module. | Medium | Medium |
| `src/core/activity/activity.validation.js` | `src/modules/activity/activity.validation.js` | Activity route validation belongs to activity module. | Medium | Medium |
| `src/core/activity/index.js` | `src/modules/activity/index.js` | Barrel should move with module. | Medium | Medium |
| `src/core/activity/organization.activity.routes.js` | `src/modules/activity/routes/organization-activities.routes.js` | Scoped activity route belongs in activity module route folder. | High | Medium |
| `src/core/activity/project.activity.routes.js` | `src/modules/activity/routes/project-activities.routes.js` | Scoped activity route belongs in activity module route folder. | High | Medium |
| `src/core/activity/task.activity.routes.js` | `src/modules/activity/routes/task-activities.routes.js` | Scoped activity route belongs in activity module route folder. | High | Medium |
| `src/core/activity/sse` | `src/modules/activity/sse` | Activity real-time delivery belongs to activity module. | Medium | Medium |
| `src/core/activity/sse/activity.sse.controller.js` | `src/modules/activity/sse/activity-sse.controller.js` | Activity SSE controller belongs to activity module. | Medium | Medium |
| `src/core/activity/sse/activity.sse.manager.js` | `src/modules/activity/sse/activity-sse.manager.js` | Activity SSE manager belongs to activity module. | Medium | Medium |

## Generated Prisma Client

| Current Location | Recommended Location | Reason | Migration Difficulty | Breaking Risk |
|---|---|---|---|---|
| `src/generated` | `src/generated` or Prisma default output | Generated code should remain ignored and not hand-edited. | Medium | Medium |
| `src/generated/prisma` | `src/generated/prisma` or Prisma default output | Current custom output is acceptable if imports are stable. | Medium | High |
| `src/generated/prisma/runtime` | `src/generated/prisma/runtime` | Prisma-managed runtime files should not be manually relocated. | Medium | High |
| `src/generated/prisma/client.d.ts` | Generated by Prisma | Generated artifact. | Low | High |
| `src/generated/prisma/client.js` | Generated by Prisma | Generated artifact. | Low | High |
| `src/generated/prisma/default.d.ts` | Generated by Prisma | Generated artifact. | Low | High |
| `src/generated/prisma/default.js` | Generated by Prisma | Generated artifact. | Low | High |
| `src/generated/prisma/edge.d.ts` | Generated by Prisma | Generated artifact. | Low | High |
| `src/generated/prisma/edge.js` | Generated by Prisma | Generated artifact. | Low | High |
| `src/generated/prisma/index-browser.js` | Generated by Prisma | Generated artifact. | Low | High |
| `src/generated/prisma/index.d.ts` | Generated by Prisma | Generated artifact. | Low | High |
| `src/generated/prisma/index.js` | Generated by Prisma | Generated artifact. | Low | High |
| `src/generated/prisma/package.json` | Generated by Prisma | Generated artifact. | Low | High |
| `src/generated/prisma/query_compiler_fast_bg.js` | Generated by Prisma | Generated artifact. | Low | High |
| `src/generated/prisma/query_compiler_fast_bg.wasm` | Generated by Prisma | Generated artifact. | Low | High |
| `src/generated/prisma/query_compiler_fast_bg.wasm-base64.js` | Generated by Prisma | Generated artifact. | Low | High |
| `src/generated/prisma/schema.prisma` | Generated by Prisma | Generated artifact; source schema remains `prisma/schema.prisma`. | Low | High |
| `src/generated/prisma/wasm-edge-light-loader.mjs` | Generated by Prisma | Generated artifact. | Low | High |
| `src/generated/prisma/wasm-worker-loader.mjs` | Generated by Prisma | Generated artifact. | Low | High |
| `src/generated/prisma/runtime/client.d.ts` | Generated by Prisma | Generated artifact. | Low | High |
| `src/generated/prisma/runtime/client.js` | Generated by Prisma | Generated artifact. | Low | High |
| `src/generated/prisma/runtime/index-browser.d.ts` | Generated by Prisma | Generated artifact. | Low | High |
| `src/generated/prisma/runtime/index-browser.js` | Generated by Prisma | Generated artifact. | Low | High |
| `src/generated/prisma/runtime/wasm-compiler-edge.js` | Generated by Prisma | Generated artifact. | Low | High |

## Auth Module

| Current Location | Recommended Location | Reason | Migration Difficulty | Breaking Risk |
|---|---|---|---|---|
| `src/modules/auth` | `src/modules/auth` | Auth domain module is correctly owned. | Low | Low |
| `src/modules/auth/core` | `src/modules/auth` | Avoid ambiguous module `core`; flatten main auth resource. | Medium | Medium |
| `src/modules/auth/core/auth.controller.js` | `src/modules/auth/auth.controller.js` | Main auth controller should sit at auth module root. | Medium | Medium |
| `src/modules/auth/core/auth.repository.js` | `src/modules/auth/auth.repository.js` | Main auth repository should sit at auth module root. | Medium | Medium |
| `src/modules/auth/core/auth.routes.js` | `src/modules/auth/auth.routes.js` | Main auth router should sit at auth module root. | Medium | Medium |
| `src/modules/auth/core/auth.service.js` | `src/modules/auth/auth.service.js` | Main auth service should sit at auth module root. | Medium | Medium |
| `src/modules/auth/core/auth.validation.js` | `src/modules/auth/auth.validation.js` | Main auth route schemas should sit at auth module root. | Medium | Medium |
| `src/modules/auth/password-reset` | `src/modules/auth/password-reset` | Auth subfeature is correctly placed and named. | Low | Low |
| `src/modules/auth/password-reset/password-reset.controller.js` | `src/modules/auth/password-reset/password-reset.controller.js` | Correct subfeature controller location. | Low | Low |
| `src/modules/auth/password-reset/password-reset.repository.js` | `src/modules/auth/password-reset/password-reset.repository.js` | Correct subfeature repository location. | Low | Low |
| `src/modules/auth/password-reset/password-reset.routes.js` | `src/modules/auth/password-reset/password-reset.routes.js` | Correct subfeature route location. | Low | Low |
| `src/modules/auth/password-reset/password-reset.service.js` | `src/modules/auth/password-reset/password-reset.service.js` | Correct subfeature service location. | Low | Low |
| `src/modules/auth/password-reset/password-reset.validation.js` | `src/modules/auth/password-reset/password-reset.validation.js` | Correct subfeature validation location. | Low | Low |
| `src/modules/auth/session` | `src/modules/auth/sessions` | Folder should be plural for resource collection. | Medium | Medium |
| `src/modules/auth/session/session.helper.js` | `src/modules/auth/sessions/session.helpers.js` | Session helper belongs in sessions subfeature; kebab/plural naming. | Medium | Medium |
| `src/modules/auth/session/session.repository.js` | `src/modules/auth/sessions/sessions.repository.js` | Session persistence belongs in sessions subfeature. | Medium | Medium |
| `src/modules/auth/session/session.security.js` | `src/modules/auth/sessions/session-security.js` | Session-specific security workflow belongs in sessions. | Medium | Medium |
| `src/modules/auth/session/session.service.js` | `src/modules/auth/sessions/sessions.service.js` | Session workflow belongs in sessions subfeature. | Medium | Medium |
| `src/modules/auth/shared` | `src/modules/auth/shared` | Auth-only shared helpers can stay inside auth. | Low | Low |
| `src/modules/auth/shared/auth.utils.js` | `src/modules/auth/shared/auth.helpers.js` | Rename from generic utils to clearer auth helpers. | Medium | Low |
| `src/modules/auth/trusted-device` | `src/modules/auth/trusted-devices` | Plural folder better represents resource collection. | Medium | Medium |
| `src/modules/auth/trusted-device/trusted-device.repository.js` | `src/modules/auth/trusted-devices/trusted-devices.repository.js` | Trusted-device persistence belongs in auth subfeature. | Medium | Medium |
| `src/modules/auth/trusted-device/trusted-device.utils.js` | `src/modules/auth/trusted-devices/trusted-devices.helpers.js` | Trusted-device helper belongs in auth subfeature. | Medium | Medium |
| `src/modules/auth/two-factor` | `src/modules/auth/two-factor` | Correct auth subfeature location. | Low | Low |
| `src/modules/auth/two-factor/two-factor.controller.js` | `src/modules/auth/two-factor/two-factor.controller.js` | Correct subfeature controller location. | Low | Low |
| `src/modules/auth/two-factor/two-factor.repository.js` | `src/modules/auth/two-factor/two-factor.repository.js` | Correct subfeature repository location. | Low | Low |
| `src/modules/auth/two-factor/two-factor.routes.js` | `src/modules/auth/two-factor/two-factor.routes.js` | Correct subfeature route location. | Low | Low |
| `src/modules/auth/two-factor/two-factor.service.js` | `src/modules/auth/two-factor/two-factor.service.js` | Correct subfeature service location. | Low | Low |
| `src/modules/auth/two-factor/two-factor.validation.js` | `src/modules/auth/two-factor/two-factor.validation.js` | Correct subfeature validation location. | Low | Low |
| `src/modules/auth/verification` | `src/modules/auth/email-verification` | More explicit name avoids generic "verification". | Medium | Medium |
| `src/modules/auth/verification/verification.controller.js` | `src/modules/auth/email-verification/email-verification.controller.js` | Email verification controller belongs in explicit subfeature. | Medium | Medium |
| `src/modules/auth/verification/verification.repository.js` | `src/modules/auth/email-verification/email-verification.repository.js` | Email verification repository belongs in explicit subfeature. | Medium | Medium |
| `src/modules/auth/verification/verification.routes.js` | `src/modules/auth/email-verification/email-verification.routes.js` | Email verification route belongs in explicit subfeature. | Medium | Medium |
| `src/modules/auth/verification/verification.service.js` | `src/modules/auth/email-verification/email-verification.service.js` | Email verification workflow belongs in explicit subfeature. | Medium | Medium |

## Users And Notifications Modules

| Current Location | Recommended Location | Reason | Migration Difficulty | Breaking Risk |
|---|---|---|---|---|
| `src/modules/users` | `src/modules/users` | User domain module is correctly owned. | Low | Low |
| `src/modules/users/profile` | `src/modules/users/profile` | Singular profile is acceptable as current-user profile feature. | Low | Low |
| `src/modules/users/profile/profile.controller.js` | `src/modules/users/profile/profile.controller.js` | Correct feature controller location. | Low | Low |
| `src/modules/users/profile/profile.repository.js` | `src/modules/users/profile/profile.repository.js` | Correct feature repository location. | Low | Low |
| `src/modules/users/profile/profile.routes.js` | `src/modules/users/profile/profile.routes.js` | Correct feature route location. | Low | Low |
| `src/modules/users/profile/profile.service.js` | `src/modules/users/profile/profile.service.js` | Correct feature service location. | Low | Low |
| `src/modules/users/profile/profile.validation.js` | `src/modules/users/profile/profile.validation.js` | Correct feature validation location. | Low | Low |
| `src/modules/users/avatar` | `src/modules/users/avatar` | Singular avatar is acceptable as user-owned asset feature. | Low | Low |
| `src/modules/users/avatar/avatar.constants.js` | `src/modules/users/avatar/avatar.constants.js` | Avatar constants belong with avatar feature. | Low | Low |
| `src/modules/users/avatar/avatar.controller.js` | `src/modules/users/avatar/avatar.controller.js` | Avatar HTTP behavior belongs with avatar feature. | Low | Low |
| `src/modules/users/avatar/avatar.repository.js` | `src/modules/users/avatar/avatar.repository.js` | Avatar persistence belongs with avatar feature. | Low | Low |
| `src/modules/users/avatar/avatar.routes.js` | `src/modules/users/avatar/avatar.routes.js` | Avatar routes belong with avatar feature. | Low | Low |
| `src/modules/users/avatar/avatar.service.js` | `src/modules/users/avatar/avatar.service.js` | Avatar workflow belongs with avatar feature. | Low | Low |
| `src/modules/notifications` | `src/modules/notifications` | Notification domain module is correctly owned. | Low | Low |
| `src/modules/notifications/notification.constants.js` | `src/modules/notifications/notifications.constants.js` | Prefer plural basename matching module resource. | Medium | Low |
| `src/modules/notifications/notification.controller.js` | `src/modules/notifications/notifications.controller.js` | Prefer plural basename matching module resource. | Medium | Medium |
| `src/modules/notifications/notification.repository.js` | `src/modules/notifications/notifications.repository.js` | Prefer plural basename matching module resource. | Medium | Medium |
| `src/modules/notifications/notification.routes.js` | `src/modules/notifications/notifications.routes.js` | Prefer plural basename matching module resource. | Medium | Medium |
| `src/modules/notifications/notification.service.js` | `src/modules/notifications/notifications.service.js` | Prefer plural basename matching module resource. | Medium | Medium |
| `src/modules/notifications/notification.validation.js` | `src/modules/notifications/notifications.validation.js` | Prefer plural basename matching module resource. | Medium | Medium |
| `src/modules/notifications/sse` | `src/modules/notifications/sse` | Notification SSE belongs to notifications module. | Low | Low |
| `src/modules/notifications/sse/sse.controller.js` | `src/modules/notifications/sse/notifications-sse.controller.js` | Name should identify owning stream. | Medium | Low |
| `src/modules/notifications/sse/sse.manager.js` | `src/modules/notifications/sse/notifications-sse.manager.js` | Name should identify owning stream. | Medium | Low |

## Organizations Module

| Current Location | Recommended Location | Reason | Migration Difficulty | Breaking Risk |
|---|---|---|---|---|
| `src/modules/organizations` | `src/modules/organizations` | Organization tenant module is correctly owned. | Low | Low |
| `src/modules/organizations/core` | `src/modules/organizations` | Avoid ambiguous module `core`; flatten main organization resource. | Medium | Medium |
| `src/modules/organizations/core/organization.constants.js` | `src/modules/organizations/organizations.constants.js` | Main organization constants should sit at module root. | Medium | Medium |
| `src/modules/organizations/core/organization.controller.js` | `src/modules/organizations/organizations.controller.js` | Main organization controller should sit at module root. | Medium | Medium |
| `src/modules/organizations/core/organization.helper.js` | `src/modules/organizations/organizations.helpers.js` | Main organization helpers should sit at module root. | Medium | Medium |
| `src/modules/organizations/core/organization.repository.js` | `src/modules/organizations/organizations.repository.js` | Main organization repository should sit at module root. | Medium | Medium |
| `src/modules/organizations/core/organization.routes.js` | `src/modules/organizations/organizations.routes.js` | Main organization router should sit at module root. | Medium | Medium |
| `src/modules/organizations/core/organization.service.js` | `src/modules/organizations/organizations.service.js` | Main organization service should sit at module root. | Medium | Medium |
| `src/modules/organizations/core/organization.validation.js` | `src/modules/organizations/organizations.validation.js` | Main organization validation should sit at module root. | Medium | Medium |
| `src/modules/organizations/logo` | `src/modules/organizations/logos` | Plural folder better matches asset resource. | Medium | Medium |
| `src/modules/organizations/logo/logo.controller.js` | `src/modules/organizations/logos/logos.controller.js` | Logo behavior belongs to organization logos subfeature. | Medium | Medium |
| `src/modules/organizations/logo/logo.repository.js` | `src/modules/organizations/logos/logos.repository.js` | Logo persistence belongs to organization logos subfeature. | Medium | Medium |
| `src/modules/organizations/logo/logo.routes.js` | `src/modules/organizations/logos/logos.routes.js` | Logo routes belong to organization logos subfeature. | Medium | Medium |
| `src/modules/organizations/logo/logo.service.js` | `src/modules/organizations/logos/logos.service.js` | Logo workflow belongs to organization logos subfeature. | Medium | Medium |
| `src/modules/organizations/logo/logo.validation.js` | `src/modules/organizations/logos/logos.validation.js` | Logo validation belongs to organization logos subfeature. | Medium | Medium |
| `src/modules/organizations/members` | `src/modules/organizations/members` | Organization members subresource is correctly owned. | Low | Low |
| `src/modules/organizations/members/organizationMember.controller.js` | `src/modules/organizations/members/organization-members.controller.js` | Kebab-case plural basename improves consistency. | Medium | Medium |
| `src/modules/organizations/members/organizationMember.helper.js` | `src/modules/organizations/members/organization-members.helpers.js` | Kebab-case plural basename improves consistency. | Medium | Medium |
| `src/modules/organizations/members/organizationMember.repository.js` | `src/modules/organizations/members/organization-members.repository.js` | Kebab-case plural basename improves consistency. | Medium | Medium |
| `src/modules/organizations/members/organizationMember.routes.js` | `src/modules/organizations/members/organization-members.routes.js` | Kebab-case plural basename improves consistency. | Medium | Medium |
| `src/modules/organizations/members/organizationMember.service.js` | `src/modules/organizations/members/organization-members.service.js` | Kebab-case plural basename improves consistency. | Medium | Medium |
| `src/modules/organizations/members/organizationMember.validation.js` | `src/modules/organizations/members/organization-members.validation.js` | Kebab-case plural basename improves consistency. | Medium | Medium |

## Projects Module

| Current Location | Recommended Location | Reason | Migration Difficulty | Breaking Risk |
|---|---|---|---|---|
| `src/modules/projects` | `src/modules/projects` | Projects module is correctly owned. | Low | Low |
| `src/modules/projects/core` | `src/modules/projects` | Avoid ambiguous module `core`; flatten main project resource. | Medium | Medium |
| `src/modules/projects/core/project.constants.js` | `src/modules/projects/projects.constants.js` | Main project constants should sit at module root. | Medium | Medium |
| `src/modules/projects/core/project.controller.js` | `src/modules/projects/projects.controller.js` | Main project controller should sit at module root. | Medium | Medium |
| `src/modules/projects/core/project.helper.js` | `src/modules/projects/projects.helpers.js` | Main project helpers should sit at module root. | Medium | Medium |
| `src/modules/projects/core/project.repository.js` | `src/modules/projects/projects.repository.js` | Main project repository should sit at module root. | Medium | Medium |
| `src/modules/projects/core/project.routes.js` | `src/modules/projects/projects.routes.js` | Main project router should sit at module root. | Medium | Medium |
| `src/modules/projects/core/project.service.js` | `src/modules/projects/projects.service.js` | Main project service should sit at module root. | Medium | Medium |
| `src/modules/projects/core/project.validation.js` | `src/modules/projects/projects.validation.js` | Main project validation should sit at module root. | Medium | Medium |
| `src/modules/projects/members` | `src/modules/projects/members` | Project members subresource is correctly owned. | Low | Low |
| `src/modules/projects/members/projectMember.controller.js` | `src/modules/projects/members/project-members.controller.js` | Kebab-case plural basename improves consistency. | Medium | Medium |
| `src/modules/projects/members/projectMember.mapper.js` | `src/modules/projects/members/project-members.mapper.js` | Kebab-case plural basename improves consistency. | Medium | Medium |
| `src/modules/projects/members/projectMember.repository.js` | `src/modules/projects/members/project-members.repository.js` | Kebab-case plural basename improves consistency. | Medium | Medium |
| `src/modules/projects/members/projectMember.routes.js` | `src/modules/projects/members/project-members.routes.js` | Kebab-case plural basename improves consistency. | Medium | Medium |
| `src/modules/projects/members/projectMember.service.js` | `src/modules/projects/members/project-members.service.js` | Kebab-case plural basename improves consistency. | Medium | Medium |
| `src/modules/projects/members/projectMember.validation.js` | `src/modules/projects/members/project-members.validation.js` | Kebab-case plural basename improves consistency. | Medium | Medium |
| `src/modules/projects/tasks` | `src/modules/projects/tasks` | Tasks are project-scoped subdomain in this app. | Low | Low |
| `src/modules/projects/tasks/core` | `src/modules/projects/tasks` | Avoid ambiguous task `core`; flatten main task resource. | Medium | Medium |
| `src/modules/projects/tasks/core/task.controller.js` | `src/modules/projects/tasks/tasks.controller.js` | Main task controller should sit at task root. | Medium | Medium |
| `src/modules/projects/tasks/core/task.helper.js` | `src/modules/projects/tasks/tasks.helpers.js` | Main task helpers should sit at task root. | Medium | Medium |
| `src/modules/projects/tasks/core/task.notification.js` | `src/modules/projects/tasks/tasks.notifications.js` | Task notification helper belongs with tasks. | Medium | Medium |
| `src/modules/projects/tasks/core/task.project.routes.js` | `src/modules/projects/tasks/project-tasks.routes.js` | Route name should clarify project-scoped task collection. | Medium | Medium |
| `src/modules/projects/tasks/core/task.repository.js` | `src/modules/projects/tasks/tasks.repository.js` | Main task repository should sit at task root. | Medium | Medium |
| `src/modules/projects/tasks/core/task.routes.js` | `src/modules/projects/tasks/tasks.routes.js` | Main task router should sit at task root. | Medium | Medium |
| `src/modules/projects/tasks/core/task.service.js` | `src/modules/projects/tasks/tasks.service.js` | Main task service should sit at task root. | Medium | Medium |
| `src/modules/projects/tasks/core/task.validation.js` | `src/modules/projects/tasks/tasks.validation.js` | Main task validation should sit at task root. | Medium | Medium |

## Task Comments And Attachments

| Current Location | Recommended Location | Reason | Migration Difficulty | Breaking Risk |
|---|---|---|---|---|
| `src/modules/projects/tasks/comments` | `src/modules/projects/tasks/comments` | Comments are task subresource and correctly owned. | Low | Low |
| `src/modules/projects/tasks/comments/comment.controller.js` | `src/modules/projects/tasks/comments/comments.controller.js` | Prefer plural resource basename. | Medium | Medium |
| `src/modules/projects/tasks/comments/comment.mention.repository.js` | `src/modules/projects/tasks/comments/comment-mentions.repository.js` | Mentions are a nested comment concern; kebab-case name. | Medium | Medium |
| `src/modules/projects/tasks/comments/comment.notification.js` | `src/modules/projects/tasks/comments/comments.notifications.js` | Comment notification helper belongs with comments. | Medium | Medium |
| `src/modules/projects/tasks/comments/comment.repository.js` | `src/modules/projects/tasks/comments/comments.repository.js` | Prefer plural resource basename. | Medium | Medium |
| `src/modules/projects/tasks/comments/comment.routes.js` | `src/modules/projects/tasks/comments/comments.routes.js` | Prefer plural resource basename. | Medium | Medium |
| `src/modules/projects/tasks/comments/comment.service.js` | `src/modules/projects/tasks/comments/comments.service.js` | Prefer plural resource basename. | Medium | Medium |
| `src/modules/projects/tasks/comments/comment.task.routes.js` | `src/modules/projects/tasks/comments/task-comments.routes.js` | Route name should clarify task-scoped comment collection. | Medium | Medium |
| `src/modules/projects/tasks/comments/comment.utils.js` | `src/modules/projects/tasks/comments/comments.helpers.js` | Avoid generic utils; use helpers. | Medium | Medium |
| `src/modules/projects/tasks/comments/comment.validation.js` | `src/modules/projects/tasks/comments/comments.validation.js` | Prefer plural resource basename. | Medium | Medium |
| `src/modules/projects/tasks/attachments` | `src/modules/projects/tasks/attachments` | Attachments are task/comment subresource and correctly owned. | Low | Low |
| `src/modules/projects/tasks/attachments/attachment.comment.routes.js` | `src/modules/projects/tasks/attachments/comment-attachments.routes.js` | Route name should clarify comment-scoped attachment collection. | Medium | Medium |
| `src/modules/projects/tasks/attachments/attachment.controller.js` | `src/modules/projects/tasks/attachments/attachments.controller.js` | Prefer plural resource basename. | Medium | Medium |
| `src/modules/projects/tasks/attachments/attachment.repository.js` | `src/modules/projects/tasks/attachments/attachments.repository.js` | Prefer plural resource basename. | Medium | Medium |
| `src/modules/projects/tasks/attachments/attachment.service.js` | `src/modules/projects/tasks/attachments/attachments.service.js` | Prefer plural resource basename. | Medium | Medium |
| `src/modules/projects/tasks/attachments/attachment.task.routes.js` | `src/modules/projects/tasks/attachments/task-attachments.routes.js` | Route name should clarify task-scoped attachment collection. | Medium | Medium |
| `src/modules/projects/tasks/attachments/attachment.validation.js` | `src/modules/projects/tasks/attachments/attachments.validation.js` | Prefer plural resource basename. | Medium | Medium |
