const appUrl = () => {
  const configuredUrl =
    process.env.AUTH_URL ??
    process.env.NEXTAUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL;
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;

  if (configuredUrl) return configuredUrl.replace(/\/$/, "");
  if (vercelUrl) return `https://${vercelUrl.replace(/\/$/, "")}`;
  return "http://localhost:3000";
};

async function sendEmail(to: string, subject: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.AUTH_EMAIL_FROM;
  if (!apiKey || !from) {
    if (process.env.NODE_ENV === "production") throw new Error("Email delivery is not configured");
    console.info(`[auth email] to=${to} subject=${subject}\n${text}`);
    return;
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, text }),
  });
  if (!response.ok) throw new Error("Unable to send authentication email");
}

export function sendVerificationEmail(email: string, token: string) {
  return sendEmail(email, "Verify your email", `Verify your email: ${appUrl()}/verify-email?token=${encodeURIComponent(token)}`);
}
export function sendPasswordResetEmail(email: string, token: string) {
  return sendEmail(email, "Reset your password", `Reset your password: ${appUrl()}/reset-password?token=${encodeURIComponent(token)}`);
}
