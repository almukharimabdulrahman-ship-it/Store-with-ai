import { requireUser } from "@/lib/auth/authorization";
import { logoutAction } from "@/app/(auth)/actions";
export default async function AccountPage() { const user = await requireUser(); return <main className="p-8"><h1 className="text-3xl font-bold">Account</h1><p className="my-4">{user.email} · {user.role}</p><form action={logoutAction}><button className="rounded bg-black px-4 py-2 text-white">Sign out</button></form></main> }
