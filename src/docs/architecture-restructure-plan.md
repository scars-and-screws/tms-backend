# Current Architecture Assessment

The backend already follows a good small-to-medium SaaS foundation: Express entry points, Prisma repositories, feature modules, controller/service/repository layering, Zod validation, and shared infrastructure under `src/core`.

Current high-level shape:

```text
src/
  app.js
  server.js
  core/
    activity/
    config/
    database/
    mail/
    middleware/
    otp/
    pagination/
    security/
    upload/
    utils/
    validation/
  modules/
    auth/
    notifications/
    organizations/
    projects/
    users/
```

The biggest architectural issue is not the layering itself. It is ownership ambiguity. Some `core` folders are true infrastructure, such as `database`, `middleware`, `security`, and `config`. Other `core` folders are reusable domain capabilities, such as `activity`, `otp`, `mail`, and `upload`. Those can stay shared, but they need clearer ownership rules so developers know whether a new file belongs in a business module or in shared infrastructure.

The current modules are mostly cohesive. `auth`, `users`, `organizations`, `projects`, and `notifications` are sensible top-level modules for a SaaS task management system. The naming issue is that `core` appears inside modules to mean "the main resource", while `src/core` means "shared application infrastructure". That dual meaning can confuse beginners.

## Current Folder Review

### `src/core`

What belongs there:

- Cross-cutting infrastructure used by multiple modules.
- Framework-level middleware.
- Database client setup.
- Environment and provider configuration.
- Generic security primitives.
- Generic API utilities.
- Shared validators and pagination helpers.

What does not belong there:

- Business workflows that belong to one feature module.
- Resource-specific controllers and routes, unless they are intentionally shared system resources.
- Module-specific constants such as task statuses or organization roles when those constants are owned by a domain module.

Why:

`core` should contain code that would still exist if the product domain changed from task management to another SaaS app. If code knows too much about organizations, projects, tasks, comments, or notifications, it should usually live in a module or in a clearly named shared domain package.

### `src/modules`

What belongs there:

- Business capabilities and API resources.
- Routes, controllers, services, repositories, validators, constants, mappers, and helpers for a specific domain.
- Domain-specific authorization decisions when they are not generic.

What does not belong there:

- Global Express setup.
- Generic HTTP error handling.
- Generic security primitives such as token signing or password hashing.
- Provider SDK setup shared across modules.

Why:

Modules should own business behavior. A developer working on projects should be able to find most project behavior under `src/modules/projects` without hunting through unrelated shared folders.

### `src/core/config`

What belongs there:

- Environment parsing.
- Provider config objects.
- Typed or validated configuration values.
- Runtime constants derived from environment variables.

What does not belong there:

- Business constants such as `PROJECT_ROLES`.
- Secrets hard-coded in source.
- Provider client instances with behavior, unless they are only config factories.

Why:

Config should answer "what values does the app run with?" It should not perform product workflows.

### `src/core/database`

What belongs there:

- Prisma client initialization.
- Database adapter setup.
- Optional transaction helpers.
- Optional database health checks.

What does not belong there:

- Model-specific queries.
- Repository functions.
- Seed data or migration logic, unless placed in clearly separate scripts.

Why:

Database infrastructure is shared, but data access should remain in repositories owned by modules.

### `src/core/middleware`

What belongs there:

- Express middleware used across multiple modules.
- Authentication middleware.
- Validation middleware.
- Error and not-found middleware.
- Request ID, CORS, rate limit, and logging middleware.
- Generic access guard composition helpers.

What does not belong there:

- Deep business-specific policies that only apply to one module and are not reused.
- Database-heavy domain logic that duplicates services.

Why:

Middleware should guard, enrich, or normalize requests. It should not become a second service layer.

### `src/core/security`

What belongs there:

- Password hashing.
- Token signing and verification.
- Cookie helpers.
- Device fingerprint helpers.
- Session token primitives.
- Expiry utilities.

What does not belong there:

- Auth use cases such as login, logout, password reset, 2FA verification, or trusted-device persistence.
- Repositories.

Why:

Security primitives are shared building blocks. Authentication workflows are product behavior and belong in `src/modules/auth`.

### `src/core/utils`

What belongs there:

- Small generic helpers with no domain ownership.
- `ApiError`, `ApiResponse`, and `asyncHandler`.
- Request metadata utilities.

What does not belong there:

- Helpers tied to auth, users, tasks, projects, or organizations.
- Large workflows.
- Miscellaneous dumping ground code.

Why:

`utils` should be boring and tiny. If a utility has a domain word in the name, it probably belongs in that module.

