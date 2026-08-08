import Link from "next/link";
import { AuthForm } from "../auth-form";
import { registerAction } from "../actions";
export default function RegisterPage() { return <><h1 className="my-6 text-2xl font-bold">Create account</h1><AuthForm action={registerAction} fields={[{ name: "name", label: "Name", autoComplete: "name" }, { name: "email", label: "Email", type: "email", autoComplete: "email" }, { name: "password", label: "Password", type: "password", autoComplete: "new-password" }]} submit="Register" /><p className="mt-4 text-sm">Already registered? <Link href="/login">Sign in</Link></p></> }
