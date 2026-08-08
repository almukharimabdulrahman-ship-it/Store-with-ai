import type { NextAuthConfig } from "next-auth";

export default {
  providers: [],
  pages: { signIn: "/login" },
  callbacks: {
    authorized({ auth }) { return Boolean(auth?.user); },
  },
} satisfies NextAuthConfig;
