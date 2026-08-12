import Link from "next/link";
import { StoreWordmark } from "@/components/storefront/store-wordmark";
import { getStoreProfile } from "@/lib/storefront";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const profile = await getStoreProfile();
  return <main className="min-h-screen bg-neutral-50 p-6"><div className="mx-auto mt-16 max-w-md rounded-xl bg-white p-8 shadow-sm"><Link href="/" className="inline-flex items-center gap-2 text-neutral-600"><span aria-hidden="true">←</span><StoreWordmark name={profile.name} className="text-2xl leading-none" /></Link>{children}</div></main>;
}
