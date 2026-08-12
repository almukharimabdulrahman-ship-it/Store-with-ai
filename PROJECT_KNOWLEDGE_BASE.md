# Store-with-ai — Persistent Project Knowledge Base

> Purpose: persistent handoff context for future ChatGPT/Codex sessions. Read this file before proposing or making project changes.
>
> Last verified: **2026-08-12** (Africa/Tripoli).
>
> Security rule: never store passwords, reset links/tokens, API keys, Auth secrets, full database URIs, or other credentials in this file, Git, screenshots, logs, or chat. Store environment-variable names and non-secret configuration facts only.

## 1. Owner intent and working style

- Primary goal: operate a working production e-commerce store first, then improve the admin experience, storefront design, products, and commercial features.
- The owner is not a programmer. The assistant/Codex should choose sensible implementation details, perform safe technical work directly when authorized, and provide exact UI steps only when a manual account action is unavoidable.
- Keep one canonical GitHub repository, one canonical Vercel project, and one canonical Supabase project.
- Repair the current production system instead of creating duplicate projects.
- Diagnose from evidence: check code, deployment state, runtime responses/logs, and database state before changing infrastructure.
- Make one controlled change at a time, redeploy, then verify the complete flow.

## 2. Canonical resources

- GitHub repository: `almukharimabdulrahman-ship-it/Store-with-ai`
- Production branch: `main`
- Vercel project: `store-with-ai`
- Stable production URL: `https://store-with-ai.vercel.app`
- Supabase Project Ref: `lnzpdfotfutkqsiknrbq`
- Production application baseline verified after Auth.js fixes: commit `d4b9aae`

Generated Vercel deployment URLs are immutable deployment aliases. They do **not** indicate that a new Vercel project was created. Always use the stable production URL for user-facing verification.

## 3. Current verified status

As of 2026-08-12, there is **no active database, deployment, or login blocker**.

| Area | Status | Evidence |
|---|---|---|
| GitHub → Vercel deployment | Working | Vercel status for application baseline commit `d4b9aae` was `success` |
| Production storefront | Working | `/` returned HTTP `200` |
| Login page | Working | `/login` returned HTTP `200` |
| Registration page | Working | `/register` returned HTTP `200` |
| Auth.js providers | Working | `/api/auth/providers` returned HTTP `200` and the credentials provider |
| Auth.js CSRF | Working | `/api/auth/csrf` returned HTTP `200` and a token |
| Auth.js session endpoint | Working | `/api/auth/session` returned HTTP `200` |
| Protected routes | Working | Logged-out requests to `/dashboard` and `/admin` return `307` to `/login` |
| Database connectivity | Working | Live Prisma/database health was verified before the temporary diagnostic route was removed |
| Owner account | Working | One verified user with a password and `SUPER_ADMIN` role exists; owner manually confirmed successful Dashboard login |
| Password reset flow | Working end to end | Owner requested a reset, received the Resend email, opened the time-limited link, set a new password, signed in with it, and reached the deployed Dashboard; database verification found `0` remaining reset tokens |
| Transactional email | Working for owner test | `RESEND_API_KEY` and `AUTH_EMAIL_FROM` are configured in Production; forgot-password email was accepted by Resend and arrived. Current `onboarding@resend.dev` sender is only for testing until a custom domain is verified |
| Dedicated Auth.js secret | Working | A dedicated `AUTH_SECRET` was added to Vercel Production; the owner successfully logged in after redeployment on 2026-08-12 |

### Database summary at last verification

- Users: `1`
- Roles: `4`
- Store settings: `1`
- Ready verified `SUPER_ADMIN` accounts: `1`
- Latest password-reset test: completed end to end; new password login succeeded and remaining reset tokens: `0`

Do not store the owner's login email or password in this knowledge base.

## 4. Current stack and build behavior

This is a Next.js App Router application.