### `src/core/validation`

What belongs there:

- Reusable primitive schemas: IDs, email, password, pagination query primitives, names, dates.
- Generic Zod helpers.

What does not belong there:

- Full route schemas for specific endpoints.
- Business-specific validation rules that only one module uses.

Why:

Primitive schemas keep validation consistent. Endpoint validation should stay near the endpoint.

### `src/core/pagination`

What belongs there:

- Pagination constants.
- Pagination query parsing.
- Pagination metadata builders.

What does not belong there:

- Module-specific filtering.
- Repository query construction.

Why:

Pagination is a shared API pattern, but filters belong to the module that owns the resource.

### `src/core/mail`

What belongs there:

- Mail provider adapter.
- Generic send-mail service.
- Shared mail template primitives.
- Transactional email templates if the team treats email as a platform capability.

What does not belong there:

- Auth workflow decisions such as when to send verification or password reset emails.
- Notification business rules.

Why:

Mail delivery is infrastructure. Deciding which email to send is business logic.

### `src/core/upload`

What belongs there:

- Upload middleware.
- Cloudinary adapter.
- Generic upload config.
- Shared file validation.
- Shared upload/delete service.

What does not belong there:

- Avatar-specific behavior.
- Organization logo behavior.
- Task attachment persistence.

Why:

Uploading bytes is infrastructure. Attaching those files to users, organizations, tasks, or comments is module behavior.

### `src/core/otp`

What belongs there:

- OTP generation.
- OTP hashing/verification primitives.
- Generic OTP config.
- Generic OTP validation primitives.

What does not belong there:

- Email verification workflow.
- Password reset workflow.
- 2FA login workflow.

Why:

OTP is a reusable security capability. Purpose-specific flows belong in `auth`.

### `src/core/activity`

What belongs there today:

- Shared activity logging service.
- Activity metadata helpers.
- Activity routes for organization/project/task timelines.
- Activity SSE manager.

What does not belong there long term:

- If activity becomes a full product feature with API routes, repositories, and SSE, it should be promoted to `src/modules/activity`.
- It should not be half infrastructure and half module without explicit rules.

Why:

Activity is domain-aware. It references organizations, projects, tasks, actors, and activity types. It is shared across modules, but it is not generic infrastructure.

### `src/modules/auth`

What belongs there:

- Register, login, refresh, logout.
- Sessions.
- Password reset.
- Email verification.
- Two-factor authentication.
- Trusted devices.
- Auth-specific repositories and validators.
- Auth-specific shared helpers.

What does not belong there:

- Generic token signing primitives.
- Generic password hashing primitives.
- Generic cookie utilities.

Why:

Auth owns identity workflows. `core/security` owns primitives used by auth.

### `src/modules/users`

What belongs there:

- User profile APIs.
- Avatar behavior.
- User-facing preferences and account profile data.

What does not belong there:

- Authentication credentials and sessions.
- Organization/project memberships.

Why:

Users owns profile data. Auth owns identity access. Memberships belong to organizations/projects.

### `src/modules/organizations`

What belongs there:

- Organization CRUD.
- Organization membership.
- Organization roles.
- Organization logo behavior.
- Organization-scoped policies.

What does not belong there:

- Project internals, except route mounting.
- Generic upload behavior.
- Generic RBAC primitives if reused widely.

Why:

Organizations are the tenant boundary. This module should own tenant-level rules.

### `src/modules/projects`

What belongs there:

- Project CRUD.
- Project members.
- Project roles.
- Project-scoped tasks, comments, and attachments if the product treats them as project subdomains.

What does not belong there:

- Organization membership rules, except calls to organization-owned checks.
- Generic activity or notification delivery infrastructure.

Why:

Projects are a major domain aggregate. Tasks belong naturally under projects in this system.

### `src/modules/notifications`

What belongs there:

- Notification records.
- Notification list/read APIs.
- Notification SSE stream.
- Notification type constants.

What does not belong there:

- Activity SSE.
- Business decisions about when every domain event should notify users, unless centralized as a notification policy layer.

Why:

Notifications own delivery and persistence of user notifications. Domain modules should raise or request notifications when meaningful events happen.

# Ideal Architecture

The ideal architecture keeps the current modular style but clarifies ownership:

