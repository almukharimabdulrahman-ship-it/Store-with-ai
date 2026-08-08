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
      const user = await prisma.user.findUnique({ where: { email: parsed.data.email }, include: { role: true } });
      if (!user?.passwordHash || !user.emailVerified || !(await compare(parsed.data.password, user.passwordHash))) return null;
      return { id: user.id, email: user.email, name: user.name, role: user.role.code };
    },
  }),
];
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) providers.push(Google);
if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) providers.push(GitHub);

export const { handlers, auth, signIn, signOut } = NextAuth({
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
