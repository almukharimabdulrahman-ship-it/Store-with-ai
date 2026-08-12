# Store-with-ai — Persistent Project Knowledge Base

> Purpose: persistent handoff context for future ChatGPT/Codex sessions after long chats are deleted. Read this file before making changes.
>
> Security rule: never store passwords, API keys, database URIs, Resend keys, Auth secrets, or other credentials in this file or in Git. Store only environment-variable names and setup rules.

## 1. Owner intent and working style

- Goal: get a working production e-commerce store first, then improve design/features.
- User is not a programmer and expects the assistant/Codex to choose implementation details and give exact UI steps when manual actions are required.
- Avoid creating duplicate Vercel/Supabase projects. Keep one canonical GitHub repo, one canonical Vercel project, and one canonical Supabase project.
- Prefer fixing the current deployment over starting another project unless the current project is irrecoverable.

## 2. Canonical GitHub source

- Repository: `almukharimabdulrahman-ship-it/Store-with-ai`
- Main branch: `main`
- Current deployment source observed in Vercel logs: commit `7befd2d` (`chore(db): prepare clean database during deploy`).
- GitHub ↔ Vercel integration is installed and has repository access.

## 3. Current stack

Current repository is a Next.js application, not the older Create React App prototype.

Key packages from `package.json`:

- Next.js `15.5.21`
- React `19.1.0`
- TypeScript `^5`
- Prisma / `@prisma/client` 6.x
- NextAuth/Auth.js v5 beta
- `@auth/prisma-adapter`
- `bcryptjs`
- `zod`
- Tailwind CSS 4
- `tsx`

Current production build command:

```bash
prisma generate && prisma db push --skip-generate && tsx prisma/bootstrap.ts && next build
```

Important: the Prisma 7 upgrade notice is only a warning. Do not upgrade Prisma while recovering production unless a separate task explicitly requires it.

## 4. Database architecture

Prisma datasource:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

Main domain models include:

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
- Product
- ProductCategory
- ProductImage
- ProductVariant
- Inventory
- Cart / CartItem
- Wishlist / WishlistItem
- Coupon
- Order / OrderItem
- Payment
- Review
- Notification
- StoreSetting

The project intentionally moved to a CLEAN Supabase database after the previous database became confused/broken and was deleted.

### Bootstrap behavior

`prisma/bootstrap.ts` runs during deployment and upserts these roles:

- `SUPER_ADMIN`
- `ADMIN`
- `MANAGER`
- `CUSTOMER`

It also creates `StoreSetting` key `store.profile` with:

- name: `Store with AI`
- currency: `LYD`
- country: `Libya`

Bootstrap does NOT currently create an administrator user. After the database connection/build succeeds, an admin/super-admin account still needs to be created or promoted before the dashboard can be used.

## 5. Canonical Supabase project

Current clean Supabase Project Ref observed in logs:

`lnzpdfotfutkqsiknrbq`

A build log confirmed the attempted direct host:

`db.lnzpdfotfutkqsiknrbq.supabase.co:5432`

Do not reuse connection strings containing old/deleted project refs such as:

`juhbbeahctcgygqnvcwg`

That old ref previously caused:

`FATAL: (ENOTFOUND) tenant/user postgres.juhbbeahctcgygqnvcwg not found`

### Vercel database environment variables

Required names:

- `DATABASE_URL`
- `DIRECT_URL`

Recovery configuration used/selected for Vercel + Supabase networking:

- Use a Supabase **pooler URI** that Vercel can reach over IPv4.
- A true Supabase Direct Connection (`db.<ref>.supabase.co:5432`) produced Prisma `P1001` from the Vercel build environment.
- Previous successful recovery approach: use the **Session pooler URI** for `DIRECT_URL`; during recovery it is acceptable to use the same Session pooler URI for both `DATABASE_URL` and `DIRECT_URL` to get `prisma db push` working.
- Transaction pooler is suitable for runtime/serverless use, but do not switch connection methods casually while diagnosing. Verify the host/project ref every time.

Never commit the actual URI/password. Database password is the Supabase project database password and is distinct from Supabase account login, GitHub login, store user passwords, etc.

## 6. Current deployment blocker (latest known state)

Latest reported Vercel build reached Prisma successfully, then failed here:

```text
Datasource "db": PostgreSQL database "postgres", schema "public" at "db.lnzpdfotfutkqsiknrbq.supabase.co:5432"
Error: P1001: Can't reach database server at `db.lnzpdfotfutkqsiknrbq.supabase.co:5432`
```

Interpretation:

- Project ref is now correct (`lnzpdfotfutkqsiknrbq`).
- The remaining issue is reachability/network method, not a missing Prisma env var and not the previous deleted tenant.
- Next action: replace Vercel `DIRECT_URL` with the **Session pooler URI** from this SAME Supabase project, and if needed set both `DATABASE_URL` and `DIRECT_URL` temporarily to that same Session pooler URI; then Redeploy with build cache disabled.

Expected next milestones after this P1001 is fixed:

1. `prisma db push` succeeds and creates/synchronizes tables.
2. `tsx prisma/bootstrap.ts` prints `[db bootstrap] roles and store profile are ready`.
3. `next build` completes.
4. Vercel deployment becomes `Ready`.
5. Test production storefront.
6. Create/promote admin user and test `/dashboard`.
7. Test auth: register, verify email, login, forgot-password/reset-password.
8. Only after stability, seed products/content and continue UI refinement.

