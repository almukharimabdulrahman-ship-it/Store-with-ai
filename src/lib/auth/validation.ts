import { z } from "zod";

export const emailSchema = z.string().trim().toLowerCase().email("Enter a valid email address").max(254);
export const passwordSchema = z.string()
  .min(12, "Password must be at least 12 characters")
  .max(72)
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[0-9]/, "Password must include a number");
export const loginSchema = z.object({ email: emailSchema, password: z.string().min(1, "Password is required") });
export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: emailSchema,
  password: passwordSchema,
});
export const resetPasswordSchema = z.object({ token: z.string().min(1), password: passwordSchema });
