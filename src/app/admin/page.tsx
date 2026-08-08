import { requireAdmin } from "@/lib/auth/authorization";
export default async function AdminPage() { const user = await requireAdmin(); return <main className="p-8"><h1 className="text-3xl font-bold">Administration</h1><p className="my-4">Signed in as {user.email} ({user.role}).</p></main> }
