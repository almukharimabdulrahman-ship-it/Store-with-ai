import { requireAdmin } from "@/lib/auth/authorization";
import { getAdminInventory } from "@/lib/admin";

export default async function InventoryPage() {
  await requireAdmin();
  const items = await getAdminInventory();
  return <div><h1 className="text-3xl font-bold">Inventory</h1><div className="mt-6 overflow-x-auto rounded-xl border"><table className="w-full text-sm"><thead><tr className="border-b bg-neutral-50 text-left"><th className="p-3">Product</th><th className="p-3">SKU</th><th className="p-3">Variant</th><th className="p-3">Available</th><th className="p-3">Reserved</th><th className="p-3">Threshold</th><th className="p-3">Status</th></tr></thead><tbody>{items.map(i=>{const low=i.availableQuantity<=i.lowStockThreshold;return <tr key={i.id} className="border-b"><td className="p-3">{i.variant.product.name}</td><td className="p-3">{i.variant.sku}</td><td className="p-3">{i.variant.name ?? "—"}</td><td className="p-3">{i.availableQuantity}</td><td className="p-3">{i.reservedQuantity}</td><td className="p-3">{i.lowStockThreshold}</td><td className="p-3"><span className={low?"rounded bg-red-100 px-2 py-1 text-red-700":"rounded bg-green-100 px-2 py-1 text-green-700"}>{low?"Low stock":"Healthy"}</span></td></tr>})}</tbody></table>{items.length===0&&<p className="p-6 text-neutral-500">No inventory records yet.</p>}</div></div>;
}