- Next.js `15.5.21`
- React `19.1.0`
- TypeScript 5.x
- Prisma / `@prisma/client` 6.x
- Auth.js / NextAuth v5 beta
- `@auth/prisma-adapter`
- `bcryptjs`
- `zod`
- Tailwind CSS 4
- `tsx`

Current production build script from `package.json`:

```bash
prisma generate && next build
```

The previous knowledge-base claim that every deployment runs `prisma db push` and `prisma/bootstrap.ts` is outdated. Do not reintroduce destructive or implicit schema synchronization into the production build. Use reviewed migrations for future schema changes.

Prisma 7 notices are warnings, not the cause of the recovered production failures. Do not upgrade Prisma during unrelated recovery work.

## 5. Database architecture

Prisma uses:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

Main models include:

- Role
- User
- Account
- Session
- VerificationToken
- PasswordResetToken
- EmailVerificationToken
- Address
- Category
- Brand
- Product / ProductCategory / ProductImage / ProductVariant
- Inventory
- Cart / CartItem
- Wishlist / WishlistItem
- Coupon
- Order / OrderItem
- Payment
- Review
- Notification
- StoreSetting

The active Supabase database contains the required schema, roles, store profile, and owner account.

## 6. Canonical Supabase connection facts

Active project ref:

`lnzpdfotfutkqsiknrbq`

Never reuse deleted/old project refs, especially:

`juhbbeahctcgygqnvcwg`

### Correct pooler routing discovered during recovery

- Wrong host for this tenant: `aws-0-eu-west-1.pooler.supabase.com`
- Correct reachable host: `aws-1-eu-west-1.pooler.supabase.com`
- Runtime/serverless `DATABASE_URL`: transaction pooler pattern, port `6543`, SSL required, with PgBouncer-compatible options.
- `DIRECT_URL`: session pooler pattern, port `5432`, SSL required.
- A direct database hostname `db.<project-ref>.supabase.co:5432` produced Prisma `P1001` from Vercel and should not be restored without first proving IPv6/network reachability.

Never put the full URI or database password in Git. If the password changes, both `DATABASE_URL` and `DIRECT_URL` must be updated atomically for the correct Vercel environment, followed by a fresh production deployment and runtime verification.

### Runtime resilience in `src/lib/prisma.ts`

- The app normalizes the exact stale `aws-0` host for this project to the proven `aws-1` host before constructing PrismaClient.
- Prisma retries transient `P1001`, `P1002`, and `P2024` failures up to two times with a short backoff.
- This is resilience, not permission to leave Vercel variables incorrect. The source environment values should still use the correct pooler host.

## 7. Authentication status and behavior

Authentication uses Auth.js credentials with bcrypt password hashes, JWT sessions, PrismaAdapter, case-insensitive email lookup, and role data stored in the session token.

Working routes include:

- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`
- `/verify-email`
- `/dashboard`
- `/admin`

### Owner account

- Account exists in the application `User` table.
- Email verification is complete.
- Password hash is a valid bcrypt `$2b$12$` hash.
- Role is `SUPER_ADMIN`.
- Password was reset through a one-time, one-hour token.
- The reset token was invalidated after use.
- Successful login and Dashboard rendering were manually confirmed by the owner on 2026-08-12.

### Auth.js secret behavior

Missing `AUTH_SECRET` caused every Auth.js endpoint to return HTTP `500` with:

```text
There was a problem with the server configuration.
```

`src/auth.config.ts` and `src/auth.ts` now use the same priority:

1. `AUTH_SECRET`
2. legacy `NEXTAUTH_SECRET`
3. app-scoped server-only fallback derived from `DATABASE_URL`
4. app-scoped server-only fallback derived from `DIRECT_URL`

This restored production immediately without committing a secret. A dedicated random `AUTH_SECRET` was subsequently added to Vercel Production on 2026-08-12. After redeployment, the owner successfully logged in and reached the Dashboard, verifying the new secret in the live authentication flow. It now takes precedence over the fallbacks; the fallbacks remain server-only recovery resilience. Existing JWT sessions may be invalidated when the active secret changes, which is expected.

### Registration and email failure behavior

Registration used to fail operationally when verification email delivery failed. It now keeps the newly created account and reports that an administrator must verify it. This prevents loss of a correctly created account during a Resend outage.

Forgot-password intentionally returns a generic response to prevent account enumeration. If email delivery fails, the undelivered token is removed.

Resend is now configured in Vercel Production. The owner completed the full forgot-password flow on 2026-08-12: request, email delivery, link use, password update, login with the new password, and Dashboard access. A read-only database check afterward confirmed the account remained verified with `SUPER_ADMIN` and no reset tokens remained. The current sender is the Resend onboarding sender for testing; a custom owned domain must still be verified before sending authentication mail to arbitrary customer addresses.

## 8. Incident history and lessons learned

This section is a debugging history, not a list of current blockers.

### Incident A — deleted/old Supabase tenant

**Symptom**

```text
FATAL: (ENOTFOUND) tenant/user postgres.juhbbeahctcgygqnvcwg not found
```

**Root cause:** connection strings still referenced a deleted/old project.

**Resolution:** establish one canonical project ref: `lnzpdfotfutkqsiknrbq`.

**Lesson:** verify the project ref inside every database URL before changing passwords or code.

### Incident B — direct database host unreachable from Vercel

**Symptom**

```text
P1001: Can't reach database server at db.lnzpdfotfutkqsiknrbq.supabase.co:5432
```

**Root cause:** the direct hostname was not reachable from the Vercel build/runtime path being used.

**Resolution:** use the same project's IPv4-compatible Supabase pooler connection.

**Lesson:** `P1001` is a reachability problem; it is not proof that the password is wrong.

### Incident C — wrong pooler shard

**Symptom**

```text
FATAL: (ENOTFOUND) tenant/user postgres.lnzpdfotfutkqsiknrbq not found
```

despite using the correct project ref.

**Root cause:** the URL used `aws-0-eu-west-1.pooler.supabase.com`, while this tenant was reachable on `aws-1-eu-west-1.pooler.supabase.com`.

**Resolution:** test both routing facts safely, select `aws-1`, and add exact host normalization in `src/lib/prisma.ts`.

**Lesson:** a correct username/project ref can still fail on the wrong pooler shard. Do not rotate the password until the hostname is proven.

### Incident D — Vercel showed `Ready`, but runtime failed

**Symptom:** build/deployment was green while the storefront returned a server-side exception.

**Root cause:** Vercel `Ready` confirms the artifact deployed, not that database and Auth.js runtime flows work.

**Resolution:** add a temporary database health route, verify live connectivity, then remove the route; test public and Auth.js endpoints separately.

**Lesson:** after every infrastructure change, verify browser/page → API/server action → database → response. Never stop at the green deployment badge.

### Incident E — repeated database-password rotation

**Symptom:** a week of changing passwords without restoring login.

**Root cause:** multiple independent problems were treated as one password problem: deleted project ref, wrong host, wrong pooler shard, missing Auth.js secret, email delivery, and store-account password mismatch.

**Resolution:** freeze password changes, test exact connection parameters, and separate each credential domain.

**Lesson:** distinguish these credentials:

- Supabase account login
- Supabase project database password
- Vercel account login
- GitHub account login
- Store customer/administrator password
- Resend API key
- Auth.js session secret

They are not interchangeable.

### Incident F — registration email unavailable

**Symptom:** registration reported temporary unavailability or created an account that could not self-verify.

**Root cause:** transactional email was not configured/reliably delivered.

**Resolution:** preserve the account on delivery failure and manually verify the owner account in the database.

**Lesson:** account creation and email delivery are separate transactions. An email outage must not destroy valid user data.

### Incident G — Auth.js configuration failure

**Symptom:** all Auth.js endpoints returned HTTP `500` and the generic server-configuration JSON message.

**Root cause:** no usable Auth.js secret in Production.

**Resolution:** use a consistent server-only secret resolution in both middleware config and full Auth.js handlers. Verified `/api/auth/providers`, `/api/auth/csrf`, and `/api/auth/session` returned `200` after deployment.

**Lesson:** when all Auth endpoints fail before credential checking, diagnose Auth.js configuration before touching the user or database password.

### Incident H — invalid credentials after Auth.js recovery

**Symptom:** login page showed `Invalid credentials or unverified email`.

**Root cause:** the generic UI message covered three possible states, but database inspection proved the account existed, was verified, had `SUPER_ADMIN`, and had a valid bcrypt hash. The entered store password did not match that hash.

**Resolution:** create a one-time reset token, let the owner choose a new password inside the site, verify token deletion, and confirm Dashboard login.

**Lesson:** never try to read or guess a hashed password. Prove account state first, then use a time-limited reset flow.

### Incident I — Resend rejected an invalid sender field

**Symptom**

```text
422 validation_error: Invalid from field
```

The forgot-password page still returned its generic success message, and no email appeared in Resend.

**Root cause:** `AUTH_EMAIL_FROM` in Vercel did not match a Resend-accepted sender format.

**Resolution:** use the Resend onboarding sender during testing, redeploy Production, and repeat the forgot-password request. Resend accepted the message, the owner received and used the reset link, signed in with the new password, and reached the Dashboard. The consumed reset token was deleted as designed.

**Lesson:** HTTP `200` from the forgot-password action is intentionally not proof of email delivery. Inspect the function log and provider message. A `422` sender-validation error also proves the request reached Resend; do not rotate the API key or database password for this error. Use a verified custom domain before sending to arbitrary customer addresses.

## 9. Traceable recovery commits

Important application commits from the successful recovery:

- `5825fe83` — runtime Supabase pooler-host correction
- `1d1d67b` — remove temporary database health diagnostic after verification
- `75b5365` — keep registered account when verification email delivery fails
- `8cd64bc3` — provide stable production secret to middleware Auth.js config
- `d4b9aae3` — use the same stable secret in full Auth.js handlers

Fetch the current `main` HEAD before future changes; these commits are historical anchors, not a substitute for reading current files.

## 10. Environment variables

Required or relevant names only:

- `DATABASE_URL`
- `DIRECT_URL`
- `AUTH_SECRET` — dedicated Production secret; provisioned and login-verified on 2026-08-12
- `NEXTAUTH_SECRET` — legacy fallback name
- `AUTH_URL`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_APP_URL`
- `RESEND_API_KEY` — configured in Production and delivery-verified; never store its value in Git
- `AUTH_EMAIL_FROM` — configured for the Resend onboarding sender during testing; replace with a verified custom-domain sender before customer launch
- Optional OAuth pairs: `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`, `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET`

