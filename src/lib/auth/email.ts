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
    console.error("[auth email] Email delivery configuration missing", {
      hasResendApiKey: Boolean(apiKey),
      hasAuthEmailFrom: Boolean(from),
      environment: process.env.NODE_ENV,
    });

    if (process.env.NODE_ENV === "production") throw new Error("Email delivery is not configured");
    console.info(`[auth email] to=${to} subject=${subject}\n${text}`);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, text }),
  });

  if (!response.ok) {
    let providerMessage = "unknown";
    try {
      const body = (await response.json()) as { name?: string; message?: string };
      providerMessage = [body.name, body.message].filter(Boolean).join(": ") || "unknown";
    } catch {
      // Keep diagnostics safe and avoid logging response bodies we cannot parse.
    }

    console.error("[auth email] Resend rejected authentication email", {
      status: response.status,
      providerMessage,
    });
    throw new Error("Unable to send authentication email");
  }

  console.info("[auth email] Authentication email accepted by Resend", {
    status: response.status,
  });
}

export function sendVerificationEmail(email: string, token: string) {
  return sendEmail(email, "Verify your email", `Verify your email: ${appUrl()}/verify-email?token=${encodeURIComponent(token)}`);
}
export function sendPasswordResetEmail(email: string, token: string) {
  return sendEmail(email, "Reset your password", `Reset your password: ${appUrl()}/reset-password?token=${encodeURIComponent(token)}`);
}
