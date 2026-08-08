"use server";
import { hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/auth";
import { createToken, hashToken } from "@/lib/auth/tokens";
import { emailSchema, loginSchema, registerSchema, resetPasswordSchema } from "@/lib/auth/validation";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/auth/email";

export type ActionState = { error?: string; success?: string };
const expiresIn = (hours: number) => new Date(Date.now() + hours * 60 * 60 * 1000);

export async function registerAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { error: "An account already exists for this email" };
  const role = await prisma.role.findUnique({ where: { code: "CUSTOMER" } });
  if (!role) return { error: "Registration is temporarily unavailable" };
  const user = await prisma.user.create({ data: { name: parsed.data.name, email: parsed.data.email, passwordHash: await hash(parsed.data.password, 12), roleId: role.id } });
  const { token, tokenHash } = createToken();
  await prisma.emailVerificationToken.create({ data: { userId: user.id, tokenHash, expiresAt: expiresIn(24) } });
  await sendVerificationEmail(user.email, token);
  return { success: "Account created. Check your email to verify it before signing in." };
}

export async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try { await signIn("credentials", { ...parsed.data, redirectTo: "/dashboard" }); }
  catch (error) { if (error instanceof AuthError) return { error: "Invalid credentials or unverified email" }; throw error; }
  return {};
}

export async function logoutAction() { await signOut({ redirectTo: "/login" }); }

export async function forgotPasswordAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  const response = { success: "If an account exists, a reset link has been sent." };
  if (!parsed.success) return response;
  const user = await prisma.user.findUnique({ where: { email: parsed.data } });
  if (!user) return response;
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
  const { token, tokenHash } = createToken();
  await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt: expiresIn(1) } });
  await sendPasswordResetEmail(user.email, token);
  return response;
}

export async function resetPasswordAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashToken(parsed.data.token) } });
  if (!record || record.expiresAt <= new Date()) return { error: "This reset link is invalid or expired" };
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash: await hash(parsed.data.password, 12) } }),
    prisma.passwordResetToken.deleteMany({ where: { userId: record.userId } }),
    prisma.session.deleteMany({ where: { userId: record.userId } }),
  ]);
  return { success: "Password updated. You can now sign in." };
}

export async function verifyEmailAction(token: string) {
  const record = await prisma.emailVerificationToken.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!record || record.expiresAt <= new Date()) redirect("/verify-email?status=invalid");
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { emailVerified: new Date() } }),
    prisma.emailVerificationToken.deleteMany({ where: { userId: record.userId } }),
  ]);
  redirect("/login?verified=1");
}