Rules:

- Secrets belong in Vercel environment variables, never committed `.env` files.
- Scope values intentionally by environment. Production and Preview are separate scopes; do not assume changing one changes the other.
- Editing an environment variable does not alter an existing immutable deployment; redeploy after changes.
- Never paste complete connection strings or secrets into this knowledge base.

## 11. Current remaining work, in priority order

### Priority 0 — production hardening

1. Add and verify an owned sending domain in Resend, then replace the onboarding sender with a production sender on that domain.
2. Test registration verification with a non-owner test account after the custom domain is active. The owner forgot-password flow is already verified end to end and should not be repeated without a real need.
3. Add useful runtime observability/error monitoring so future failures do not require temporary diagnostic routes.

### Priority 1 — admin and commerce operations

1. Test every `/admin` section while authenticated as `SUPER_ADMIN`.
2. Verify create/edit/archive product flows and inventory updates against Supabase.
3. Verify categories, brands, customers, orders, coupons, reviews, and settings pages.
4. Add representative products/content only after CRUD flows are confirmed.
5. Verify storefront cart → checkout → order creation → admin order management.

### Priority 2 — product quality

1. Improve responsive/mobile layout and Arabic/RTL presentation where required.
2. Replace performance-sensitive `<img>` elements with appropriate Next.js Image usage.
3. Add automated smoke checks for production routes and authentication endpoints.
4. Review authorization separately from authentication; a valid session must not automatically grant admin access.

