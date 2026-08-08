import Link from "next/link";
import { requireUser } from "@/lib/auth/authorization";
export default async function DashboardPage() { const user = await requireUser(); return <main className="p-8"><h1 className="text-3xl font-bold">Dashboard</h1><p className="my-4">Welcome, {user.name ?? user.email}.</p><Link href="/account">Account settings</Link></main> }
