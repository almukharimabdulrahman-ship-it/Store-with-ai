import type { NextAuthConfig } from "next-auth";

// Prefer Auth.js' dedicated secret. Until it is provisioned in Vercel, derive
// an app-scoped fallback from an existing server-only secret so production
// authentication does not fail with MissingSecret. Adding AUTH_SECRET later
// automatically takes precedence without a code change.
const authSecret =
  process.env.AUTH_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  (process.env.DATABASE_URL ? `store-with-ai/auth/v1:${process.env.DATABASE_URL}` : undefined) ??
  (process.env.DIRECT_URL ? `store-with-ai/auth/v1:${process.env.DIRECT_URL}` : undefined);

export default {
  secret: authSecret,
  providers: [],
  pages: { signIn: "/login" },
  callbacks: {
    authorized({ auth }) { return Boolean(auth?.user); },
  },
} satisfies NextAuthConfig;