## 12. Things future assistants must not do

1. Do not create a new Vercel or Supabase project because a deployment URL changes.
2. Do not use the deleted project ref `juhbbeahctcgygqnvcwg`.
3. Do not restore the known-wrong `aws-0` pooler host for the active tenant.
4. Do not change the database password as the first response to `P1001`, `ENOTFOUND`, email failure, Auth.js configuration failure, or invalid store credentials.
5. Do not confuse the store-account password with the database password.
6. Do not hardcode an Auth secret, password, or full database URI in source.
7. Do not assume `Ready` means the live user flow works.
8. Do not re-add a public diagnostic endpoint and leave it deployed.
9. Do not delete a valid registered account merely because email delivery failed.
10. Do not run destructive SQL, reset the database, or recreate schema without a verified target and a recovery plan.

## 13. Verification checklist for future changes

Before editing:

1. Read this file completely.
2. Fetch current `main` and inspect `package.json`, `prisma/schema.prisma`, `src/lib/prisma.ts`, `src/auth.ts`, and the files relevant to the requested feature.
3. Confirm the canonical Vercel project and Supabase project ref.
4. Check for user-owned/unrelated worktree changes before editing.

After editing:

1. Run targeted TypeScript/lint/build checks.
2. Confirm the Git commit and Vercel deployment status.
3. Test the stable production URL, not only the generated deployment URL.
4. Verify the complete data flow: UI → action/API → database/external service → response.
5. For authentication work, test providers, CSRF, session, login, route protection, role authorization, and logout.
6. For database work, confirm the active project ref and query the resulting state.
7. Remove temporary diagnostics after they have served their purpose.
8. Update this file when the verified state, architecture, active blocker, or recovery lesson materially changes.

## 14. Store content and direction

Primary visual direction: a premium storefront inspired by the Mytheresa shopping experience, adapted for the user's store rather than copied.

Store contact content supplied previously:

- Phone: `+218918873131`
- WhatsApp: `https://wa.me/218918873131`
- Email: `cherieboutique.ly@gmail.com`
- Instagram: `instagram.com/cherie.boutique.ly`
- Facebook: `facebook.com/share/1EJ1kYL2iM`

Treat these as storefront content, not login credentials.

## 15. Short handoff prompt

Use this when opening a new Store-with-ai conversation:

> Continue my Store-with-ai project using repository `almukharimabdulrahman-ship-it/Store-with-ai`. Read `PROJECT_KNOWLEDGE_BASE.md` completely first, then verify the current GitHub `main`, Vercel Production, and Supabase state before changing anything. The recovered baseline has a live storefront, working database, working Auth.js credential login, and one verified `SUPER_ADMIN`; do not repeat old recovery steps unless current evidence shows the same failure. Never create duplicate projects, rotate passwords speculatively, expose secrets, or treat Vercel `Ready` as end-to-end proof. Work autonomously on safe technical decisions, preserve unrelated changes, verify the full flow after each change, and update the knowledge base whenever the verified project state materially changes.

## 16. Last updated state

- Active infrastructure blocker: **none**.
- Production storefront: **live**.
- Database: **connected**.
- Auth.js server configuration: **working**.
- Owner login: **working**.
- Owner role: **verified `SUPER_ADMIN`**.
- Dedicated `AUTH_SECRET`: **configured and login-verified in Production**.
- Resend forgot-password flow: **verified end to end for the owner using the onboarding sender; new-password login and Dashboard access succeeded, with no reset token left behind**.
- Remaining email work: **verify a custom sending domain and test registration verification for a non-owner address**.
- Immediate next task: verify the custom email domain when available, then verify all admin CRUD and commerce flows.