```text
src/
  app.js
  server.js

  infrastructure/
    config/
      env.js
      cors.config.js
      mail.config.js
      upload.config.js
    database/
      prisma.client.js
      transaction.js
    http/
      middleware/
      errors/
      responses/
    security/
      password.js
      tokens.js
      cookies.js
      fingerprint.js
    providers/
      cloudinary.provider.js
      mail.provider.js
    realtime/
      sse.manager.js

  shared/
    validation/
      schemas.js
    pagination/
      pagination.constants.js
      pagination.utils.js
    utils/
      async-handler.js
      request-meta.js
    types-or-contracts/

  modules/
    auth/
      auth.routes.js
      auth.controller.js
      auth.service.js
      auth.repository.js
      auth.validation.js
      auth.constants.js
      sessions/
      password-reset/
      email-verification/
      two-factor/
      trusted-devices/

    users/
      profiles/
      avatars/

    organizations/
      organizations.routes.js
      organizations.controller.js
      organizations.service.js
      organizations.repository.js
      organizations.validation.js
      organizations.constants.js
      members/
      logos/

    projects/
      projects.routes.js
      projects.controller.js
      projects.service.js
      projects.repository.js
      projects.validation.js
      projects.constants.js
      members/
      tasks/
        tasks.routes.js
        tasks.controller.js
        tasks.service.js
        tasks.repository.js
        tasks.validation.js
        comments/
        attachments/

    notifications/
      notifications.routes.js
      notifications.controller.js
      notifications.service.js
      notifications.repository.js
      notifications.validation.js
      notifications.constants.js
      sse/

    activity/
      activity.routes.js
      activity.controller.js
      activity.service.js
      activity.repository.js
      activity.validation.js
      activity.constants.js
      activity.mapper.js
      sse/

  generated/
    prisma/
```

For this project, a smaller transition is better than a dramatic rewrite. A practical near-term structure can keep `src/core`, but define it as:

```text
src/core = infrastructure + generic shared utilities only
src/modules = all product/domain features
```

That means `activity` should eventually become `src/modules/activity`, while `mail`, `upload`, and `otp` can remain in `core` if treated as platform services.

# Folder Ownership Rules

## `app.js` and `server.js`

Belongs:

- Express app composition.
- Global middleware registration.
- Top-level route mounting.
- Server startup and shutdown.

Does not belong:

- Business logic.
- Prisma queries.
- Route-level validation details.

Why:

Entry points should wire the system together without owning domain behavior.

## Infrastructure/Core Ownership

Belongs:

- Code that is shared by multiple modules and independent of one business feature.
- Code that wraps external providers.
- Code that normalizes HTTP behavior.

Does not belong:

- Business workflows.
- Resource-specific policies.
- Domain event decisions.

Why:

This keeps `core` stable and prevents it from becoming a hidden mega-module.

## Module Ownership

Belongs:

- API surface for that domain.
- Business rules.
- Data access for that domain.
- Domain constants and enums.
- Domain mappers and response shaping.

Does not belong:

- Provider SDK setup.
- Global middleware.
- Unrelated module queries except through a clearly named repository/service function.

Why:

Modules should be independently understandable.

# Naming Convention Rules

## Folders

Use kebab-case for folder names:

```text
password-reset/
two-factor/
trusted-devices/
project-members/
task-attachments/
```

Avoid mixing kebab-case directories with camelCase file basenames unless there is a strong reason.

## Files

Use kebab-case file names with role suffixes:

```text
tasks.routes.js
tasks.controller.js
tasks.service.js
tasks.repository.js
tasks.validation.js
tasks.constants.js
tasks.mapper.js
tasks.helpers.js
```

Current camelCase files such as `projectMember.service.js` and `organizationMember.validation.js` are readable, but the project should choose one style. For Node.js backends, kebab-case is usually friendlier across platforms and URLs.

## Resource Names

Use plural names for top-level resources:

```text
users
organizations
projects
tasks
comments
attachments
notifications
activities
```

Use singular names only for concepts that are truly singular:

```text
profile
avatar
session
config
middleware
security
```

## Layer Suffixes

Use these suffixes consistently:

- `.routes.js` for Express routers.
- `.controller.js` for HTTP request/response handlers.
- `.service.js` for business logic.
- `.repository.js` for Prisma access.
- `.validation.js` for route schemas.
- `.constants.js` for domain constants.
- `.mapper.js` for shaping database records into API DTOs.
- `.helpers.js` for module-local pure helper functions.
- `.policy.js` for authorization/business permission rules if those grow.
- `.events.js` for domain event names and event emitters if introduced.

## Avoid Ambiguous Names

Avoid:

```text
core/
helper.js
utils.js
shared/
common/
manager.js
```

Unless the folder or file has strict ownership. Prefer:

