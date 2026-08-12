import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import type { Provider } from "next-auth/providers";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/auth/validation";

const baseAdapter = PrismaAdapter(prisma);
const providers: Provider[] = [
  Credentials({
    credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
    async authorize(raw) {
      const parsed = loginSchema.safeParse(raw);
      if (!parsed.success) return null;
      // Login input is normalized to lowercase, while externally provisioned
      // accounts may retain mixed-case email text in PostgreSQL.
      const user = await prisma.user.findFirst({
        where: { email: { equals: parsed.data.email, mode: "insensitive" } },
        include: { role: true },
      });
      if (!user?.passwordHash || !user.emailVerified || !(await compare(parsed.data.password, user.passwordHash))) return null;
      return { id: user.id, email: user.email, name: user.name, role: user.role.code };
    },
  }),
];
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) providers.push(Google);
if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) providers.push(GitHub);

// Keep the full Auth.js instance on the same secret as middleware. A dedicated
// AUTH_SECRET remains the preferred value; the server-only database credential
// is only a stable, app-scoped fallback for existing Vercel deployments.
const authSecret =
  process.env.AUTH_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  (process.env.DATABASE_URL ? `store-with-ai/auth/v1:${process.env.DATABASE_URL}` : undefined) ??
  (process.env.DIRECT_URL ? `store-with-ai/auth/v1:${process.env.DIRECT_URL}` : undefined);

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: authSecret,
  adapter: {
    ...baseAdapter,
    async createUser(data) {
      const role = await prisma.role.findUniqueOrThrow({ where: { code: "CUSTOMER" } });
      return prisma.user.create({
        data: {
          id: data.id,
          email: data.email,
          emailVerified: data.emailVerified,
          image: data.image,
          name: data.name,
          roleId: role.id,
        },
      });
    },
  },
  providers,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.role = user.role; }
      if ((!token.role || !token.id) && token.sub) {
        const stored = await prisma.user.findUnique({ where: { id: token.sub }, include: { role: true } });
        if (stored) { token.id = stored.id; token.role = stored.role.code; }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) { session.user.id = token.id ?? token.sub ?? ""; session.user.role = token.role ?? "CUSTOMER"; }
      return session;
    },
  },
});
