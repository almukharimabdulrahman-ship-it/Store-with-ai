import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/authorization";
import { saveStoreSettings } from "../actions";

type Profile = { name?: string; currency?: string; country?: string; supportEmail?: string; supportPhone?: string };

export default async function SettingsPage() {
  await requireAdmin();
  const setting = await prisma.storeSetting.findUnique({ where:{key:"store.profile"} }).catch(()=>null);
  const profile = (setting?.value ?? {}) as Profile;
  return <div><h1 className="text-3xl font-bold">Settings</h1><form action={saveStoreSettings} className="mt-6 grid max-w-2xl gap-4 rounded-xl border p-5 sm:grid-cols-2"><label className="text-sm">Store name<input name="name" required defaultValue={profile.name ?? "Store with AI"} className="mt-1 w-full rounded border px-3 py-2"/></label><label className="text-sm">Currency<input name="currency" required maxLength={3} defaultValue={profile.currency ?? "LYD"} className="mt-1 w-full rounded border px-3 py-2 uppercase"/></label><label className="text-sm">Country<input name="country" required defaultValue={profile.country ?? "Libya"} className="mt-1 w-full rounded border px-3 py-2"/></label><label className="text-sm">Support email<input name="supportEmail" type="email" defaultValue={profile.supportEmail ?? ""} className="mt-1 w-full rounded border px-3 py-2"/></label><label className="text-sm sm:col-span-2">Support phone<input name="supportPhone" defaultValue={profile.supportPhone ?? ""} className="mt-1 w-full rounded border px-3 py-2"/></label><button className="rounded bg-black px-4 py-2 text-white sm:col-span-2">Save settings</button></form></div>;
}