```text
projects/
project-permissions.policy.js
activity-sse.manager.js
auth-response.mapper.js
```

# Shared Code Placement Rules

Use this decision tree:

1. Is it used by only one module?
   - Put it inside that module.

2. Is it used by several modules but still business-domain specific?
   - Put it in a shared domain module, such as `modules/activity`, or a clearly named shared package.

3. Is it generic infrastructure?
   - Put it in `core` or `infrastructure`.

4. Is it a primitive helper with no domain knowledge?
   - Put it in `shared/utils`, `shared/validation`, or `shared/pagination`.

5. Is it provider-specific?
   - Put it in `infrastructure/providers` or a provider-specific core folder.

Examples:

- `ApiError`: shared HTTP infrastructure.
- `idSchema`: shared validation.
- `projectRoleSchema`: projects module or shared only if used broadly.
- `uploadToCloudinary`: upload infrastructure.
- `uploadAvatarService`: users module.
- `createActivityService`: activity module.
- `sendEmailVerificationService`: auth module.
- `sendMail`: mail infrastructure.

# Module Boundary Rules

## Routes

Routes should:

- Mount middleware.
- Apply validation.
- Delegate to controllers.
- Avoid business decisions.

Routes should not:

- Query Prisma.
- Build complex response data.
- Perform authorization logic beyond composing middleware.

## Controllers

Controllers should:

- Extract `req.params`, `req.query`, `req.body`, and `req.user`.
- Call one service method.
- Return `ApiResponse`.

Controllers should not:

- Perform database reads.
- Contain role logic.
- Decide notification/activity behavior.

## Services

Services should:

- Own business workflows.
- Enforce business rules.
- Call repositories.
- Coordinate transactions.
- Request side effects such as activity logs and notifications.

Services should not:

- Depend on Express `req` or `res`.
- Build raw Prisma query details repeatedly.
- Return raw sensitive database fields.

## Repositories

Repositories should:

- Own Prisma queries.
- Hide select/include details.
- Accept simple parameters.
- Optionally accept a transaction client.

Repositories should not:

- Throw HTTP-specific errors unless the project intentionally allows it.
- Perform business permission checks.
- Send emails, notifications, or activity events.

## Validators

Validators should:

- Define request body, params, and query schemas.
- Reuse shared primitive schemas.

Validators should not:

- Query the database.
- Encode complex authorization rules.

## Helpers and Mappers

Helpers should:

- Be module-local and pure when possible.
- Support services and mappers.

Mappers should:

- Shape API responses.
- Remove sensitive fields.
- Normalize nested objects.

Helpers and mappers should not:

- Trigger side effects.
- Perform database writes.

# Anti Patterns Found

## `core` Contains Domain Features

`src/core/activity` is a full domain feature with routes, controller, service, repository, validation, constants, and SSE. That shape looks like a module, not generic infrastructure.

Better:

```text
src/modules/activity/
```

## Ambiguous `core` Inside Modules

Examples:

```text
src/modules/auth/core
src/modules/projects/core
src/modules/organizations/core
src/modules/projects/tasks/core
```

The word `core` means "main resource" here, but it also means shared infrastructure at `src/core`.

Better options:

```text
src/modules/projects/projects.service.js
src/modules/organizations/organizations.service.js
src/modules/tasks/tasks.service.js
```

or:

```text
src/modules/projects/project/
src/modules/organizations/organization/
```

Pick one convention and apply it gradually.

## Mixed Naming Styles

Examples:

```text
password-reset/
two-factor/
trusted-device/
projectMember.service.js
organizationMember.validation.js
```

Better:

```text
password-reset/
two-factor/
trusted-devices/
project-members.service.js
organization-members.validation.js
```

## Generic `utils` Risk

`src/core/utils` contains generic utilities, but files like `buildAuthResponse.js`, `buildTokenPayload.js`, and `sanitizeUser.js` are auth/user specific.

Better:

```text
src/modules/auth/auth-response.mapper.js
src/modules/auth/token-payload.mapper.js
src/modules/users/user.mapper.js
```

## Domain-Specific Middleware in Core

Middleware such as `requireOrganizationMember`, `requireProjectMember`, `requireTaskAccess`, and `requireCommentAccess` is currently in `core/middleware`. It is reusable, but domain-specific.

Acceptable short term:

```text
src/core/middleware/requireProjectMember.js
```

Better long term:

```text
src/modules/projects/middleware/require-project-member.js
src/modules/organizations/middleware/require-organization-member.js
src/modules/tasks/middleware/require-task-access.js
```

## Side-Effect Managers Split by Feature

