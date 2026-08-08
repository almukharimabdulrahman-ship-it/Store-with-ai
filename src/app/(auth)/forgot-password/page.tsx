import { AuthForm } from "../auth-form";
import { forgotPasswordAction } from "../actions";
export default function ForgotPage() { return <><h1 className="my-6 text-2xl font-bold">Forgot password</h1><p className="mb-4 text-sm text-neutral-600">We will email a time-limited reset link.</p><AuthForm action={forgotPasswordAction} fields={[{ name: "email", label: "Email", type: "email", autoComplete: "email" }]} submit="Send reset link" /></> }