## 7. Vercel behavior that previously caused confusion

- Every deployment gets a unique generated deployment hostname such as `store-with-<random>...vercel.app` / `...projects.vercel.app`.
- This does NOT mean a new Vercel project is created every time.
- The stable production domain/project alias should remain the canonical `store-with-ai.vercel.app` when assigned to the latest successful production deployment.
- Editing environment variables then pressing Redeploy creates another deployment of the same project.
- Redeploy recovery preference: Production environment, do NOT use existing Build Cache when debugging DB/env changes.

## 8. Authentication work already done

Previous work investigated/fixed auth paths including:

- `/login`
- `/register`
- `/forgot-password`
- reset-password flow
- email verification

Important changes/history:

- Login/password-reset email lookup was changed to handle stored email casing differences (case-insensitive lookup).
- Forgot-password action was made fail-safe so email/database outages do not crash the server action or disclose account existence.
- Password-reset tokens that cannot be delivered should not remain valid.
- Resend delivery diagnostics were added in later work.

Observed old error before database reset:

```text
Invalid `prisma.user.findFirst()` invocation:
Authentication failed against database server; database credentials for `postgres` are not valid.
```

That belonged to the old/broken database configuration and should not be used to diagnose the clean database unless it reappears with the NEW project ref.

## 9. Email / Resend

Resend is used for verification/password-reset transactional email.

Relevant environment variables include (names only):

- Resend API key variable used by repository code
- `AUTH_EMAIL_FROM`

Earlier temporary sender value used Resend onboarding sender format, e.g. `Store with AI <onboarding@resend.dev>`.

Rules:

- API keys are secrets; store only in Vercel environment variables.
- If forgot-password UI returns its generic success message but Resend shows no sent email, inspect Vercel runtime logs first. The generic message is intentionally returned even when delivery fails.

## 10. Dashboard

- Dashboard code is part of the GitHub application and was not lost when the old database was deleted.
- A clean DB starts with no users.
- `bootstrap.ts` only creates roles/settings, not a dashboard admin.
- After production database deployment succeeds, create or promote the owner account to `SUPER_ADMIN`/`ADMIN`, then test `/dashboard`.

## 11. Product/UI direction and older prototype references

Primary visual reference supplied by the user:

- Mytheresa storefront/sale experience (reference URL was supplied separately).

Older prototype structure (historical reference only; current repo is Next.js):

```text
src/
  components/
    Header.tsx
    Hero.tsx
    CollectionHighlight.tsx
    CategoriesSection.tsx
    FeaturedCollection.tsx
    ProductCard.tsx
    BrandStory.tsx
    Footer.tsx
  layouts/MainLayout.tsx
  pages/Home.tsx
  data/constants.ts
  data/categories.ts
  data/products.ts
  types/product.ts
```

Older prototype libraries noted:

- `lucide-react` for general icons
- `@icons-pack/react-simple-icons` for social brand icons such as Instagram/Facebook
- Tailwind CSS

These are design/history references only. Before adding a package, check the CURRENT `package.json`; do not assume the older CodeSandbox package list matches the Next.js repo.

## 12. Store contact details to preserve in site content

These were supplied for the store prototype/content:

- Phone: `+218918873131`
- WhatsApp: `https://wa.me/218918873131`
- Email: `cherieboutique.ly@gmail.com`
- Instagram: `instagram.com/cherie.boutique.ly`
- Facebook: `facebook.com/share/1EJ1kYL2iM`

Treat these as storefront content, not login credentials.

## 13. Project hygiene rules for future sessions

Before changing infrastructure:

1. Read this file.
2. Fetch current `package.json`, `prisma/schema.prisma`, and latest Git commit/deployment state.
3. Identify canonical Supabase ref and Vercel project before editing variables.
4. Never create another Supabase/Vercel project simply because a deployment gets a new random URL.
5. Never guess env-variable values; use the current project's Supabase Connect screen.
6. Never expose passwords/API keys in chat, GitHub, screenshots, or logs when avoidable.
7. If the build fails, diagnose the FIRST real error after Prisma/Next warnings; warnings about Prisma 7 are not production blockers.
8. Prefer one change → one redeploy → inspect logs, rather than changing several infrastructure variables at once.

## 14. Quick handoff prompt for a new ChatGPT conversation

Use this exact instruction when starting a new chat:

> Continue my Store-with-ai project. Read `PROJECT_KNOWLEDGE_BASE.md` in `almukharimabdulrahman-ship-it/Store-with-ai` first, then inspect current GitHub/Vercel/Supabase state before proposing changes. The immediate goal is to get the clean Supabase database and Vercel production deployment working, then restore admin dashboard access. Do not create duplicate projects and do not ask me to make programming decisions unless a manual account/UI action is unavoidable.

## 15. Last updated state

Last known blocking error: Prisma `P1001` against the NEW project direct host `db.lnzpdfotfutkqsiknrbq.supabase.co:5432` during Vercel build.

Next recovery action: use the NEW project's Supabase Session pooler URI for `DIRECT_URL` (and, if necessary during bootstrap recovery, both `DATABASE_URL` and `DIRECT_URL`), then Redeploy without build cache and inspect the lines after `Datasource "db"`.