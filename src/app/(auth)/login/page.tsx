import Link from "next/link";
import { AuthForm } from "../auth-form";
import { loginAction } from "../actions";
import { signIn } from "@/auth";

export default function LoginPage() {
  return <><h1 className="my-6 text-2xl font-bold">Sign in</h1><AuthForm action={loginAction} fields={[{ name: "email", label: "Email", type: "email", autoComplete: "email" }, { name: "password", label: "Password", type: "password", autoComplete: "current-password" }]} submit="Sign in" />
  <div className="mt-4 flex justify-between text-sm"><Link href="/register">Create account</Link><Link href="/forgot-password">Forgot password?</Link></div>
  {(process.env.AUTH_GOOGLE_ID || process.env.AUTH_GITHUB_ID) && <div className="mt-6 space-y-2 border-t pt-6">{process.env.AUTH_GOOGLE_ID && <form action={async () => { "use server"; await signIn("google", { redirectTo: "/dashboard" }); }}><button className="w-full rounded border p-2">Continue with Google</button></form>}{process.env.AUTH_GITHUB_ID && <form action={async () => { "use server"; await signIn("github", { redirectTo: "/dashboard" }); }}><button className="w-full rounded border p-2">Continue with GitHub</button></form>}</div>}</>;
}