Notification SSE lives under `modules/notifications/sse`; activity SSE lives under `core/activity/sse`. Both are SSE mechanisms but owned by different features.

Better:

- Keep feature-specific SSE inside each module.
- Extract only generic connection primitives to infrastructure if duplication appears.

## Barrel Exports Can Hide Ownership

`index.js` barrel files are convenient, but if overused they obscure where code comes from.

Rule:

- Use barrel exports for stable public APIs of a folder.
- Avoid importing everything from huge barrels in files that need only one dependency.

## Generated Prisma Client Under `src`

The generated client output is under `src/generated/prisma`. It is ignored by `.gitignore`, but local generation can make source search noisy.

Acceptable:

- Keep generated output ignored.

Alternative:

- Use default Prisma client output and import from `@prisma/client` if Prisma 7 setup permits the desired adapter approach.

# Refactoring Strategy

Refactor in thin, safe slices. Do not reorganize everything in one pass.

## Phase 1: Document Rules

- Add architecture rules to documentation.
- Keep existing imports unchanged.
- Establish naming rules for new files.

Goal:

- Stop the structure from drifting further before moving files.

## Phase 2: Fix Ownership Without Moving Routes

- Move domain-specific utilities out of `core/utils` into their modules.
- Keep compatibility exports temporarily if needed.
- Avoid changing public API paths.

Candidate moves:

```text
core/utils/buildAuthResponse.js -> modules/auth/auth-response.mapper.js
core/utils/buildTokenPayload.js -> modules/auth/token-payload.mapper.js
core/utils/sanitizeUser.js -> modules/users/user.mapper.js
```

## Phase 3: Promote Activity to a Module

Move:

```text
src/core/activity -> src/modules/activity
```

Keep route paths unchanged:

```text
/api/v1/organizations/:organizationId/activities
/api/v1/projects/:projectId/activities
/api/v1/tasks/:taskId/activities
```

Goal:

- Make activity ownership explicit without changing frontend behavior.

## Phase 4: Normalize Module `core` Folders

Rename gradually:

```text
src/modules/projects/core -> src/modules/projects/project
src/modules/organizations/core -> src/modules/organizations/organization
src/modules/auth/core -> src/modules/auth/auth
src/modules/projects/tasks/core -> src/modules/projects/tasks/task
```

or flatten:

```text
src/modules/projects/projects.service.js
src/modules/organizations/organizations.service.js
```

Recommendation:

- For this project, flatten top-level module main resources and keep subresources in folders.

Example:

```text
src/modules/projects/
  projects.routes.js
  projects.controller.js
  projects.service.js
  projects.repository.js
  members/
  tasks/
```

## Phase 5: Move Domain Middleware Near Owners

Move gradually:

```text
core/middleware/requireOrganizationMember.js -> modules/organizations/middleware/require-organization-member.js
core/middleware/requireProjectMember.js -> modules/projects/middleware/require-project-member.js
core/middleware/requireTaskAccess.js -> modules/projects/tasks/middleware/require-task-access.js
```

Keep generic middleware in core:

```text
authenticate.js
validate.js
errorHandler.js
notFound.js
requestId.js
rateLimit.js
```

## Phase 6: Standardize Naming

New files should use kebab-case immediately. Existing files can be renamed only when tests exist and the change is isolated.

Do not rename everything at once. Rename by module:

1. Notifications.
2. Users.
3. Organizations.
4. Projects/tasks.
5. Auth.

# Migration Order

1. Create architecture documentation and naming rules.
2. Add or improve integration tests around auth, organizations, projects, tasks, notifications, and activity.
3. Fix critical runtime issues before moving files.
4. Move auth/user-specific utilities out of `core/utils`.
5. Promote `core/activity` to `modules/activity`.
6. Normalize `core` folder names inside modules.
7. Move domain-specific middleware into module-owned middleware folders.
8. Standardize file names module by module.
9. Revisit generated Prisma client placement only after functional refactors are stable.
10. Introduce shared infrastructure folders such as `infrastructure` and `shared` only if the team wants a clearer split than `core`.

Recommended final target for this project:

```text
src/
  app.js
  server.js
  core/
    config/
    database/
    http/
    middleware/
    security/
    providers/
  shared/
    pagination/
    validation/
    utils/
  modules/
    auth/
    users/
    organizations/
    projects/
    notifications/
    activity/
```

This target keeps the project beginner-friendly while giving each folder a clean job. The main principle is simple: infrastructure goes in `core`, generic reusable helpers go in `shared`, and product behavior goes in `modules`.

