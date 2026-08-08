import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/authorization";
import { createCategory, toggleCategory } from "../actions";

export default async function CategoriesPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({ include:{parent:true}, orderBy:[{sortOrder:"asc"},{name:"asc"}] }).catch(()=>[]);
  return <div><h1 className="text-3xl font-bold">Categories</h1><form action={createCategory} className="mt-6 grid gap-3 rounded-xl border p-4 sm:grid-cols-4"><input name="name" required placeholder="Category name" className="rounded border px-3 py-2"/><select name="parentId" className="rounded border px-3 py-2"><option value="">No parent</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select><input name="sortOrder" type="number" defaultValue="0" className="rounded border px-3 py-2"/><button className="rounded bg-black px-4 py-2 text-white">Add category</button></form><div className="mt-6 space-y-2">{categories.map(c=><div key={c.id} className="flex items-center justify-between rounded-lg border p-3"><div><b>{c.name}</b><div className="text-sm text-neutral-500">{c.parent?`Parent: ${c.parent.name}`:"Top level"} · sort {c.sortOrder}</div></div><form action={toggleCategory.bind(null,c.id,!c.active)}><button className="rounded border px-3 py-1.5 text-sm">{c.active?"Deactivate":"Activate"}</button></form></div>)}{categories.length===0&&<p className="text-neutral-500">No categories yet.</p>}</div></div>;
}
